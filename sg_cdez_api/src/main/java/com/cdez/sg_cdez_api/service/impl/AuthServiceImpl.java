package com.cdez.sg_cdez_api.service.impl;

import com.cdez.sg_cdez_api.dto.request.ActivateAccountRequest;
import com.cdez.sg_cdez_api.dto.request.CambiaContrasenaRequest;
import com.cdez.sg_cdez_api.dto.request.LoginRequest;
import com.cdez.sg_cdez_api.dto.request.ResendVerificationRequest;
import com.cdez.sg_cdez_api.dto.response.JwtAuthResponse;
import com.cdez.sg_cdez_api.entity.CustomUserDetails;
import com.cdez.sg_cdez_api.entity.EmailVerificationToken;
import com.cdez.sg_cdez_api.entity.Personal;
import com.cdez.sg_cdez_api.repository.AuthRepository;
import com.cdez.sg_cdez_api.repository.EmailVerificationTokenRepository;
import com.cdez.sg_cdez_api.repository.PersonalRepository;
import com.cdez.sg_cdez_api.service.AuthService;
import com.cdez.sg_cdez_api.service.JwtService;
import com.cdez.sg_cdez_api.service.VerificationService;
import com.cdez.sg_cdez_api.util.AuthHelper;
import jakarta.transaction.Transactional;
import jakarta.validation.constraints.Email;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final AuthRepository REPOSITORY;
    private final PersonalRepository PERSONAL_REPOSITORY;
    private final EmailVerificationTokenRepository VERIFICATION_REPOSITORY;
    private final VerificationService VERIFICATION_SERVICE;
    private final AuthHelper AUTH_HELPER;


    @Override
    public JwtAuthResponse iniciarSesion(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsuario(),
                        loginRequest.getContrasena()
                )
        );

        //Si pasa los filtros, entonces las credenciales son válidas
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

        Personal usuario = REPOSITORY.findByPersonalId(userDetails.getUsuarioId())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        //Generar y retornar JWT
        String jwt = jwtService.generateToken(userDetails);
        JwtAuthResponse response = new JwtAuthResponse();
        response.setAccessToken(jwt);

        return response;
    }

    @Override
    public String cambiarContrasena(CambiaContrasenaRequest request){
        Personal usuario = AUTH_HELPER.obtenerUsuarioAutenticado();
        AUTH_HELPER.actualizarContrasena(usuario, request.getNuevaContransena(), request.getConfirmarContrasena());
        REPOSITORY.save(usuario);
        return "La contraseña ha sido actualizada";
    }

    @Override
    public void activarCuenta(ActivateAccountRequest request) {
        EmailVerificationToken verificationToken = VERIFICATION_REPOSITORY.findByToken(request.token())
                .orElseThrow(() -> new RuntimeException("Token Inválido."));

        if (verificationToken.isUsado()){
            throw new RuntimeException("El token ya fue utilizado.");
        }

        if (verificationToken.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("El token ha expirado.");
        }

        Personal personal = verificationToken.getPersonal();
        AUTH_HELPER.actualizarContrasena(personal, request.contrasena(), request.confirmarContrasena());

        personal.setEmailVerificado(true);

        verificationToken.setUsado(true);
        PERSONAL_REPOSITORY.save(personal);
        VERIFICATION_REPOSITORY.save(verificationToken);

    }

    @Transactional
    @Override
    public void reenviarVerificacion(ResendVerificationRequest request) {
        Optional<Personal> personalOptional =
                PERSONAL_REPOSITORY.findByUsuario(request.email());

        if (personalOptional.isEmpty()) {
            return;
        }

        Personal personal = personalOptional.get();

        if (personal.isEmailVerificado()) {
            return;
        }

        VERIFICATION_SERVICE.generarYEnviarToken(personal);

    }

}
