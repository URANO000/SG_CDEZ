package com.cdez.sg_cdez_api.dto.request;


public record ConsultaFiltro(
        String searchTerm,
        boolean personalView,
        String especialidad
) {
}
