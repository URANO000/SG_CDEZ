package com.cdez.sg_cdez_api.dto.request;

import java.util.List;

public record PerfilActualizarRequest(
        String direccion,
        List<ContactoUpdateRequest> contactosActualizar,
        List<Integer> contactosDesactivar,
        List<ContactoCreateRequest> contactosCrear
) {
}