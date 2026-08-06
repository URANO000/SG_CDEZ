package com.cdez.sg_cdez_api.controller;

import com.cdez.sg_cdez_api.dto.request.ActivateAccountRequest;
import com.cdez.sg_cdez_api.dto.request.CambiaContrasenaRequest;
import com.cdez.sg_cdez_api.dto.request.LoginRequest;
import com.cdez.sg_cdez_api.dto.request.ResendVerificationRequest;
import com.cdez.sg_cdez_api.dto.response.JwtAuthResponse;
import com.cdez.sg_cdez_api.dto.response.UserSessionResponse;
import com.cdez.sg_cdez_api.entity.CustomUserDetails;
import com.cdez.sg_cdez_api.service.AuthService;
import com.cdez.sg_cdez_api.service.PersonalService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    @Autowired
    private final AuthService SERVICE;
    private final PersonalService PERSONAL_SERVICE;

    //Login Api
    @PostMapping("/iniciarSesion")
    public ResponseEntity<Void> iniciarSesion(@RequestBody LoginRequest request){

        JwtAuthResponse authResponse =
                SERVICE.iniciarSesion(request);

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
    @PostMapping("/cambiarContrasena/{usuarioId}")
    public ResponseEntity<?> cambiarContrasena(@RequestBody CambiaContrasenaRequest request, @PathVariable(name = "usuarioId") UUID usuarioId){
        return ResponseEntity.ok(SERVICE.cambiarContrasena(request, usuarioId));
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
    public ResponseEntity<Void> activarCuenta(@RequestBody ActivateAccountRequest request){
        SERVICE.activarCuenta(request);

        return ResponseEntity.ok().build();
    }

    @PostMapping("/resend-verification")
    public ResponseEntity<Void> resendVerificationEmail(@RequestBody @Valid ResendVerificationRequest request){
        SERVICE.reenviarVerificacion(request);

        return ResponseEntity.ok().build();
    }
}
