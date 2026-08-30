package com.cdez.sg_cdez_api.service.impl;

import com.cdez.sg_cdez_api.dto.request.TamizajeNutricionalCreateRequest;
import com.cdez.sg_cdez_api.dto.request.TamizajeNutricionalUpdateRequest;
import com.cdez.sg_cdez_api.dto.response.TamizajeResponse;
import com.cdez.sg_cdez_api.entity.ConsultaNutricional;
import com.cdez.sg_cdez_api.entity.Tamizaje;
import com.cdez.sg_cdez_api.repository.TamizajeRepository;
import com.cdez.sg_cdez_api.service.TamizajeService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.*;

@Service
@AllArgsConstructor
public class TamizajeServiceImpl implements TamizajeService {
    private final TamizajeRepository REPOSITORY;

    @Override
    public List<TamizajeResponse> listarTamizajesPorConsultaNutricional(ConsultaNutricional consultaNutricional) {
        return REPOSITORY.findByConsultaNutricional(consultaNutricional).stream().map(this::mapDTO).toList();
    }

    @Override
    public List<TamizajeResponse> crearTamizajesNutricional(List<TamizajeNutricionalCreateRequest> requests, ConsultaNutricional consultaNutricional) {
        List<TamizajeResponse> tamizajesNuevos = new ArrayList<>();
        for(var tamizaje : requests){
            Tamizaje tamizajeNutricional = new Tamizaje();

            tamizajeNutricional.setConsultaNutricional(consultaNutricional);
            tamizajeNutricional.setTipo(tamizaje.tipo());
            tamizajeNutricional.setPuntaje(tamizaje.puntaje());
            tamizajeNutricional.setResultado(tamizaje.resultado());
            tamizajeNutricional.setObservaciones(tamizaje.observaciones());

            REPOSITORY.save(tamizajeNutricional);
            tamizajesNuevos.add(mapDTO(tamizajeNutricional));
        }
        return tamizajesNuevos;
    }

    @Override
    public List<TamizajeResponse> actualizarTamizajesNutricional(List<TamizajeNutricionalUpdateRequest> requests, ConsultaNutricional consultaNutricional) {
        List<TamizajeResponse> tamizajesActualizados = new ArrayList<>();
        for(var tamizaje : requests){
            Tamizaje tamizajeNutricional = REPOSITORY.findByTamizajeIdAndConsultaNutricionalConsultaNutricionalId(tamizaje.tamizajeId(), consultaNutricional.getConsultaNutricionalId())
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.NOT_FOUND,
                            "Tamizaje indicado no fue encontrado."
                    ));
            tamizajeNutricional.setTipo(tamizaje.tipo());
            tamizajeNutricional.setPuntaje(tamizaje.puntaje());
            tamizajeNutricional.setResultado(tamizaje.resultado());
            tamizajeNutricional.setObservaciones(tamizaje.observaiones());

            Tamizaje tamizajeNutricionalNuevo =  REPOSITORY.save(tamizajeNutricional);
            tamizajesActualizados.add(mapDTO(tamizajeNutricionalNuevo));
        }
        return tamizajesActualizados;
    }

    private TamizajeResponse mapDTO(Tamizaje tamizajeNutricional){
        return new TamizajeResponse(
                tamizajeNutricional.getTamizajeId(),
                tamizajeNutricional.getTipo(),
                tamizajeNutricional.getPuntaje(),
                tamizajeNutricional.getResultado(),
                tamizajeNutricional.getObservaciones()
        );
    }

}
