package com.cdez.sg_cdez_api.dto.request;

import java.math.BigDecimal;

public record AntropometriaCreateRequest(
        BigDecimal pesoActual,
        BigDecimal pesoHabitual,
        BigDecimal pesoHace6Meses,
        BigDecimal talla,
        BigDecimal alturaEstimada,
        BigDecimal imc,
        BigDecimal circunferenciaPantorrilla,
        BigDecimal circunferenciaBranquial,
        BigDecimal circunferenciaCintura,
        BigDecimal perdidaPesoPorcentaje
) {
}
