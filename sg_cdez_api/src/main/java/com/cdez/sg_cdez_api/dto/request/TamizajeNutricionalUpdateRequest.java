package com.cdez.sg_cdez_api.dto.request;

import com.cdez.sg_cdez_api.entity.enums.TipoTamizajeNutricion;

import java.math.BigDecimal;
import java.util.UUID;

public record TamizajeNutricionalUpdateRequest(
        UUID tamizajeId,
        TipoTamizajeNutricion tipo,
        BigDecimal puntaje,
        String resultado,
        String observaiones
) {
}
