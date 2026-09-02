package com.cdez.sg_cdez_api.dto.request;

import com.cdez.sg_cdez_api.entity.enums.TipoTamizaje;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record TamizajeCreateRequest(
        @NotNull(message = "El tipo de tamizaje es obligatorio")
        TipoTamizaje tipo,
        BigDecimal puntaje,
        String resultado,
        String observaciones
) {
}
