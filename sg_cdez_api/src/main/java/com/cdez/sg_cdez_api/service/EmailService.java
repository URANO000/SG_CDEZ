package com.cdez.sg_cdez_api.service;

import org.springframework.stereotype.Service;

@Service
public interface EmailService {
    void enviarCorreoVerificacion(String usuario, String token, String nombre);

    void enviarCorreoReset(String usuario, String token, String nombre);
    void enviarCorreoReferencia(
            String correoReceptor,
            String nombreReceptor,
            String nombreEmisor,
            String especialidadEmisor,
            String nombreAdultoMayor,
            String mensaje,
            String consultaId
    );
}
