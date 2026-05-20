package com.cdez.sg_cdez_api.service;

import com.cdez.sg_cdez_api.dto.request.LoginRequest;

public interface AuthService {
    String login(LoginRequest loginRequest);
}
