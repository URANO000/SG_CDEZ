package com.cdez.sg_cdez_api.service.impl;

import com.cdez.sg_cdez_api.dto.request.*;
import com.cdez.sg_cdez_api.dto.response.JwtAuthResponse;
import com.cdez.sg_cdez_api.entity.*;
import com.cdez.sg_cdez_api.repository.*;
import com.cdez.sg_cdez_api.service.*;
import com.cdez.sg_cdez_api.util.AuthHelper;
import com.cdez.sg_cdez_api.util.Exceptions.TokenExpiradoException;
import com.cdez.sg_cdez_api.util.Exceptions.TooManyRequestsException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;

import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Locale;
import java.util.Optional;
import java.util.LinkedHashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final AuthRepository REPOSITORY;
    private final PersonalRepository PERSONAL_REPOSITORY;
    private final EmailVerificationTokenRepository VERIFICATION_REPOSITORY;
    private final PasswordResetTokenRepository RESET_REPOSITORY;
    private final TokenService TOKEN_SERVICE;
    private final AuthHelper AUTH_HELPER;
    private final RateLimiterService RATE_LIMITER_SERVICE;
    private final RefreshTokenService REFRESH_TOKEN_SERVICE;
    private final CustomUserDetailsService USER_DETAILS_SERVICE;
    private final AuditoriaService AUDITORIA_SERVICE;


    @Override
    public JwtAuthResponse iniciarSesion(LoginRequest loginRequest, String ip) {
        // Primero rate limiting
        boolean ipPermitida = RATE_LIMITER_SERVICE.permitir(
                "login:ip:" + ip,
                10,
                Duration.ofMinutes(1)
        );

        String usuarioReq = loginRequest.getUsuario()
                .trim()
                .toLowerCase(Locale.ROOT);

        boolean usuarioPermitido = RATE_LIMITER_SERVICE.permitir(
                "login:usuario:" + usuarioReq,
                5,
                Duration.ofMinutes(5)
        );

        if(!ipPermitida || !usuarioPermitido){
            throw new TooManyRequestsException("Demasiados intentos de inicio de sesión. Intente nuevamente más tarde.");
        }


        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsuario(),
                        loginRequest.getContrasena()
                )
        );

        //Si pasa los filtros, entonces las credenciales son válidas
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

        //Generar y retornar JWT
        String jwt = jwtService.generateToken(userDetails);
        JwtAuthResponse response = new JwtAuthResponse();
        response.setAccessToken(jwt);
        response.setRecordarme(loginRequest.isRecordarme());
        Personal personal = PERSONAL_REPOSITORY
                .findById(userDetails.getUsuarioId())
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.UNAUTHORIZED,
                                "Usuario no encontrado."
                        )
                );

        if (loginRequest.isRecordarme()) {
            REFRESH_TOKEN_SERVICE.revocarTodosPorPersonal(
                    personal.getPersonalId()
            );

            String refreshToken =
                    REFRESH_TOKEN_SERVICE.crearRefreshToken(personal);

            response.setRefreshToken(refreshToken);
        }
        Map<String, Object> cambios = new LinkedHashMap<>();

        cambios.put("direccionIp", ip);
        cambios.put(
                "recordarme",
                loginRequest.isRecordarme()
        );

        AUDITORIA_SERVICE.registrarAccion(
                personal,
                "INICIAR_SESION",
                "AUTENTICACION",
                "SESION",
                personal.getPersonalId().toString(),
                "El usuario inició sesión.",
                cambios
        );
        return response;
    }

    @Override
    public void registrarCierreSesion(String ip) {
        Personal personal =
                AUTH_HELPER.obtenerUsuarioAutenticado();

        Map<String, Object> cambios =
                new LinkedHashMap<>();

        cambios.put("direccionIp", ip);

        AUDITORIA_SERVICE.registrarAccion(
                personal,
                "CERRAR_SESION",
                "AUTENTICACION",
                "SESION",
                personal.getPersonalId().toString(),
                "El usuario cerró sesión.",
                cambios
        );
    }

    @Transactional
    @Override
    public String cambiarContrasena(
            CambiaContrasenaRequest request
    ) {
        Personal usuario = AUTH_HELPER.obtenerUsuarioAutenticado();
        AUTH_HELPER.actualizarContrasena(
                usuario,
                request.getNuevaContransena(),
                request.getConfirmarContrasena()
        );
        REPOSITORY.save(usuario);

        // Invalidar todas las sesiones persistentes después de cambiar la contraseña
        REFRESH_TOKEN_SERVICE.revocarTodosPorPersonal(
                usuario.getPersonalId()
        );
        AUDITORIA_SERVICE.registrarAccion(
                usuario,
                "CAMBIAR_CONTRASENA",
                "AUTENTICACION",
                "PERSONAL",
                usuario.getPersonalId().toString(),
                "El usuario cambió su contraseña.",
                null
        );

        return "La contraseña ha sido actualizada";
    }

    @Override
    public void activarCuenta(ActivateAccountRequest request) {
        EmailVerificationToken verificationToken = VERIFICATION_REPOSITORY.findByToken(request.token())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Token Inválido."
                ));

        if (verificationToken.isUsado()){
            throw new RuntimeException("El token ya fue utilizado.");
        }

        if (verificationToken.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new TokenExpiradoException();
        }

        Personal personal = verificationToken.getPersonal();
        AUTH_HELPER.actualizarContrasena(personal, request.contrasena(), request.confirmarContrasena());

        personal.setEmailVerificado(true);

        verificationToken.setUsado(true);
        PERSONAL_REPOSITORY.save(personal);
        VERIFICATION_REPOSITORY.save(verificationToken);

        AUDITORIA_SERVICE.registrarAccion(
                personal,
                "ACTIVAR_CUENTA",
                "AUTENTICACION",
                "PERSONAL",
                personal.getPersonalId().toString(),
                "El usuario activó su cuenta.",
                null
        );
    }

    @Transactional
    @Override
    public void reenviarVerificacion(ResendVerificationRequest request) {
        EmailVerificationToken token = VERIFICATION_REPOSITORY.findByToken(request.token())
                .orElseThrow(() -> new RuntimeException("Token no encontrado."));

        Personal personal = token.getPersonal();

        if (personal == null) {
            return;
        }

        if (personal.isEmailVerificado()) {
            return;
        }

        TOKEN_SERVICE.generarYEnviarVerificacionToken(personal);

    }

    public void forgotPassword(ForgotPasswordRequest request) {
        String correo = request.correo();
        correo = correo.trim().toLowerCase();

        Optional<Personal> personal = REPOSITORY.findByUsuario(correo);

        if (personal.isEmpty()) {
            return;
        }

        TOKEN_SERVICE.generarYEnviarResetToken(personal.get());
    }

    @Transactional
    @Override
    public void resetContrasena(ResetPasswordRequest request) {
        PasswordResetToken resetToken = RESET_REPOSITORY.findByToken(request.token())
                .orElseThrow(() -> new RuntimeException("Token inválido."));

        if(resetToken.isUsado()){
            throw new RuntimeException("El token ya fue utilizado.");
        }

        if(resetToken.getExpiresAt().isBefore(LocalDateTime.now())){
            throw new RuntimeException("El token ha expirado.");
        }

        Personal personal = resetToken.getPersonal();

        AUTH_HELPER.actualizarContrasena(
                personal,
                request.contrasena(),
                request.confirmarContrasena()
        );

        resetToken.setUsado(true);

        PERSONAL_REPOSITORY.save(personal);
        RESET_REPOSITORY.save(resetToken);
        REFRESH_TOKEN_SERVICE.revocarTodosPorPersonal(
                personal.getPersonalId()
        );
        AUDITORIA_SERVICE.registrarAccion(
                personal,
                "RESTABLECER_CONTRASENA",
                "AUTENTICACION",
                "PERSONAL",
                personal.getPersonalId().toString(),
                "El usuario restableció su contraseña.",
                null
        );
    }

    @Override
    @Transactional
    public JwtAuthResponse renovarSesion(String refreshToken) {
        RefreshToken tokenActual = REFRESH_TOKEN_SERVICE.validarRefreshToken(refreshToken);
        Personal personal =
                tokenActual.getPersonal();
        if (!personal.isActivo()) {REFRESH_TOKEN_SERVICE.revocarTodosPorPersonal(personal.getPersonalId());
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "La cuenta no se encuentra activa.");
        }
        CustomUserDetails userDetails = (CustomUserDetails) USER_DETAILS_SERVICE.loadUserById(personal.getPersonalId());
        String nuevoRefreshToken = REFRESH_TOKEN_SERVICE.rotarRefreshToken(refreshToken);
        String nuevoAccessToken = jwtService.generateToken(userDetails);
        JwtAuthResponse response = new JwtAuthResponse();
        response.setAccessToken(nuevoAccessToken);
        response.setRefreshToken(nuevoRefreshToken);
        response.setRecordarme(true);
        return response;
    }
}
