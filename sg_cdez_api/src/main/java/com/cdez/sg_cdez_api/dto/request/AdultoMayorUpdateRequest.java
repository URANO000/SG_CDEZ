package com.cdez.sg_cdez_api.dto.request;

public record AdultoMayorUpdateRequest(
        String direccion,
        String escolaridad,
        String grupoFamiliar,
        String funcionalidadFisica,
        boolean ayudaBiomecanica
) {
}