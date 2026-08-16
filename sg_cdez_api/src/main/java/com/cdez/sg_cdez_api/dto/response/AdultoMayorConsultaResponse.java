package com.cdez.sg_cdez_api.dto.response;

import java.time.LocalDateTime;
import java.util.UUID;

public record AdultoMayorConsultaResponse(
        UUID adultoId,
        String tipoIdentificacion,
        String identificacion,
        String nombreCompleto,
        LocalDateTime fechaNacimiento,
        String sexo
) {
}
