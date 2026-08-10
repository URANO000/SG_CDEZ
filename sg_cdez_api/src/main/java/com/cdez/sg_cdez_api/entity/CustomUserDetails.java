package com.cdez.sg_cdez_api.entity;

import lombok.Getter;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
public class CustomUserDetails implements UserDetails {
    private final UUID usuarioId; //Lo mismo que personalId
    private final String usuario;
    private final String contrasena;
    private final Collection<? extends GrantedAuthority> authorities;
    private final boolean isEmailVerificado;
    private final boolean isCuentaBloqueada;
    private final boolean isCredencialesExpiradas;
    private final boolean isActivo;

    public CustomUserDetails(Personal usuario){
        this.usuarioId = usuario.getPersonalId();
        this.usuario = usuario.getUsuario();
        this.contrasena = usuario.getContrasena();
        this.isEmailVerificado = usuario.isEmailVerificado();
        this.isCuentaBloqueada = usuario.isCuentaBloqueada();
        this.isCredencialesExpiradas = usuario.isCredencialesExpiradas();
        this.isActivo = usuario.isActivo();

        this.authorities = List.of(
                new SimpleGrantedAuthority("ROLE_" + usuario.getRol().getNombre())
        );
    }

    @Override
    public String getUsername() {
        return usuario;
    }

    @Override
    public String getPassword() {
        return contrasena;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public boolean isEnabled() {
        return isEmailVerificado();
    }

    @Override
    public boolean isAccountNonLocked() {
        return !isCuentaBloqueada();
    }

    @Override
    public boolean isAccountNonExpired() {
        return isActivo();
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return !isCredencialesExpiradas();
    }

}
