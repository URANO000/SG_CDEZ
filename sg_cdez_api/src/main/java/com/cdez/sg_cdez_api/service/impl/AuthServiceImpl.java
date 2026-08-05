package com.cdez.sg_cdez_api.service.impl;

import com.cdez.sg_cdez_api.dto.request.CambiaContrasenaRequest;
import com.cdez.sg_cdez_api.dto.request.LoginRequest;
import com.cdez.sg_cdez_api.dto.response.JwtAuthResponse;
import com.cdez.sg_cdez_api.entity.CustomUserDetails;
import com.cdez.sg_cdez_api.entity.Personal;
import com.cdez.sg_cdez_api.repository.AuthRepository;
import com.cdez.sg_cdez_api.service.AuthService;
import com.cdez.sg_cdez_api.service.JwtService;
import com.cdez.sg_cdez_api.util.AuthHelper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final AuthRepository REPOSITORY;
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

        // Validar si el usuario es activo. Si no, entonces no puede iniciar sesión
        Personal usuario = REPOSITORY.findByPersonalId(userDetails.getUsuarioId())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        AUTH_HELPER.validarUsuarioActivo(usuario);

        //Generar y retornar JWT
        String jwt = jwtService.generateToken(userDetails);
        JwtAuthResponse response = new JwtAuthResponse();
        response.setAccessToken(jwt);

        return response;
    }

    @Override
    public String cambiarContrasena(CambiaContrasenaRequest request, UUID usuarioId){
        //Verificar que los passwords no son los mismos
        Personal usuario = REPOSITORY.findByPersonalId(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        //Validar que las contrasenas coinciden
        if(!request.getNuevaContransena().equals(request.getConfirmarContrasena())){
            throw new RuntimeException("Las contraseñas no coinciden");
        }

        //No reutilizar la misma contrasena
        if(passwordEncoder.matches(request.getNuevaContransena(), usuario.getContrasena())){
            throw new RuntimeException("La nueva contraseña no puede ser igual a la actual");
        }

        //Encriptar nueva contraseña
        String nuevaContrasenaEncriptada = passwordEncoder.encode(request.getNuevaContransena());

        usuario.setContrasena(nuevaContrasenaEncriptada);
        REPOSITORY.save(usuario);
        return "La contraseña ha sido actualizada";
    }
}
