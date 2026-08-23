package com.cdez.sg_cdez_api.dto.response;

import java.time.LocalDateTime;
import java.util.UUID;

public record ConsultaPageResponse(
        UUID consultaId,
        AdultoMayorConsultaResponse adultoMayor,
        String tipoConsulta,
        String activo,
        PersonalConsultaResponse createdBy,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        ConsultaNutricionalPageResponse consultaNutricional
) {
}
