package com.cdez.sg_cdez_api.api.model;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.Id;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "Personal")
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
    private String direccion;
    private String carnet;
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
    private List<AdultoMayor> adultosMayores;
    @OneToMany(mappedBy = "updatedBy")
    private List<AdultoMayor> adultosMayoresU;

    @OneToMany(mappedBy = "createdBy")
    private List<EncargadoLegal> encargadosLegales;
    @OneToMany(mappedBy = "updatedBy")
    private List<EncargadoLegal> encargadosLegalesU;

}
