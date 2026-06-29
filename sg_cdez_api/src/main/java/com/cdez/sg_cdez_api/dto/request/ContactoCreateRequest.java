package com.cdez.sg_cdez_api.dto.request;

import java.util.UUID;

public record ContactoCreateRequest(
    UUID personalId,
    UUID encargadoId,
    String valor,
    String tipoValor
) {
}
