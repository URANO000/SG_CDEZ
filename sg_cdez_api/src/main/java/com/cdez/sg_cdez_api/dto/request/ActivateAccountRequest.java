package com.cdez.sg_cdez_api.dto.request;

public record ActivateAccountRequest(
        String token,
        String contrasena,
        String confirmarContrasena
) {
}
