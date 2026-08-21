package com.cdez.sg_cdez_api.dto.request;

import java.time.LocalDateTime;

public record ExamenLaboratorioCreateRequest(
        String nombre,
        String valor,
        String unidad,
        LocalDateTime fecha,
        String observaciones
) {
}
