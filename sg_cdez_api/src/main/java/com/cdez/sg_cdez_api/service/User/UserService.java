package com.cdez.sg_cdez_api.service.User;

public interface UserService {
    void IniciarSesion(String usuario, String contrasenna);
    void SalirSesion();
}
