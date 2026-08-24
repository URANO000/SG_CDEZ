package com.cdez.sg_cdez_api.dto.request;


import com.cdez.sg_cdez_api.entity.enums.Especialidad;
import com.cdez.sg_cdez_api.entity.enums.TipoIdentificacion;

import java.util.List;

public record PersonalCreateRequest(
        int rol,
        Especialidad especialidad,
        TipoIdentificacion tipoIdentificacion,
        String identificacion,
        String primerNombre,
        String segundoNombre,
        String primerApellido,
        String segundoApellido,
        String direccion,
        String carnet,
        String usuario,

        List<ContactoCreateRequest> contactos
) {
}
