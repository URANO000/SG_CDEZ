package com.cdez.sg_cdez_api.service;

public interface EmailService {
    void enviarCredenciales(String correo, String passwordTemp);
    void enviarCorreoVerificacion(String usuario, String token);
}
