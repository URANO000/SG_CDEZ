package com.cdez.sg_cdez_api.dto.response;

import java.time.LocalDateTime;
import java.util.UUID;

public record EpicrisisResponse(
        UUID epicrisisId,
        Integer documentoId,
        UUID adultoId,
        LocalDateTime fechaEmision,
        LocalDateTime fechaRecepcion,
        String centroSalud,
        String nombreArchivo,
        String tipoArchivo,
        Long tamanoArchivo,
        Boolean vigente,
        Boolean activo,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}