package com.cdez.sg_cdez_api.service;

import com.cdez.sg_cdez_api.dto.request.ActivateAccountRequest;
import com.cdez.sg_cdez_api.dto.request.CambiaContrasenaRequest;
import com.cdez.sg_cdez_api.dto.request.LoginRequest;
import com.cdez.sg_cdez_api.dto.request.ResendVerificationRequest;
import com.cdez.sg_cdez_api.dto.response.JwtAuthResponse;

import java.util.UUID;

public interface AuthService {
    JwtAuthResponse iniciarSesion(LoginRequest request);
    String cambiarContrasena(CambiaContrasenaRequest request, UUID usuarioId);

    void activarCuenta(ActivateAccountRequest request);
    void reenviarVerificacion(ResendVerificationRequest request);
}
