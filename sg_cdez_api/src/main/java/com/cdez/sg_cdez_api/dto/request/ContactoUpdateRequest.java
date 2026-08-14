package com.cdez.sg_cdez_api.dto.request;

public record ContactoUpdateRequest(
        Integer id,
        String valor,
        String tipoValor
) {
}
