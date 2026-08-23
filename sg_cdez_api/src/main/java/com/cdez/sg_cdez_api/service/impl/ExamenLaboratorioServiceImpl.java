package com.cdez.sg_cdez_api.service.impl;

import com.cdez.sg_cdez_api.dto.request.*;
import com.cdez.sg_cdez_api.dto.response.ExamenLaboratorioResponse;
import com.cdez.sg_cdez_api.entity.*;
import com.cdez.sg_cdez_api.repository.ExamenLaboratorioRepository;
import com.cdez.sg_cdez_api.service.ExamenLaboratorioService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;

@Service
@AllArgsConstructor
public class ExamenLaboratorioServiceImpl implements ExamenLaboratorioService {
    private final ExamenLaboratorioRepository REPOSITORY;
    @Override
    public List<ExamenLaboratorioResponse> listarExamenesPorConsulta(ConsultaNutricional consultaNutricional) {
        return REPOSITORY.findByConsultaNutricional(consultaNutricional).stream().map(this::mapDTO).toList();
    }

    @Override
    public List<ExamenLaboratorioResponse> crearExamenesLab(List<ExamenLaboratorioCreateRequest> requests, ConsultaNutricional consultaNutricional) {
        List<ExamenLaboratorioResponse> examenesNuevos = new ArrayList<>();
        for(var examen:requests){
            ExamenLaboratorio examenLaboratorio = new ExamenLaboratorio();

            examenLaboratorio.setConsultaNutricional(consultaNutricional);
            examenLaboratorio.setNombre(examen.nombre());
            examenLaboratorio.setValor(examen.valor());
            examenLaboratorio.setUnidad(examen.unidad());
            examenLaboratorio.setFecha(examen.fecha());
            examenLaboratorio.setObservaciones(examen.observaciones());

            ExamenLaboratorio examenLaboratorioNuevo = REPOSITORY.save(examenLaboratorio);
            examenesNuevos.add(mapDTO(examenLaboratorioNuevo));
        }

        return examenesNuevos;
    }

    @Override
    public List<ExamenLaboratorioResponse> actualizarExamenesLab(List<ExamenLaboratorioUpdateRequest> requests, ConsultaNutricional consultaNutricional) {
        List<ExamenLaboratorioResponse> examenesActualizados = new ArrayList<>();
        for(var examen:requests){
            ExamenLaboratorio examenLaboratorioAnterior = REPOSITORY.findByExamenIdAndConsultaNutricionalConsultaNutricionalId(examen.examenId(), consultaNutricional.getConsultaNutricionalId())
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.NOT_FOUND,
                            "El examen indicado no fue encontrado."
                    ));

            examenLaboratorioAnterior.setNombre(examen.nombre());
            examenLaboratorioAnterior.setValor(examen.valor());
            examenLaboratorioAnterior.setUnidad(examen.unidad());
            examenLaboratorioAnterior.setFecha(examen.fecha());
            examenLaboratorioAnterior.setObservaciones(examen.observaciones());

            ExamenLaboratorio examenLaboratorioNuevo = REPOSITORY.save(examenLaboratorioAnterior);

            examenesActualizados.add(mapDTO(examenLaboratorioNuevo));
        }

        return examenesActualizados;
    }

    private ExamenLaboratorioResponse mapDTO(ExamenLaboratorio examenLaboratorio){
        return new ExamenLaboratorioResponse(
                examenLaboratorio.getExamenId(),
                examenLaboratorio.getNombre(),
                examenLaboratorio.getValor(),
                examenLaboratorio.getUnidad(),
                examenLaboratorio.getFecha(),
                examenLaboratorio.getObservaciones()
        );
    }
}
