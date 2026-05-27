package com.cdez.sg_cdez_api.dto.request;

import java.time.LocalDateTime;

public record AdultoMayorFallecimientoRequest(
        LocalDateTime fechaFallecimiento,
        String motivoRetiro
) {
}