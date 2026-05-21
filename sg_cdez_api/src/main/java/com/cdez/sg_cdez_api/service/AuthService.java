package com.cdez.sg_cdez_api.service;

import com.cdez.sg_cdez_api.dto.request.LoginRequest;
import com.cdez.sg_cdez_api.dto.response.JwtAuthResponse;

public interface AuthService {
    JwtAuthResponse iniciarSesion(LoginRequest loginRequest);
}
