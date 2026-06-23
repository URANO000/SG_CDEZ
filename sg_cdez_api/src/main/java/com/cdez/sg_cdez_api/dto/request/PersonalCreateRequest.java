package com.cdez.sg_cdez_api.dto.request;

import java.time.LocalDateTime;
import java.util.UUID;

public record PersonalCreateRequest(
        int rol,
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
        boolean activo,
        LocalDateTime createdAt
) {
}
