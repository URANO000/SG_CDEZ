package com.cdez.sg_cdez_api.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name="encargadoLegal")
public class EncargadoLegal {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID encargadoId;
    private String tipoIdentificacion;
    private String identificacion;
    private  String primerNombre;
    private String segundoNombre;
    private String primerApellido;
    private String segundoApellido;
    private String direccion;
    private boolean activo;
    @ManyToOne
    @JoinColumn(name="created_by", nullable = false )
    private Personal createdBy;
    private LocalDateTime createdAt;
    @ManyToOne
    @JoinColumn(name="updated_by", nullable = true)
    private Personal updatedBy;
    private LocalDateTime updatedAt;

    //Relaciones
    @OneToMany(mappedBy = "encargado")
    private List<Contacto> contactos = new ArrayList<>();

    @ManyToMany(mappedBy = "encargados")
    private List<AdultoMayor> adultos = new ArrayList<>();

    // Util para conseguir nombre completo
    public String getNombreCompleto(){
        return Arrays.asList(getPrimerNombre(), getSegundoNombre(), getPrimerApellido(), getSegundoApellido())
                .stream()
                .filter(s -> s != null && !s.trim().isEmpty())
                .collect(Collectors.joining(" "));
    }

}
