package com.cdez.sg_cdez_api.dto.request;

import java.time.LocalDateTime;
import java.util.UUID;

public record HistorialAccionesCreateRequest(
        String accion,
        String campoAfectado,
        String valorAnterior,
        String valorNuevo,
        String descripcion
) {
}
