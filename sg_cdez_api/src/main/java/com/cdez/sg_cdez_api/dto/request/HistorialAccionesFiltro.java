package com.cdez.sg_cdez_api.dto.request;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record HistorialAccionesFiltro(
        String accion,
        String performedByNombre,
        LocalDate performedAt
) {
}
