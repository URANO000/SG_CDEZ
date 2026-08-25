package com.cdez.sg_cdez_api.dto.request;

import java.util.List;

public record EncargadoLegalRequest(
        String tipoIdentificacion,
        String identificacion,
        String primerNombre,
        String segundoNombre,
        String primerApellido,
        String segundoApellido,
        String direccion,

        List<ContactoCreateRequest> contactos
) {
}