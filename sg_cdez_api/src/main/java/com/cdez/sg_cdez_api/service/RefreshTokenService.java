package com.cdez.sg_cdez_api.service;

import com.cdez.sg_cdez_api.entity.Personal;
import com.cdez.sg_cdez_api.entity.RefreshToken;

import java.util.UUID;

public interface RefreshTokenService {

    String crearRefreshToken(Personal personal);

    RefreshToken validarRefreshToken(String token);

    String rotarRefreshToken(String token);

    void revocarToken(String token);

    void revocarTodosPorPersonal(UUID personalId);

    long getExpirationMs();
}