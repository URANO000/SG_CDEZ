package com.cdez.sg_cdez_api.dto.request;

public record ResetPasswordRequest(
        String token,
        String contrasena,
        String confirmarContrasena
) {
}
