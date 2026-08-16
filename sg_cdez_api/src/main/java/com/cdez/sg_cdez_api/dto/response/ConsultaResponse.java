package com.cdez.sg_cdez_api.dto.response;

import java.time.LocalDateTime;
import java.util.UUID;

public record ConsultaResponse(
        UUID consultaId,
        AdultoMayorConsultaResponse adultoMayor,
        String motivo,
        String tipoConsulta,
        String descripcion,
        String diagnostico,
        String recomendaciones,
        String notas,
        String activo,
        String createdByName,
        UUID createdById,
        LocalDateTime createdAt
) {
}
