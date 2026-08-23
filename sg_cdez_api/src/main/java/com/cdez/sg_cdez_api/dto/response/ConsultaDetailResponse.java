package com.cdez.sg_cdez_api.dto.response;

import java.time.LocalDateTime;
import java.util.UUID;

public record ConsultaDetailResponse(
        UUID consultaId,
        AdultoMayorConsultaResponse adultoMayor,
        String motivo,
        String tipoConsulta,
        String descripcion,
        String diagnostico,
        String resultadosEvaluaciones,
        String recomendaciones,
        String notas,
        String activo,
        PersonalConsultaResponse createdBy,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        ConsultaNutricionalDetailResponse consultaNutricional
) {
}
