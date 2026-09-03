package com.cdez.sg_cdez_api.util;

import com.cdez.sg_cdez_api.entity.enums.Especialidad;
import com.cdez.sg_cdez_api.entity.enums.TipoTamizaje;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;

@Component
public class TamizajeValidator {
    public void validar(TipoTamizaje tipo, BigDecimal puntaje, Especialidad especialidadConsulta){
        if(tipo == null){
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "El tipo de tamizaje es obligatorio."
            );
        }

        if(!tipo.perteneceA(especialidadConsulta)){
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "El tamizaje %s pertenece a %s y no puede utilizarse en una consulta de %s."
                            .formatted(
                                    tipo,
                                    tipo.getEspecialidad().getLabel(),
                                    especialidadConsulta.getLabel()
                            )
            );
        }

        if(tipo.requierePuntaje() && puntaje == null){
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "El tamizaje %s requiere un puntaje."
                            .formatted(tipo)
            );
        }

        if(!tipo.requierePuntaje() && puntaje != null){
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "El tamizaje %s no admite puntaje."
                            .formatted(tipo)
            );
        }
    }
}
