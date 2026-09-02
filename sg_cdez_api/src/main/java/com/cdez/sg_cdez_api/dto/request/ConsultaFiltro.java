package com.cdez.sg_cdez_api.dto.request;


import java.time.LocalDate;

public record ConsultaFiltro(
        String searchTerm,
        boolean personalView,
        String especialidad,
        LocalDate fecha,
        LocalDate fechaDesde,
        LocalDate fechaHasta
) {
}
