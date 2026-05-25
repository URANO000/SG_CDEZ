package com.cdez.sg_cdez_api.service;


import com.cdez.sg_cdez_api.entity.*;
import com.cdez.sg_cdez_api.repository.AuthRepository;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class CustomUserDetailsService implements UserDetailsService {
    private final AuthRepository usuarioRepository;

    public CustomUserDetailsService(AuthRepository usuarioRepository){
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username)
            throws UsernameNotFoundException {

        Personal usuario = usuarioRepository.findByUsuario(username)
                .orElseThrow(() ->
                        new UsernameNotFoundException("Usuario no encontrado"));

        return new CustomUserDetails(usuario);
    }

    public UserDetails loadUserById(UUID usuarioId) {

        Personal usuario = usuarioRepository
                .findByPersonalId(usuarioId)
                .orElseThrow(() ->
                        new UsernameNotFoundException(
                                "Usuario no encontrado"
                        ));

        return new CustomUserDetails(usuario);
    }
}
