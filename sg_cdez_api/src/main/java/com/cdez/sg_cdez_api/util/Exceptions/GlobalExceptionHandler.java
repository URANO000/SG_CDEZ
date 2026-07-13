package com.cdez.sg_cdez_api.util.Exceptions;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(PageOutOfBoundsException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResponse handlePageOutOfBounds(PageOutOfBoundsException ex){
        return new ErrorResponse("PÁGINA_INVÁLIDA", ex.getMessage());
    }



    @Getter
    @AllArgsConstructor
    public static class ErrorResponse {
        private String code;
        private String meesage;
    }

}