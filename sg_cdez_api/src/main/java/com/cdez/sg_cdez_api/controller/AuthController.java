package com.cdez.sg_cdez_api.controller;

import com.cdez.sg_cdez_api.dto.request.LoginRequest;
import com.cdez.sg_cdez_api.dto.response.JwtAuthResponse;
import com.cdez.sg_cdez_api.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    @Autowired
    private final AuthService SERVICE;

    //Login Api
    @PostMapping("/iniciarSesion")
    public ResponseEntity<JwtAuthResponse> iniciarSesion(@RequestBody LoginRequest loginRequest){
        return ResponseEntity.ok(SERVICE.iniciarSesion(loginRequest));
    }
}
