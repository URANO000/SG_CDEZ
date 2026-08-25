package com.cdez.sg_cdez_api.controller;

import com.cdez.sg_cdez_api.dto.request.*;
import com.cdez.sg_cdez_api.dto.response.*;
import com.cdez.sg_cdez_api.entity.CustomUserDetails;
import com.cdez.sg_cdez_api.entity.Personal;
import com.cdez.sg_cdez_api.service.*;
import com.cdez.sg_cdez_api.util.Exceptions.TokenExpiradoException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.core.*;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.Date;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService SERVICE;
    private final PersonalService PERSONAL_SERVICE;
    private final JwtService JWT_SERVICE;

    //Login Api
    @PostMapping("/iniciarSesion")
    public ResponseEntity<Void> iniciarSesion(@RequestBody LoginRequest loginRequest, HttpServletRequest request){

        JwtAuthResponse authResponse =
                SERVICE.iniciarSesion(loginRequest, request.getRemoteAddr());

        ResponseCookie cookie = ResponseCookie.from(
                "access_token",
                authResponse.getAccessToken()
        )
                .httpOnly(true)
                .secure(false) //Cambiamos a true en prod
                .sameSite("Strict")
                .path("/")
                .maxAge(15 * 60)
                .build();

        return ResponseEntity.ok()
                .header(
                        HttpHeaders.SET_COOKIE,
                        cookie.toString()
                )
                .build();
    }

    @PostMapping("/cerrarSesion")
    public ResponseEntity<Void> cerrarSesion(){
        ResponseCookie deleteCookie = ResponseCookie.from(
                        "access_token",
                        ""
                )
                .httpOnly(true)
                .secure(false)
                .sameSite("Strict")
                .path("/")
                .maxAge(0)
                .build();

        return ResponseEntity.ok()
                .header(
                        HttpHeaders.SET_COOKIE,
                        deleteCookie.toString()
                )
                .build();
    }

    //Cambiar contraseña API
    @PostMapping("/cambiarContrasena")
    public ResponseEntity<?> cambiarContrasena(@RequestBody CambiaContrasenaRequest request){
        return ResponseEntity.ok(SERVICE.cambiarContrasena(request));
    }

    @GetMapping("/session")
    public ResponseEntity<UserSessionResponse> session(Authentication authentication, HttpServletRequest request){

        CustomUserDetails user = (CustomUserDetails) authentication.getPrincipal();

        PersonalResponse personal = PERSONAL_SERVICE.obtenerPersonalPorId(user.getUsuarioId());
        if (personal.activo().equals("Inactivo")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
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
                JWT_SERVICE.extractExpiration(token).toInstant();

        String rol = user.getAuthorities()
                .stream()
                .findFirst()
                .map(GrantedAuthority::getAuthority)
                .orElse(null);

        return ResponseEntity.ok(
                new UserSessionResponse(
                        user.getUsuarioId(),
                        personal.primerNombre() + " " + personal.primerApellido(),
                        user.getUsuario(),
                        rol,
                        personal.especialidad().getLabel(),
                        expiration

                )
        );
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
}
