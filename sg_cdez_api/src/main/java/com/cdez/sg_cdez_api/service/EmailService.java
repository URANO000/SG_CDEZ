package com.cdez.sg_cdez_api.service;

import org.springframework.stereotype.Service;

@Service
public interface EmailService {
    void enviarCredenciales(String correo, String passwordTemp);
    void enviarCorreoVerificacion(String usuario, String token, String nombre);

    void enviarCorreoReset(String usuario, String token, String nombre);
}
