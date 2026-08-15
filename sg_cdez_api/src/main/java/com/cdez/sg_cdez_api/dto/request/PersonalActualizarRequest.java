package com.cdez.sg_cdez_api.dto.request;

import java.util.List;

public record PersonalActualizarRequest(
        int rol,
        String especialidad,
        String tipoIdentificacion,
        String identificacion,
        String primerNombre,
        String segundoNombre,
        String primerApellido,
        String segundoApellido,
        String direccion,
        String carnet,
        String usuario,

        List<ContactoUpdateRequest> contactosActualizar,
        List<Integer> contactosDesactivar,
        List<ContactoCreateRequest> contactosCrear,
        List<Integer> documentosDesactivar
) {
}
