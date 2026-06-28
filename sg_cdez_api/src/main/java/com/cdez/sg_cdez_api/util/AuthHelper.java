package com.cdez.sg_cdez_api.util;

import com.cdez.sg_cdez_api.entity.CustomUserDetails;
import com.cdez.sg_cdez_api.entity.Personal;
import com.cdez.sg_cdez_api.repository.AuthRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;

@Service
public class AuthHelper {
    AuthRepository authRepository;

    // Para password
    private static final String CHARS =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    private static final SecureRandom RANDOM = new SecureRandom();

    public AuthHelper(AuthRepository authRepository) {
        this.authRepository = authRepository;
    }

    public Personal obtenerUsuarioAutenticado(){
        Object principal = SecurityContextHolder.getContext()
                .getAuthentication()
                .getPrincipal();

        if(!(principal instanceof CustomUserDetails userDetails)){
            throw new RuntimeException("Usuario autenticado no válido");
        }

        return authRepository.findByPersonalId(userDetails.getUsuarioId())
                .orElseThrow(() -> new RuntimeException("Usuario autenticado no encontrado"));
    }

    public boolean isUsuarioAdmin(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        boolean esAdmin = authentication.getAuthorities().stream().anyMatch(r -> r.getAuthority().equals("ROLE_ADMIN"));
        return esAdmin;

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
