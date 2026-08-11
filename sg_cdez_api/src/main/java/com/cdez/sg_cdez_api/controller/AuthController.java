package com.cdez.sg_cdez_api.controller;

import com.cdez.sg_cdez_api.dto.request.*;
import com.cdez.sg_cdez_api.dto.response.*;
import com.cdez.sg_cdez_api.entity.CustomUserDetails;
import com.cdez.sg_cdez_api.service.*;
import com.cdez.sg_cdez_api.util.Exceptions.TokenExpiradoException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.security.core.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    @Autowired
    private final AuthService SERVICE;
    private final PersonalService PERSONAL_SERVICE;

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
    public ResponseEntity<UserSessionResponse> session(Authentication authentication){

        CustomUserDetails user = (CustomUserDetails) authentication.getPrincipal();

        String rol = user.getAuthorities()
                .stream()
                .findFirst()
                .map(GrantedAuthority::getAuthority)
                .orElse(null);

        String nombre = PERSONAL_SERVICE.obtenerNombrePorId(user.getUsuarioId());

        return ResponseEntity.ok(
                new UserSessionResponse(
                        user.getUsuarioId(),
                        nombre,
                        user.getUsuario(),
                        rol
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
