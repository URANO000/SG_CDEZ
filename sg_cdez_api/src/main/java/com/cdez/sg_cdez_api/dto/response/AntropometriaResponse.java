package com.cdez.sg_cdez_api.dto.response;

import java.math.BigDecimal;
import java.util.UUID;

public record AntropometriaResponse(
        UUID antropometriaId,
        BigDecimal pesoActual,
        BigDecimal pesoHabitual,
        BigDecimal pesoHace6Meses,
        BigDecimal talla,
        BigDecimal alturaEstimada,
        BigDecimal imc,
        BigDecimal circunferenciaPantorrilla,
        BigDecimal circunferenciaBraquial,
        BigDecimal circunferenciaCintura,
        BigDecimal perdidaPesoPorcentaje
) {
}
