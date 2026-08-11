package com.cdez.sg_cdez_api.service;

import org.springframework.stereotype.Service;

import java.time.Duration;

@Service
public interface RateLimiterService {
    boolean permitirLogin(String ip, String usuario);
    boolean permitirForgotPassword(String ip, String correo);
    boolean permitirReenvioVerificacion(String ip, String correo);
    boolean permitir(String key, int capacidad, Duration ventana);
}
