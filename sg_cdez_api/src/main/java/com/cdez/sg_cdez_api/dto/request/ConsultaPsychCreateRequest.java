package com.cdez.sg_cdez_api.dto.request;

import java.util.List;

public record ConsultaPsychCreateRequest(
        ConsultaCreateRequest consultaGeneral,
        List<TamizajeCreateRequest> tamizajes
) {
}
