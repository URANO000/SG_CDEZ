package com.cdez.sg_cdez_api.dto.response;

import java.util.List;

public record DashboardResponse(
        long adultosActivos,
        long personalActivo,
        long consultasActivas,
        long consultasEsteMes,
        List<ConsultasPorEspecialidadResponse> consultasPorEspecialidad
) {
}
