package com.cdez.sg_cdez_api.dto.response;

import java.time.LocalDateTime;

public record ContactoResponse(
    int contactoId,
    String personalNombre,
    String encargadoNombre,
    String valor,
    String tipoValor,
    String activo,
    String createdBy,
    LocalDateTime createdAt,
    String updatedBy,
    LocalDateTime updatedAt

) {
}
