package com.cdez.sg_cdez_api.dto.request;

import java.util.UUID;

public record ConsultaFiltro(
        UUID adultoId,
        boolean personalView,
        String especialidad,
        String nombreCreadoPor
) {
}
