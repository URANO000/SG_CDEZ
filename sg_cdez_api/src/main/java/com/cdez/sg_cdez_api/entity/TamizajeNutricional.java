package com.cdez.sg_cdez_api.entity;

import com.cdez.sg_cdez_api.entity.enums.TipoTamizaje;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "tamizajenutricional")
public class TamizajeNutricional {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "tamizaje_id")
    private UUID tamizajeId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "consulta_nutricional_id",
            nullable = false
    )
    private ConsultaNutricional consultaNutricional;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo", nullable = false, length = 30)
    private TipoTamizaje tipo;

    @Column(name = "puntaje", precision = 6, scale = 2)
    private BigDecimal puntaje;

    @Column(name = "resultado", length = 100)
    private String resultado;

    @Column(name = "observaciones", columnDefinition = "TEXT")
    private String observaciones;
}