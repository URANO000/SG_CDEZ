package com.cdez.sg_cdez_api.dto.request;

import java.time.LocalDateTime;
import java.util.UUID;

public record ExamenLaboratorioUpdateRequest(
        UUID examenId,
        String nombre,
        String valor,
        String unidad,
        LocalDateTime fecha,
        String observaciones
) {
}
