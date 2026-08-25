package com.cdez.sg_cdez_api.util.Exceptions;

public class TokenExpiradoException extends RuntimeException{
    public TokenExpiradoException() {
        super("El código de verificación ha expirado");
    }
}
