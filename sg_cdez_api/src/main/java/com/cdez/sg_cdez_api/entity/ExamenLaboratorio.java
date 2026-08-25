package com.cdez.sg_cdez_api.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "examenlaboratorio")
public class ExamenLaboratorio {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "examen_id")
    private UUID examenId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "consulta_nutricional_id",
            nullable = false
    )
    private ConsultaNutricional consultaNutricional;

    @Column(name = "nombre", nullable = false, length = 150)
    private String nombre;

    @Column(name = "valor", length = 100)
    private String valor;

    @Column(name = "unidad", length = 50)
    private String unidad;

    @Column(name = "fecha")
    private LocalDateTime fecha;

    @Column(name = "observaciones", columnDefinition = "TEXT")
    private String observaciones;
}