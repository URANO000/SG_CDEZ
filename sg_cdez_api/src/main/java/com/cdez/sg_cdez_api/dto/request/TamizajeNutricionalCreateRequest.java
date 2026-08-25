package com.cdez.sg_cdez_api.dto.request;

import com.cdez.sg_cdez_api.entity.enums.TipoTamizaje;

import java.math.BigDecimal;

public record TamizajeNutricionalCreateRequest(
        TipoTamizaje tipo,
        BigDecimal puntaje,
        String resultado,
        String observaciones
) {
}
