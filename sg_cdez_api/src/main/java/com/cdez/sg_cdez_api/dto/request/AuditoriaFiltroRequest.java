package com.cdez.sg_cdez_api.dto.request;

import java.time.LocalDateTime;
import java.util.UUID;

public record AuditoriaFiltroRequest(
        UUID usuarioId,
        String usuario,
        String accion,
        String modulo,
        LocalDateTime fechaDesde,
        LocalDateTime fechaHasta
) {
}