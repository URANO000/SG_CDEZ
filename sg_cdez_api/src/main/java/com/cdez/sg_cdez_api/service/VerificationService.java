package com.cdez.sg_cdez_api.service;

import com.cdez.sg_cdez_api.entity.Personal;
import org.springframework.stereotype.Service;

@Service
public interface VerificationService {
    void verificacionCrearYEnviar(Personal personal);
    void generarYEnviarToken(Personal personal);
}
