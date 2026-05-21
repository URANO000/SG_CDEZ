package com.cdez.sg_cdez_api.service.impl;

import com.cdez.sg_cdez_api.dto.request.LoginRequest;
import com.cdez.sg_cdez_api.dto.response.JwtAuthResponse;
import com.cdez.sg_cdez_api.repository.AuthRepository;
import com.cdez.sg_cdez_api.service.AuthService;
import com.cdez.sg_cdez_api.service.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
    private final AuthRepository authRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;


    @Override
    public JwtAuthResponse iniciarSesion(LoginRequest loginRequest) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsuario(),
                        loginRequest.getContrasena()
                )
        );

        //Si pasa los filtros, entonces las credenciales son válidas
        var user = authRepository.findByUsuario(loginRequest.getUsuario())
                .orElseThrow();

        //Generar y retornar JWT
        var jwt = jwtService.generateToken(user);
        JwtAuthResponse response = new JwtAuthResponse();
        response.setAccessToken(jwt);

        return response;
    }
}
