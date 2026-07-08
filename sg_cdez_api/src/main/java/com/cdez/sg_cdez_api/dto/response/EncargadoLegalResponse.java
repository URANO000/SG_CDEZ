package com.cdez.sg_cdez_api.dto.response;

import java.util.UUID;

public record EncargadoLegalResponse(
        UUID encargadoId,
        String tipoIdentificacion,
        String identificacion,
        String primerNombre,
        String segundoNombre,
        String primerApellido,
        String segundoApellido,
        String direccion,
        boolean activo
) {
}