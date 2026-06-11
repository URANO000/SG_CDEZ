package com.cdez.sg_cdez_api.controller;

import com.cdez.sg_cdez_api.dto.request.CambiaContrasenaRequest;
import com.cdez.sg_cdez_api.dto.request.LoginRequest;
import com.cdez.sg_cdez_api.dto.response.JwtAuthResponse;
import com.cdez.sg_cdez_api.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    @Autowired
    private final AuthService SERVICE;

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

    //Cambiar contraseña API
    @PostMapping("/cambiarContrasena/{usuarioId}")
    public ResponseEntity<?> cambiarContrasena(@RequestBody CambiaContrasenaRequest request, @PathVariable(name = "usuarioId") UUID usuarioId){
        return ResponseEntity.ok(SERVICE.cambiarContrasena(request, usuarioId));
    }

    //APIs de prueba para control de roles
    @GetMapping("/adminAPI")
    public String adminAPI(){
        return "Hellom I am an ADMIN user";
    }

    @GetMapping("/personalAPI")
    public String personalAPI(){
        return "Hello, I am a PERSONAL user, admin can also access this too :0";
    }
}
