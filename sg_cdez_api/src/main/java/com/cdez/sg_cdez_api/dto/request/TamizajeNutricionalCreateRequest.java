package com.cdez.sg_cdez_api.dto.request;

import com.cdez.sg_cdez_api.entity.enums.TipoTamizajeNutricion;

import java.math.BigDecimal;

public record TamizajeNutricionalCreateRequest(
        TipoTamizajeNutricion tipo,
        BigDecimal puntaje,
        String resultado,
        String observaciones
) {
}
