package com.cdez.sg_cdez_api.dto.request;

import lombok.Data;

@Data
public class LoginRequest {
    private String usuario;
    private String contrasena;
}
