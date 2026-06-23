package com.cdez.sg_cdez_api.util;

import com.cdez.sg_cdez_api.entity.CustomUserDetails;
import com.cdez.sg_cdez_api.entity.Personal;
import com.cdez.sg_cdez_api.repository.AuthRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;


public class AuthHelper {
    AuthRepository authRepository;

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
}
