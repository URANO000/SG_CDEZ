package com.cdez.sg_cdez_api.dto.request;

import java.time.LocalDateTime;
import java.util.UUID;

public record ContactoCreateRequest(
    String valor,
    String tipoValor,
    UUID createdBy,
    LocalDateTime createdAt
) {
}
