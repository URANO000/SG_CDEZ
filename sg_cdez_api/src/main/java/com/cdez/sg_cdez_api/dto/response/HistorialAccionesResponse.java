package com.cdez.sg_cdez_api.dto.response;

import java.time.LocalDateTime;
import java.util.UUID;

public record HistorialAccionesResponse(
        int historialId,
        String accion,
        String campoAfectado,
        String valorAnterior,
        String valorNuevo,
        String descripcion,
        LocalDateTime performedAt,
        String performedByName,
        UUID performedById
) {
}
