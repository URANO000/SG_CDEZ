package com.cdez.sg_cdez_api.service.impl;

import com.cdez.sg_cdez_api.dto.request.*;
import com.cdez.sg_cdez_api.dto.response.TamizajeResponse;
import com.cdez.sg_cdez_api.entity.*;
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
        return REPOSITORY.findByConsultaConsultaNutricional(consultaNutricional).stream().map(this::mapDTO).toList();
    }

    public List<TamizajeResponse> listarTamizajesPorConsultaPsych(ConsultaPsych consultaPsych){
        return REPOSITORY.findByConsultaConsultaPsych(consultaPsych).stream().map(this::mapDTO).toList();
    }

    @Override
    public List<TamizajeResponse> crearTamizajesNutricional(List<TamizajeCreateRequest> requests, ConsultaNutricional consultaNutricional) {
        List<TamizajeResponse> tamizajesNuevos = new ArrayList<>();
        for(var tamizaje : requests){
            Tamizaje tamizajeNutricional = new Tamizaje();

            tamizajeNutricional.setConsulta(consultaNutricional.getConsulta());
            tamizajeNutricional.setTipo(tamizaje.tipo());
            tamizajeNutricional.setPuntaje(tamizaje.puntaje());
            tamizajeNutricional.setResultado(tamizaje.resultado());
            tamizajeNutricional.setObservaciones(tamizaje.observaciones());

            REPOSITORY.save(tamizajeNutricional);
            tamizajesNuevos.add(mapDTO(tamizajeNutricional));
        }
        return tamizajesNuevos;
    }

    public List<TamizajeResponse> crearTamizajesPsych(List<TamizajeCreateRequest> requests, ConsultaPsych consultaPsych){
        List<TamizajeResponse> tamizajesNuevos = new ArrayList<>();
        for(var tamizaje: requests){
            Tamizaje tamizajePsyh = new Tamizaje();

            tamizajePsyh.setConsulta(consultaPsych.getConsulta());
            tamizajePsyh.setTipo(tamizaje.tipo());
            tamizajePsyh.setResultado(tamizaje.resultado());
            tamizajePsyh.setObservaciones(tamizaje.observaciones());

            // No aplica
            tamizajePsyh.setPuntaje(null);
            REPOSITORY.save(tamizajePsyh);
            tamizajesNuevos.add(mapDTO(tamizajePsyh));
        }

        return tamizajesNuevos;
    }

    @Override
    public List<TamizajeResponse> actualizarTamizajesNutricional(List<TamizajeUpdateRequest> requests, ConsultaNutricional consultaNutricional) {
        List<TamizajeResponse> tamizajesActualizados = new ArrayList<>();
        for(var tamizaje : requests){
            Tamizaje tamizajeNutricional = REPOSITORY.findByTamizajeIdAndConsultaConsultaNutricionalConsultaNutricionalId(tamizaje.tamizajeId(), consultaNutricional.getConsultaNutricionalId())
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

    public List<TamizajeResponse> actualizarTamizajesPsych(List<TamizajeUpdateRequest> requests, ConsultaPsych consultaPsych){
        List<TamizajeResponse> tamizajesActualizados = new ArrayList<>();
        for(var tamizaje: requests){
            Tamizaje tamizajePsych = REPOSITORY.findByTamizajeIdAndConsultaConsultaPsychConsultaPsychId(tamizaje.tamizajeId(),consultaPsych.getConsultaPsychId())
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.NOT_FOUND,
                            "Tamizaje indicado no fue encontrado."
                    ));
            tamizajePsych.setTipo(tamizaje.tipo());
            tamizajePsych.setResultado(tamizaje.resultado());
            tamizajePsych.setObservaciones(tamizaje.observaiones());

            // No aplica
            tamizajePsych.setPuntaje(null);
            Tamizaje tamizajePsychNuevo = REPOSITORY.save(tamizajePsych);
            tamizajesActualizados.add(mapDTO(tamizajePsychNuevo));
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
