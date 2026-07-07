package com.cdez.sg_cdez_api.dto.request;

import java.util.*;

public record PersonalCreateRequest(
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

        List<ContactoCreateRequest> contactos
) {
}
