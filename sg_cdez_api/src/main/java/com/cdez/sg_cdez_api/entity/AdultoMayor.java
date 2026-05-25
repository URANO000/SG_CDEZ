package com.cdez.sg_cdez_api.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "adultoMayor")
public class AdultoMayor {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID adultoId;
    private String tipoIdentificacion;
    private String identificacion;
    private String primerNombre;
    private String segundoNombre;
    private String primerApellido;
    private String segundoApellido;
    private String nacionalidad;
    private LocalDateTime fechaNacimiento;
    private String sexo;
    private String direccion;
    private String escolaridad;
    private String grupoFamiliar;
    private boolean pension;
    private String funcionalidadFisica;
    private boolean ayudaBiomecanica;
    private LocalDateTime fechaIngreso;
    private LocalDateTime fechaRetiro;
    private LocalDateTime fechaFallecimiento;
    private String motivoRetiro;
    private boolean activo;
    @ManyToOne
    @JoinColumn(name="created_by", nullable = false )
    private Personal createdBy;
    private LocalDateTime createdAt;
    @ManyToOne
    @JoinColumn(name="updated_by", nullable = true)
    private Personal updatedBy;
    private LocalDateTime updatedAt;

    //Referencias
    @OneToMany(mappedBy = "adultoMayor")
    private List<Consulta> consultas = new ArrayList<>();

    @ManyToMany
    @JoinTable(
            name = "EncargadoAdulto",
            joinColumns = @JoinColumn(name = "adulto_id"),
            inverseJoinColumns = @JoinColumn(name = "encargado_id")
    )
    private List<EncargadoLegal> encargados = new ArrayList<>();
}
