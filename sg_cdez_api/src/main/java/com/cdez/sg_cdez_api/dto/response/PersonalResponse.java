package com.cdez.sg_cdez_api.dto.response;

import org.springframework.cglib.core.Local;

import java.time.LocalDateTime;
import java.util.UUID;

public record PersonalResponse(
        UUID personalId,
        String rol,
        String especialidad,
        String tipoIdentificacion,
        String identificacion,
        String primerNombre,
        String segundoNombre,
        String primerApellido,
        String segundoApellido,
        String direccion,
        String carnet,
        String usuario,
        String activo,
        String createdBy,
        LocalDateTime createdAt,
        String updatedBy,
        LocalDateTime updatedAt
) {
}
