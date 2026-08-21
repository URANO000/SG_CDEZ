package com.cdez.sg_cdez_api.service.impl;

import com.cdez.sg_cdez_api.dto.request.*;
import com.cdez.sg_cdez_api.dto.response.AntropometriaResponse;
import com.cdez.sg_cdez_api.entity.*;
import com.cdez.sg_cdez_api.repository.AntropometriaRepository;
import com.cdez.sg_cdez_api.service.AntropometriaService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;



@Service
@AllArgsConstructor
public class AntropometriaServiceImpl implements AntropometriaService {
    private final AntropometriaRepository REPOSITORY;
    @Override
    public AntropometriaResponse obtenerAntropometriaPorConsulta(ConsultaNutricional consultaNutricional) {
        return mapDTO(REPOSITORY.findByConsultaNutricional(consultaNutricional)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Antropometria por consulta nutricional no encontrada."
                )));
    }

    @Override
    public AntropometriaResponse crearAntropometria(AntropometriaCreateRequest request, ConsultaNutricional consultaNutricional) {
        Antropometria nuevaAntropometria = new Antropometria();

        nuevaAntropometria.setConsultaNutricional(consultaNutricional);
        nuevaAntropometria.setPesoActual(request.pesoActual());
        nuevaAntropometria.setPesoHabitual(request.pesoHabitual());
        nuevaAntropometria.setPesoHace6Meses(request.pesoHace6Meses());
        nuevaAntropometria.setTalla(request.talla());
        nuevaAntropometria.setAlturaEstimada(request.alturaEstimada());
        nuevaAntropometria.setImc(request.imc());
        nuevaAntropometria.setCircunferenciaPantorrilla(request.circunferenciaPantorrilla());
        nuevaAntropometria.setCircunferenciaBraquial(request.circunferenciaBranquial());
        nuevaAntropometria.setCircunferenciaCintura(request.circunferenciaCintura());
        nuevaAntropometria.setPerdidaPesoPorcentaje(request.perdidaPesoPorcentaje());

        Antropometria antropometria = REPOSITORY.save(nuevaAntropometria);

        return mapDTO(antropometria);
    }

    @Override
    public AntropometriaResponse actualizarAntropometria(AntropometriaUpdateRequest request, ConsultaNutricional consultaNutricional) {
        Antropometria antropometriaVieja = REPOSITORY.findById(request.antropometriaId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Antropometria indicada no encontrada."
                ));
        antropometriaVieja.setPesoActual(request.pesoActual());
        antropometriaVieja.setPesoHabitual(request.pesoHabitual());
        antropometriaVieja.setPesoHace6Meses(request.pesoHace6Meses());
        antropometriaVieja.setTalla(request.talla());
        antropometriaVieja.setAlturaEstimada(request.alturaEstimada());
        antropometriaVieja.setImc(request.imc());
        antropometriaVieja.setCircunferenciaPantorrilla(request.circunferenciaPantorrilla());
        antropometriaVieja.setCircunferenciaBraquial(request.circunferenciaBraquial());
        antropometriaVieja.setCircunferenciaCintura(request.circunferenciaCintura());
        antropometriaVieja.setPerdidaPesoPorcentaje(request.perdidaPesoPorcentaje());

        Antropometria antropometriaNueva = REPOSITORY.save(antropometriaVieja);

        return mapDTO(antropometriaNueva);
    }

    private AntropometriaResponse mapDTO(Antropometria antropometria){
        return new AntropometriaResponse(
                antropometria.getAntropometriaId(),
                antropometria.getPesoActual(),
                antropometria.getPesoHabitual(),
                antropometria.getPesoHace6Meses(),
                antropometria.getTalla(),
                antropometria.getAlturaEstimada(),
                antropometria.getImc(),
                antropometria.getCircunferenciaPantorrilla(),
                antropometria.getCircunferenciaBraquial(),
                antropometria.getCircunferenciaCintura(),
                antropometria.getPerdidaPesoPorcentaje()
        );
    }
}
