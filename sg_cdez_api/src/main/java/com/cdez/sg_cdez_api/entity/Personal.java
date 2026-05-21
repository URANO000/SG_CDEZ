package com.cdez.sg_cdez_api.entity;

import jakarta.persistence.*;
import lombok.*;
import org.jspecify.annotations.Nullable;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "personal")
public class Personal implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID personalId;
    @ManyToOne
    @JoinColumn(name = "rol_id")
    private Rol rol;
    private String especialidad;
    private String tipoIdentificacion;
    private String identificacion;
    private String direccion;
    private String carnet;
    @Column(unique = true)
    private String usuario;
    private String contrasena;
    private boolean activo;
    @ManyToOne
    @JoinColumn(name = "created_by", nullable = false)
    private Personal createdBy;
    private LocalDateTime createdAt;
    @ManyToOne
    @JoinColumn(name = "updated_by", nullable = true)
    private Personal updatedBy;
    private LocalDateTime updatedAt;


    //Relaciones
    @OneToMany(mappedBy = "createdBy")
    private List<AdultoMayor> adultosMayores = new ArrayList<>();
    @OneToMany(mappedBy = "updatedBy")
    private List<AdultoMayor> adultosMayoresU = new ArrayList<>();

    @OneToMany(mappedBy = "createdBy")
    private List<EncargadoLegal> encargadosLegales = new ArrayList<>();
    @OneToMany(mappedBy = "updatedBy")
    private List<EncargadoLegal> encargadosLegalesU = new ArrayList<>();

    @OneToMany(mappedBy = "referencia")
    private List<Consulta> referenciaConsultas = new ArrayList<>();
    @OneToMany(mappedBy = "createdBy")
    private List<Consulta> consultas = new ArrayList<>();

    @OneToMany(mappedBy = "personal")
    private List<Documento> documentos = new ArrayList<>();

    //Para la autenticación y autorización

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        List<GrantedAuthority> authorities = new ArrayList<>();

        //Convertir entidad de Rol en SimpleGrantedAuthority para añadir a la lista
        //El ROLE_ simplemente es el prefix estándar
        authorities.add(new SimpleGrantedAuthority("ROLE_" + rol.getNombre()));
        return authorities;
    }

    @Override
    public @Nullable String getPassword() {
        return contrasena;
    }

    @Override
    public String getUsername() {
        return usuario;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return activo;
    }
}
