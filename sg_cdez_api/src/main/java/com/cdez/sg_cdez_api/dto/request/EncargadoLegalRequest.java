package com.cdez.sg_cdez_api.dto.request;

public record EncargadoLegalRequest(
        String tipoIdentificacion,
        String identificacion,
        String primerNombre,
        String segundoNombre,
        String primerApellido,
        String segundoApellido,
        String direccion
) {
}