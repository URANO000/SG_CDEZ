package com.cdez.sg_cdez_api.dto.response;

import com.cdez.sg_cdez_api.entity.enums.TipoTamizaje;

import java.math.BigDecimal;
import java.util.UUID;

public record TamizajeResponse(
        UUID tamizajeId,
        TipoTamizaje tipo,
        BigDecimal puntaje,
        String resultado,
        String observaiones
) {
}
