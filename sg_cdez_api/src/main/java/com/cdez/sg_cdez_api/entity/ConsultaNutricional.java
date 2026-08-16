package com.cdez.sg_cdez_api.entity;

import com.cdez.sg_cdez_api.entity.enums.Apetito;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;
import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "consultanutricional")
public class ConsultaNutricional {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "consulta_nutricional_id")
    private UUID consultaNutricionalId;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "consulta_id",
            nullable = false,
            unique = true
    )
    private Consulta consulta;

    @Column(name = "historia_alimentaria", columnDefinition = "TEXT")
    private String historiaAlimentaria;

    @Enumerated(EnumType.STRING)
    @Column(name = "apetito", length = 30)
    private Apetito apetito;

    @Column(name = "masticacion", length = 50)
    private String masticacion;

    @Column(name = "deglucion", length = 50)
    private String deglucion;

    private Boolean nauseas;
    private Boolean vomitos;
    private Boolean distension;
    private Boolean gases;
    private Boolean reflujo;

    @Column(name = "frecuencia_evacuaciones", length = 100)
    private String frecuenciaEvacuaciones;

    @Column(name = "consistencia_bristol", length = 50)
    private String consistenciaBristol;

    @Column(name = "estado_cognitivo", columnDefinition = "TEXT")
    private String estadoCognitivo;

    @OneToMany(mappedBy = "consultaNutricional")
    private List<TamizajeNutricional> tamizajes;

    @OneToMany(mappedBy = "consultaNutricional")
    private List<ExamenLaboratorio> examenesLaboratorio;
}