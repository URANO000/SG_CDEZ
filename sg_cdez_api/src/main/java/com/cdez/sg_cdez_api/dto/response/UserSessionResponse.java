package com.cdez.sg_cdez_api.dto.response;

import java.util.UUID;

public record UserSessionResponse(
        UUID usuarioId,
        String usuario,
        String rol
) {
}
