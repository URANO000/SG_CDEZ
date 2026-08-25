package com.cdez.sg_cdez_api.dto.request;

public record ContactoUpdateRequest(
        Integer contactoId,
        String valor,
        String tipoValor
) {
}
