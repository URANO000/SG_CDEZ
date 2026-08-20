package com.cdez.sg_cdez_api.dto.request;

import java.math.BigDecimal;
import java.util.UUID;

public record AntropometriaUpdateRequest(
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
