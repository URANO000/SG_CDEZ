package com.cdez.sg_cdez_api.dto.response;

import java.time.LocalDateTime;
import java.util.UUID;

public record AdultoMayorResponse(
        UUID adultoId,
        String tipoIdentificacion,
        String identificacion,
        String primerNombre,
        String segundoNombre,
        String primerApellido,
        String segundoApellido,
        String nacionalidad,
        LocalDateTime fechaNacimiento,
        String sexo,
        String direccion,
        String escolaridad,
        String grupoFamiliar,
        boolean pension,
        String funcionalidadFisica,
        boolean ayudaBiomecanica,
        LocalDateTime fechaIngreso,
        boolean activo
) {
}