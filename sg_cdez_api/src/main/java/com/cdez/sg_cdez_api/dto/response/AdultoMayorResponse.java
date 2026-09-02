package com.cdez.sg_cdez_api.dto.response;

import java.time.LocalDateTime;
import java.util.UUID;
import java.math.BigDecimal;

public record AdultoMayorResponse(
        UUID adultoId,
        String tipoIdentificacion,
        String identificacion,
        String nombreCompleto,
        String nacionalidad,
        LocalDateTime fechaNacimiento,
        String sexo,
        String direccion,
        String escolaridad,
        String grupoFamiliar,
        boolean pension,
        String tipoPension,
        BigDecimal montoPension,
        String funcionalidadFisica,
        boolean ayudaBiomecanica,
        LocalDateTime fechaIngreso,
        String activo
) {
}