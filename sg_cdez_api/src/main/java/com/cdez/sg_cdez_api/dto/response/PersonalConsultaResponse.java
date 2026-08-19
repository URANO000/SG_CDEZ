package com.cdez.sg_cdez_api.dto.response;

import java.util.UUID;

public record PersonalConsultaResponse(
        UUID personalId,
        String usuario,
        String nombreCompleto,
        String especialidad
) {
}
