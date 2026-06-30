package com.cdez.sg_cdez_api.dto.response;

public record ContactoResponse(
    int contactoId,
    String personalNombre,
    String encargadoNombre,
    String valor,
    String tipoValor
) {
}
