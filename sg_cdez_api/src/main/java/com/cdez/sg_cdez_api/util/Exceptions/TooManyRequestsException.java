package com.cdez.sg_cdez_api.util.Exceptions;

import org.springframework.http.HttpStatus;

public class TooManyRequestsException extends RuntimeException{
    public TooManyRequestsException(String message) {
        super(message);
    }

}
