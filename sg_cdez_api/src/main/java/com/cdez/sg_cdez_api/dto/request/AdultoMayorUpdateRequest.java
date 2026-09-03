package com.cdez.sg_cdez_api.dto.request;

import java.math.BigDecimal;

public record AdultoMayorUpdateRequest(
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
        boolean ayudaBiomecanica
) {
}