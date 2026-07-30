package com.cdez.sg_cdez_api.dto.response;

import java.time.LocalDateTime;
import java.util.UUID;

public record ConsultaResponse(
        int consultaId,
        String adultoMayorNombre,
        String motivo,
        String tipoIntervencion,
        String descripcion,
        String diagnostico,
        String recomendaciones,
        String notas,
        UUID referenciaPersonal,
        String createdByName,
        UUID createdById,
        LocalDateTime createdAt
) {
}
