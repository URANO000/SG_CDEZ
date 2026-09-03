package com.cdez.sg_cdez_api.dto.request;

import java.time.LocalDateTime;
import java.util.UUID;
import java.util.List;

public record AuditoriaFiltroRequest(
        UUID usuarioId,
        String usuario,
        String accion,
        List<String> modulos,
        LocalDateTime fechaDesde,
        LocalDateTime fechaHasta
) {
}