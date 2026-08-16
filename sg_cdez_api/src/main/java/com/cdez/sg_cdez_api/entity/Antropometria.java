package com.cdez.sg_cdez_api.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "antropometria")
public class Antropometria {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "antropometria_id")
    private UUID antropometriaId;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "consulta_nutricional_id",
            nullable = false,
            unique = true
    )
    private ConsultaNutricional consultaNutricional;

    @Column(name = "peso_actual", precision = 6, scale = 2)
    private BigDecimal pesoActual;

    @Column(name = "peso_habitual", precision = 6, scale = 2)
    private BigDecimal pesoHabitual;

    @Column(name = "peso_hace_6_meses", precision = 6, scale = 2)
    private BigDecimal pesoHace6Meses;

    @Column(name = "talla", precision = 5, scale = 2)
    private BigDecimal talla;

    @Column(name = "altura_estimada", precision = 5, scale = 2)
    private BigDecimal alturaEstimada;

    @Column(name = "imc", precision = 5, scale = 2)
    private BigDecimal imc;

    @Column(name = "circumferencia_pantorrilla", precision = 6, scale = 2)
    private BigDecimal circunferenciaPantorrilla;

    @Column(name = "circunferencia_braquial", precision = 6, scale = 2)
    private BigDecimal circunferenciaBraquial;

    @Column(name = "circunferencia_cintura", precision = 6, scale = 2)
    private BigDecimal circunferenciaCintura;

    @Column(name = "perdida_peso_porcentaje", precision = 5, scale = 2)
    private BigDecimal perdidaPesoPorcentaje;
}