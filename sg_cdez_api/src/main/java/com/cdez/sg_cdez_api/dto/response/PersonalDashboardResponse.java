package com.cdez.sg_cdez_api.dto.response;

import java.util.List;

public record PersonalDashboardResponse(
        long consultasTotales,
        long consultasEsteMes,
        long consultasHoy,
        long adultosAtendidos,
        List<ConsultasPorTipoResponse> consultasPorTipo,
        List<ConsultaRecienteResponse> consultasRecientes
) {
}
