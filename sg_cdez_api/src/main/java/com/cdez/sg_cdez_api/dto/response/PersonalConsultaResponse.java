package com.cdez.sg_cdez_api.dto.response;

import com.cdez.sg_cdez_api.entity.enums.Especialidad;

import java.util.UUID;

public record PersonalConsultaResponse(
        UUID personalId,
        String usuario,
        String nombreCompleto,
        String especialidad
) {
}
