package com.cdez.sg_cdez_api.service;

import com.cdez.sg_cdez_api.entity.Personal;
import org.springframework.stereotype.Service;

@Service
public interface TokenService {
    void verificacionCrearYEnviar(Personal personal);
    void generarYEnviarVerificacionToken(Personal personal);

    void generarYEnviarResetToken(Personal personal);
}
