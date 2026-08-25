package com.cdez.sg_cdez_api.dto.response;

import java.util.List;

public record AyudanteDashboardResponse(
        long adultosActivos,
        long adultosInactivos,
        long adultosNuevosEsteMes,
        long consultasTotales,
        long consultasEsteMes,
        long consultasHoy,
        List<ConsultasPorTipoResponse> consultasPorTipo,
        List<ConsultaRecienteResponse> consultasRecientes
) {
}
