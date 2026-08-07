package com.cdez.sg_cdez_api.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "personal")
public class Personal {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID personalId;
    @ManyToOne
    @JoinColumn(name = "rol_id")
    private Rol rol;
    private String especialidad;
    private String tipoIdentificacion;
    private String identificacion;
    private String primerNombre;
    private String segundoNombre;
    private String primerApellido;
    private String segundoApellido;
    private String direccion;
    private String carnet;
    @Column(unique = true)
    private String usuario;
    private String contrasena;
    private boolean activo;
    private boolean emailVerificado = false;
    private boolean cuentaBloqueada = false;
    private boolean credencialesExpiradas = false;
    @ManyToOne
    @JoinColumn(name = "created_by", nullable = true)
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

    @OneToMany(mappedBy = "personal")
    private List<EmailVerificationToken> verificationTokens = new ArrayList<>();

    @OneToMany(mappedBy = "personal")
    private List<PasswordResetToken> resetTokens = new ArrayList<>();

    // Util para conseguir nombre completo
    public String getNombreCompleto(){
        return Stream.of(getPrimerNombre(), getSegundoNombre(), getPrimerApellido(), getSegundoApellido())
                .filter(s -> s != null && !s.trim().isEmpty())
                .collect(Collectors.joining(" "));
    }
}
