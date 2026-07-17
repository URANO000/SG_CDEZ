package com.cdez.sg_cdez_api.dto.request;

import java.time.LocalDateTime;

public record EpicrisisUpdateRequest(
        LocalDateTime fechaEmision,
        LocalDateTime fechaRecepcion,
        String centroSalud
) {
}