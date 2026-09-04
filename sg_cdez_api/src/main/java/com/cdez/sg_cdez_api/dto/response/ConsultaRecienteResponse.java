package com.cdez.sg_cdez_api.dto.response;

import java.time.LocalDateTime;
import java.util.UUID;

public record ConsultaRecienteResponse(
        UUID consultaId,
        UUID adultoId,
        String nombreAdulto,
        String tipoConsulta,
        String motivo,
        LocalDateTime fecha
) {
}
