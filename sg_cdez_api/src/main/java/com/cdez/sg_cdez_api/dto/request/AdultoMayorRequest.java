package com.cdez.sg_cdez_api.dto.request;

import java.time.LocalDateTime;
import java.math.BigDecimal;

public record AdultoMayorRequest(
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
        String estadoCivil,
        String gradoDependencia,
        BigDecimal cuotaMensual,
        boolean pension,
        String tipoPension,
        BigDecimal montoPension,
        String funcionalidadFisica,
        boolean ayudaBiomecanica,
        LocalDateTime fechaIngreso
) {
}