package com.cdez.sg_cdez_api.dto.request;

import java.util.UUID;

public record ReferenciaCreateRequest(
        UUID receptorId,
        String mensaje
) {
}
