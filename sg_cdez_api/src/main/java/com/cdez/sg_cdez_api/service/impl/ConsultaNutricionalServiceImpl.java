package com.cdez.sg_cdez_api.service.impl;

import com.cdez.sg_cdez_api.dto.request.*;
import com.cdez.sg_cdez_api.dto.response.*;
import com.cdez.sg_cdez_api.entity.*;
import com.cdez.sg_cdez_api.repository.ConsultaNutricionalRepository;
import com.cdez.sg_cdez_api.service.*;
import com.cdez.sg_cdez_api.util.AuthHelper;
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
    private final AuthHelper AUTH_HELPER;

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
        validarEspecialidad(AUTH_HELPER.obtenerUsuarioAutenticado().getPersonalId());

        ConsultaNutricional consultaNutricional = new ConsultaNutricional();
        CONSULTA_SERVICE.crearConsulta(request.consultaGeneral());

        consultaNutricional.setHistoriaAlimentaria(request.historiaAlimentaria() == null
                ? null
                : request.historiaAlimentaria().trim());
        consultaNutricional.setApetito(request.apetito());
        consultaNutricional.setMasticacion(request.masticacion() == null
                ? null
                : request.masticacion().trim());
        consultaNutricional.setDeglucion(request.deglucion() == null
                ? null
                : request.deglucion().trim());
        consultaNutricional.setNauseas(request.nauseas());
        consultaNutricional.setVomitos(request.vomitos());
        consultaNutricional.setDistension(request.distension());
        consultaNutricional.setGases(request.gases());
        consultaNutricional.setReflujo(request.reflujo());
        consultaNutricional.setFrecuenciaEvacuaciones(request.frecuenciaEvacuaciones() == null
                ? null
                : request.frecuenciaEvacuaciones().trim());
        consultaNutricional.setConsistenciaBristol(request.consistenciaBristol() == null
                ? null
                : request.consistenciaBristol().trim());
        consultaNutricional.setEstadoCognitivo(request.estadoCognitivo() == null
                ? null
                : request.estadoCognitivo().trim());

        REPOSITORY.save(consultaNutricional);

        TAMIZAJE_SERVICE.crearTamizajes(request.tamizajes(), consultaNutricional);

        return null;
    }

    @Override
    public ConsultaNutricionalResponse actualizarConsultaNutricional(UUID id, ConsultaNutricionalUpdateRequest request) {
        return null;
    }

    @Override
    public ConsultaNutricionalResponse desactivarConsultaNutricional(UUID id) {
        ConsultaNutricional consultaNutricional = obtenerConsultaNutricionalCheck(id);
        CONSULTA_SERVICE.verificarEdicionValida(consultaNutricional.getConsulta().getConsultaId());
        validarEspecialidad(id);

        consultaNutricional.getConsulta().setActivo(false);
        REPOSITORY.save(consultaNutricional);
        return mapDTO(consultaNutricional);
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
                TAMIZAJE_SERVICE.listarTamizajesPorConsulta(consultaNutricional),
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

    private void validarEspecialidad(UUID id){
        Personal personal = AUTH_HELPER.obtenerUsuarioAutenticado();
        String especialidad = personal.getEspecialidad() != null
                ? personal.getEspecialidad().toUpperCase().trim()
                : null;
        if(especialidad == null){
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Personal no tiene especialidad."
            );
        }

        if(!especialidad.equals("NUTRICIÓN")){
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Sólo personal de nutrición puede realizar acciones sobre consulta nutricional."
            );
        }
    }
}
