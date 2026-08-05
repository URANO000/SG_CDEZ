package com.cdez.sg_cdez_api.util;

import com.cdez.sg_cdez_api.entity.*;
import com.cdez.sg_cdez_api.repository.AuthRepository;
import com.cdez.sg_cdez_api.repository.PersonalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthHelper {
    private final AuthRepository REPOSITORY;
    private final PersonalRepository PERSONAL_REPOSITORY;

    // Para password
    private static final String CHARS =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    private static final SecureRandom RANDOM = new SecureRandom();

    public Personal obtenerUsuarioAutenticado(){
        Object principal = SecurityContextHolder.getContext()
                .getAuthentication()
                .getPrincipal();

        if(!(principal instanceof CustomUserDetails userDetails)){
            throw new RuntimeException("Usuario autenticado no válido");
        }

        return REPOSITORY.findByPersonalId(userDetails.getUsuarioId())
                .orElseThrow(() -> new RuntimeException("Usuario autenticado no encontrado"));
    }

    public boolean isUsuarioAdmin(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        boolean esAdmin = authentication.getAuthorities().stream().anyMatch(r -> r.getAuthority().equals("ROLE_ADMIN"));
        return esAdmin;

    }

    public void validarUsuarioActivo(Personal usuario) {
        if (!usuario.isActivo()) {
            throw new RuntimeException(
                    "Usuario inactivo, no es posible realizar la acción deseada."
            );
        }
    }

    public void validarUsuarioActivo() {
        validarUsuarioActivo(obtenerUsuarioAutenticado());
    }

    public static String generarPassword(int longitud) {

        StringBuilder sb = new StringBuilder();

        for(int i = 0; i < longitud; i++) {
            sb.append(CHARS.charAt(
                    RANDOM.nextInt(CHARS.length())
            ));
        }

        return sb.toString();
    }

}
