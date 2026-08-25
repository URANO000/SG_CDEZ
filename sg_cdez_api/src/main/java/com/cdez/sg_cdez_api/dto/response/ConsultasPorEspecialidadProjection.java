package com.cdez.sg_cdez_api.dto.response;

import com.cdez.sg_cdez_api.entity.enums.Especialidad;

public interface ConsultasPorEspecialidadProjection {

    Especialidad getEspecialidad();

    Long getCantidad();
}
