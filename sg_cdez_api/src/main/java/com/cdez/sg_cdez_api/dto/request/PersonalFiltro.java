package com.cdez.sg_cdez_api.dto.request;

public record PersonalFiltro(
        String searchTerm,
        String especialidad,
        Boolean activo
) {
}
