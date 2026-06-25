package com.cdez.sg_cdez_api.dto.request;

import java.time.LocalDateTime;

public record PersonalActualizarRequest(
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
        LocalDateTime updatedAt
) {
}
