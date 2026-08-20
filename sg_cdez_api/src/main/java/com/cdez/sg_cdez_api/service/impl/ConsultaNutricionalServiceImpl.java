package com.cdez.sg_cdez_api.service.impl;

import com.cdez.sg_cdez_api.dto.request.*;
import com.cdez.sg_cdez_api.dto.response.*;
import com.cdez.sg_cdez_api.entity.Consulta;
import com.cdez.sg_cdez_api.entity.ConsultaNutricional;
import com.cdez.sg_cdez_api.repository.ConsultaNutricionalRepository;
import com.cdez.sg_cdez_api.service.*;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.UUID;
@Service
@AllArgsConstructor
public class ConsultaNutricionalServiceImpl implements ConsultaNutricionalService {
    private final ConsultaNutricionalRepository REPOSITORY;
    private final ConsultaService CONSULTA_SERVICE;
    private final TamizajeService TAMIZAJE_SERVICE;
    private final AntropometriaService ANTROPOMETRIA_SERVICE;
    private final ExamenLaboratorioService EXAMENLAB_SERVICE;

    @Override
    public ConsultaNutricionalResponse listarConsultasNutricionalesFiltradas(ConsultaFiltro filtro) {
        return null;
    }

    @Override
    public ConsultaNutricionalResponse obtenerConsultaNutricionalPorId(UUID id) {
        return mapDTO(obtenerConsultaNutricionalCheck(id));
    }

    @Override
    public ConsultaNutricionalResponse crearConsultaNutricional(ConsultaNutricionalCreateRequest request) {
        return null;
    }

    @Override
    public ConsultaNutricionalResponse actualizarConsultaNutricional(UUID id, ConsultaNutricionalUpdateRequest request) {
        return null;
    }

    @Override
    public ConsultaNutricionalResponse desactivarConsultaNutricional(UUID id) {
        return null;
    }

    private ConsultaNutricionalResponse mapDTO(ConsultaNutricional consultaNutricional){
        Consulta consulta = consultaNutricional.getConsulta();

        return new ConsultaNutricionalResponse(
                consultaNutricional.getConsultaNutricionalId(),
                CONSULTA_SERVICE.mapDTO(consulta),
                consultaNutricional.getHistoriaAlimentaria(),
                consultaNutricional.getApetito(),
                consultaNutricional.getMasticacion(),
                consultaNutricional.getDeglucion(),
                consultaNutricional.getNauseas(),
                consultaNutricional.getVomitos(),
                consultaNutricional.getDistension(),
                consultaNutricional.getGases(),
                consultaNutricional.getReflujo(),
                consultaNutricional.getFrecuenciaEvacuaciones(),
                consultaNutricional.getConsistenciaBristol(),
                consultaNutricional.getEstadoCognitivo(),
                TAMIZAJE_SERVICE.listarTamizajesPorConsulta(consultaNutricional.getConsultaNutricionalId()),
                EXAMENLAB_SERVICE.listarExamenesPorConsulta(consultaNutricional.getConsultaNutricionalId()),
                ANTROPOMETRIA_SERVICE.listarAntropometriaPorConsulta(consultaNutricional.getConsultaNutricionalId())
        );
    }

    private ConsultaNutricional obtenerConsultaNutricionalCheck(UUID id){
        return REPOSITORY.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Consulta Nutricional indicada no encontrada."
                ));
    }
}
