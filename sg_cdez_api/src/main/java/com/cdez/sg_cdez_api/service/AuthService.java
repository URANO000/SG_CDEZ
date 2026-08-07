package com.cdez.sg_cdez_api.service;

import com.cdez.sg_cdez_api.dto.request.*;
import com.cdez.sg_cdez_api.dto.response.JwtAuthResponse;

public interface AuthService {
    JwtAuthResponse iniciarSesion(LoginRequest request);
    String cambiarContrasena(CambiaContrasenaRequest request);

    void activarCuenta(ActivateAccountRequest request);
    void reenviarVerificacion(ResendVerificationRequest request);
    void forgotPassword(ForgotPasswordRequest request);
    void resetContrasena(ResetPasswordRequest request);
}
