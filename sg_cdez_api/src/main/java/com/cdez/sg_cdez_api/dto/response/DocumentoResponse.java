package com.cdez.sg_cdez_api.dto.response;

import java.time.LocalDateTime;
import java.util.UUID;

public record DocumentoResponse(
        Integer documentoId,
        UUID adultoId,
        String nombreArchivo,
        String tipoArchivo,
        Long tamanoArchivo,
        String activo,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}