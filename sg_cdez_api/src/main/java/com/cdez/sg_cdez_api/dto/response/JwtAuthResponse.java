package com.cdez.sg_cdez_api.dto.response;

import lombok.Data;

@Data
public class JwtAuthResponse {
    private String accessToken;
    private String refreshToken;
    private boolean recordarme;
}
