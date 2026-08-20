package com.cdez.sg_cdez_api.dto.response;

import java.time.LocalDateTime;
import java.util.UUID;

public record ExamenLaboratorioResponse(
        UUID examenId,
        String nombre,
        String valor,
        String unidad,
        LocalDateTime fecha,
        String observaciones
) {
}
