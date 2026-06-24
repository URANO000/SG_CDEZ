package com.cdez.sg_cdez_api.dto.request;

import java.time.LocalDateTime;

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
        String usuario
) {
}
