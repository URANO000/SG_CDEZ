package com.cdez.sg_cdez_api.dto.response;

import java.util.List;
import java.util.UUID;

public record PerfilResponse(
        UUID personalId,
        String nombreCompleto,
        String rol,
        String especialidad,
        String tipoIdentificacion,
        String identificacion,
        String direccion,
        String carnet,
        String correo,
        String estado,
        List<ContactoResponse> contactos
) {
}