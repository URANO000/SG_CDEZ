package com.cdez.sg_cdez_api.dto.request;

import java.util.List;

public record ConsultaPsychActualizarRequest (
    ConsultaUpdateRequest consulta,
    List<TamizajeUpdateRequest> tamizajes
)
{}
