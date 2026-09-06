package com.cdez.sg_cdez_api.controller;

import com.cdez.sg_cdez_api.dto.request.*;
import com.cdez.sg_cdez_api.dto.response.*;
import com.cdez.sg_cdez_api.entity.CustomUserDetails;
import com.cdez.sg_cdez_api.service.*;
import com.cdez.sg_cdez_api.util.Exceptions.TokenExpiradoException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.core.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.beans.factory.annotation.Value;

import java.time.Instant;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService SERVICE;
    private final PersonalService PERSONAL_SERVICE;
    private final JwtService JWT_SERVICE;
    private final RefreshTokenService REFRESH_TOKEN_SERVICE;

    @Value("${app.cookie.secure}")
    private boolean cookieSecure;

    @Value("${app.cookie.same-site}")
    private String cookieSameSite;

    //Login Api
    @PostMapping("/iniciarSesion")
    public ResponseEntity<Void> iniciarSesion(
            @RequestBody LoginRequest loginRequest,
            HttpServletRequest request
    ) {
        // Si quedó un refresh token anterior en el navegador, se revoca antes de crear una nueva sesión
        String refreshAnterior =
                obtenerCookie(
                        request,
                        "refresh_token"
                );
        if (refreshAnterior != null) {
            REFRESH_TOKEN_SERVICE.revocarToken(
                    refreshAnterior
            );
        }
        JwtAuthResponse authResponse =
                SERVICE.iniciarSesion(
                        loginRequest,
                        request.getRemoteAddr()
                );
        ResponseCookie accessCookie =
                ResponseCookie.from(
                                "access_token",
                                authResponse.getAccessToken()
                        )
                        .httpOnly(true)
                        .secure(true) // true en producción
                        .sameSite("Strict")
                        .path("/")
                        .build();

        ResponseEntity.BodyBuilder response =
                ResponseEntity.ok();

        response.header(
                HttpHeaders.SET_COOKIE,
                accessCookie.toString()
        );

        if (
                authResponse.isRecordarme()
                        && authResponse.getRefreshToken() != null
        ) {

            ResponseCookie refreshCookie =
                    ResponseCookie.from(
                                    "refresh_token",
                                    authResponse.getRefreshToken()
                            )
                            .httpOnly(true)
                            .secure(cookieSecure)
                            .sameSite(cookieSameSite)
                            .path("/api/auth")
                            .maxAge(
                                    REFRESH_TOKEN_SERVICE
                                            .getExpirationMs()
                                            / 1000
                            )
                            .build();

            response.header(
                    HttpHeaders.SET_COOKIE,
                    refreshCookie.toString()
            );

        } else {

            // Nos aseguramos de eliminar cualquier
            // refresh cookie antigua.
            ResponseCookie borrarRefresh =
                    crearCookieEliminada(
                            "refresh_token",
                            "/api/auth"
                    );

            response.header(
                    HttpHeaders.SET_COOKIE,
                    borrarRefresh.toString()
            );
        }

        return response.build();
    }

    @PostMapping("/cerrarSesion")
    public ResponseEntity<Void> cerrarSesion(
            HttpServletRequest request
    ) {
        SERVICE.registrarCierreSesion(
                request.getRemoteAddr()
        );

        String refreshToken =
                obtenerCookie(
                        request,
                        "refresh_token"
                );
        if (refreshToken != null) {
            REFRESH_TOKEN_SERVICE.revocarToken(
                    refreshToken
            );
        }
        ResponseCookie borrarAccess =
                crearCookieEliminada(
                        "access_token",
                        "/"
                );
        ResponseCookie borrarRefresh =
                crearCookieEliminada(
                        "refresh_token",
                        "/api/auth"
                );
        return ResponseEntity.ok()
                .header(
                        HttpHeaders.SET_COOKIE,
                        borrarAccess.toString()
                )
                .header(
                        HttpHeaders.SET_COOKIE,
                        borrarRefresh.toString()
                )
                .build();
    }

    //Cambiar contraseña API
    @PostMapping("/cambiarContrasena")
    public ResponseEntity<?> cambiarContrasena(@RequestBody CambiaContrasenaRequest request){
        return ResponseEntity.ok(SERVICE.cambiarContrasena(request));
    }

    @GetMapping("/session")
    public ResponseEntity<UserSessionResponse> session(
            Authentication authentication,
            HttpServletRequest request
    ) {

        CustomUserDetails user =
                (CustomUserDetails) authentication.getPrincipal();

        PersonalResponse personal =
                PERSONAL_SERVICE.obtenerPersonalPorId(
                        user.getUsuarioId()
                );

        if (personal.activo().equals("Inactivo")) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .build();
        }

        String token = null;

        if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if ("access_token".equals(cookie.getName())) {
                    token = cookie.getValue();
                    break;
                }
            }
        }

        if (token == null) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .build();
        }

        Instant expiration =
                JWT_SERVICE
                        .extractExpiration(token)
                        .toInstant();


        // Verificar si esta sesión utiliza "Recordarme"
        boolean recordarme = false;

        String refreshToken =
                obtenerCookie(
                        request,
                        "refresh_token"
                );

        if (refreshToken != null) {
            try {
                REFRESH_TOKEN_SERVICE
                        .validarRefreshToken(
                                refreshToken
                        );

                recordarme = true;

            } catch (Exception ignored) {
                recordarme = false;
            }
        }


        String rol = user.getAuthorities()
                .stream()
                .findFirst()
                .map(GrantedAuthority::getAuthority)
                .orElse(null);

        return ResponseEntity.ok(
                new UserSessionResponse(
                        user.getUsuarioId(),
                        personal.primerNombre()
                                + " "
                                + personal.primerApellido(),
                        user.getUsuario(),
                        rol,
                        personal.especialidad().getLabel(),
                        expiration,
                        recordarme
                )
        );
    }
    @PostMapping("/continuarSesion")
    public ResponseEntity<Void> continuarSesion(
            Authentication authentication
    ) {

        CustomUserDetails user =
                (CustomUserDetails) authentication.getPrincipal();

        String nuevoAccessToken =
                JWT_SERVICE.generateToken(user);

        ResponseCookie accessCookie =
                ResponseCookie.from(
                                "access_token",
                                nuevoAccessToken
                        )
                        .httpOnly(true)
                        .secure(cookieSecure)
                        .sameSite(cookieSameSite)
                        .path("/")
                        .build();

        return ResponseEntity.ok()
                .header(
                        HttpHeaders.SET_COOKIE,
                        accessCookie.toString()
                )
                .build();
    }

    @PostMapping("/activar")
    public ResponseEntity<?> activarCuenta(@RequestBody ActivateAccountRequest request){
        try{
            SERVICE.activarCuenta(request);
            return ResponseEntity.ok().build();
        }catch(TokenExpiradoException ex){
            return ResponseEntity
                    .status(HttpStatus.GONE)
                    .body("TOKEN_EXPIRADO");
        }
    }

    @PostMapping("/reenviar-verificacion")
    public ResponseEntity<Void> resendVerificationEmail(@RequestBody @Valid ResendVerificationRequest request){
        SERVICE.reenviarVerificacion(request);

        return ResponseEntity.ok().build();
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<Void> forgotPassword(@RequestBody ForgotPasswordRequest request){
        SERVICE.forgotPassword(request);

        return ResponseEntity.ok().build();
    }

    @PostMapping("/restablecer-contrasena")
    public ResponseEntity<Void> restablecerContrasena(@RequestBody ResetPasswordRequest request){
        SERVICE.resetContrasena(request);

        return ResponseEntity.ok().build();
    }

    @PostMapping("/refresh")
    public ResponseEntity<Void> renovarSesion(
            HttpServletRequest request
    ) {

        String refreshToken =
                obtenerCookie(
                        request,
                        "refresh_token"
                );

        if (
                refreshToken == null ||
                        refreshToken.isBlank()
        ) {

            ResponseCookie borrarAccess =
                    crearCookieEliminada(
                            "access_token",
                            "/"
                    );

            ResponseCookie borrarRefresh =
                    crearCookieEliminada(
                            "refresh_token",
                            "/api/auth"
                    );

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .header(
                            HttpHeaders.SET_COOKIE,
                            borrarAccess.toString()
                    )
                    .header(
                            HttpHeaders.SET_COOKIE,
                            borrarRefresh.toString()
                    )
                    .build();
        }

        try {

            JwtAuthResponse authResponse =
                    SERVICE.renovarSesion(
                            refreshToken
                    );

            ResponseCookie accessCookie =
                    ResponseCookie.from(
                                    "access_token",
                                    authResponse.getAccessToken()
                            )
                            .httpOnly(true)
                            .secure(cookieSecure)
                            .sameSite(cookieSameSite)
                            .path("/")
                            .build();

            ResponseCookie refreshCookie =
                    ResponseCookie.from(
                                    "refresh_token",
                                    authResponse.getRefreshToken()
                            )
                            .httpOnly(true)
                            .secure(cookieSecure)
                            .sameSite(cookieSameSite)
                            .path("/api/auth")
                            .maxAge(
                                    REFRESH_TOKEN_SERVICE
                                            .getExpirationMs()
                                            / 1000
                            )
                            .build();

            return ResponseEntity.ok()
                    .header(
                            HttpHeaders.SET_COOKIE,
                            accessCookie.toString()
                    )
                    .header(
                            HttpHeaders.SET_COOKIE,
                            refreshCookie.toString()
                    )
                    .build();

        } catch (ResponseStatusException ex) {

            if (
                    ex.getStatusCode()
                            .equals(
                                    HttpStatus.UNAUTHORIZED
                            )
            ) {

                ResponseCookie borrarAccess =
                        crearCookieEliminada(
                                "access_token",
                                "/"
                        );

                ResponseCookie borrarRefresh =
                        crearCookieEliminada(
                                "refresh_token",
                                "/api/auth"
                        );

                return ResponseEntity
                        .status(
                                HttpStatus.UNAUTHORIZED
                        )
                        .header(
                                HttpHeaders.SET_COOKIE,
                                borrarAccess.toString()
                        )
                        .header(
                                HttpHeaders.SET_COOKIE,
                                borrarRefresh.toString()
                        )
                        .build();
            }

            throw ex;
        }
    }

    //helper para leer cookies
    private String obtenerCookie(
            HttpServletRequest request,
            String nombre
    ) {
        if (request.getCookies() == null) {
            return null;
        }

        for (Cookie cookie : request.getCookies()) {
            if (nombre.equals(cookie.getName())) {
                return cookie.getValue();
            }
        }

        return null;
    }

    //helper para borrar cookies
    private ResponseCookie crearCookieEliminada(
            String nombre,
            String path
    ) {
        return ResponseCookie.from(
                        nombre,
                        ""
                )
                .httpOnly(true)
                .secure(cookieSecure)
                .sameSite(cookieSameSite)
                .path(path)
                .maxAge(0)
                .build();
    }
}
