package com.cdez.sg_cdez_api.service;

import com.cdez.sg_cdez_api.dto.request.*;
import com.cdez.sg_cdez_api.dto.response.JwtAuthResponse;

public interface AuthService {
    JwtAuthResponse iniciarSesion(LoginRequest request, String ip);
    String cambiarContrasena(CambiaContrasenaRequest request);
    JwtAuthResponse renovarSesion(String refreshToken);
    void registrarCierreSesion(String ip);
    void activarCuenta(ActivateAccountRequest request);
    void reenviarVerificacion(ResendVerificationRequest request);
    void forgotPassword(ForgotPasswordRequest request);
    void resetContrasena(ResetPasswordRequest request);
}
