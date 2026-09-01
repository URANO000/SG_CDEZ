package com.cdez.sg_cdez_api.dto.response;

import java.util.List;
import java.util.UUID;

public record ConsultaPsychResponse(
        UUID consultaPsychId,
    List<TamizajeResponse> tamizajes
) {
}
