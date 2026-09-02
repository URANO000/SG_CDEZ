package com.cdez.sg_cdez_api.service.impl;

import com.cdez.sg_cdez_api.dto.request.*;
import com.cdez.sg_cdez_api.entity.*;
import com.cdez.sg_cdez_api.repository.ConsultaNutricionalRepository;
import com.cdez.sg_cdez_api.service.*;
import com.cdez.sg_cdez_api.util.AuthHelper;
import jakarta.transaction.Transactional;
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
    private final ReferenciaService REFERENCIA_SERVICE;
    private final AuditoriaService AUDITORIA_SERVICE;


    @Override
    @Transactional
    public void crearConsultaNutricional(ConsultaNutricionalCreateRequest request) {
        validarEspecialidad(AUTH_HELPER.obtenerUsuarioAutenticado());

        ConsultaNutricional consultaNutricional = new ConsultaNutricional();
        Consulta consulta = CONSULTA_SERVICE.crearConsultaEntity(request.consultaGeneral());

        consultaNutricional.setConsulta(consulta);

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
        consultaNutricional.setDiarrea(request.diarrea());
        consultaNutricional.setEstrenimiento(request.estrenimiento());
        consultaNutricional.setFrecuenciaEvacuaciones(request.frecuenciaEvacuaciones() == null
                ? null
                : request.frecuenciaEvacuaciones().trim());
        consultaNutricional.setConsistenciaBristol(request.consistenciaBristol() == null
                ? null
                : request.consistenciaBristol().trim());
        consultaNutricional.setEstadoCognitivo(request.estadoCognitivo() == null
                ? null
                : request.estadoCognitivo().trim());

        ConsultaNutricional consultaNutricionalGuardada = REPOSITORY.save(consultaNutricional);

        TAMIZAJE_SERVICE.crearTamizajes(request.tamizajes(), consultaNutricionalGuardada);

        EXAMENLAB_SERVICE.crearExamenesLab(request.examenesLaboratorio(), consultaNutricionalGuardada);

        ANTROPOMETRIA_SERVICE.crearAntropometria(request.antropometria(), consultaNutricionalGuardada);

        if(request.consultaGeneral().referencia() != null){
            REFERENCIA_SERVICE.crearReferencia(
                    consulta,
                    request.consultaGeneral().referencia()
            );
        }
        AUDITORIA_SERVICE.registrarAccion(
                "REGISTRAR_CONSULTA_NUTRICIONAL",
                "CONSULTA",
                "Consulta",
                consulta.getConsultaId().toString(),
                "Se registró una consulta nutricional para el adulto mayor: "
                        + consulta
                        .getAdultoMayor()
                        .getNombreCompleto()
                        + "."
        );
    }

    @Override
    @Transactional
    public void actualizarConsultaNutricional(UUID id, ConsultaNutricionalUpdateRequest request) {
        validarEspecialidad(AUTH_HELPER.obtenerUsuarioAutenticado());

        ConsultaNutricional consultaNutricionalVieja = obtenerConsultaNutricionalCheck(id);
        UUID consultaId = consultaNutricionalVieja.getConsulta().getConsultaId();

        CONSULTA_SERVICE.actualizarConsulta(request.consulta(), consultaId);

        consultaNutricionalVieja.setHistoriaAlimentaria(
                request.historiaAlimentaria() == null
                        ? null
                        : request.historiaAlimentaria().trim()
        );

        consultaNutricionalVieja.setApetito(request.apetito());

        consultaNutricionalVieja.setMasticacion(
                request.masticacion() == null
                        ? null
                        : request.masticacion().trim()
        );

        consultaNutricionalVieja.setDeglucion(
                request.deglucion() == null
                        ? null
                        : request.deglucion().trim()
        );

        consultaNutricionalVieja.setNauseas(request.nauseas());
        consultaNutricionalVieja.setVomitos(request.vomitos());
        consultaNutricionalVieja.setDistension(request.distension());
        consultaNutricionalVieja.setGases(request.gases());
        consultaNutricionalVieja.setReflujo(request.reflujo());
        consultaNutricionalVieja.setDiarrea(request.diarrea());
        consultaNutricionalVieja.setEstrenimiento(request.estrenimiento());

        consultaNutricionalVieja.setFrecuenciaEvacuaciones(
                request.frecuenciaEvacuaciones() == null
                        ? null
                        : request.frecuenciaEvacuaciones().trim()
        );

        consultaNutricionalVieja.setConsistenciaBristol(
                request.consistenciaBristol() == null
                        ? null
                        : request.consistenciaBristol().trim()
        );

        consultaNutricionalVieja.setEstadoCognitivo(
                request.estadoCognitivo() == null
                        ? null
                        : request.estadoCognitivo().trim()
        );

        ConsultaNutricional actualizada = REPOSITORY.save(consultaNutricionalVieja);

        if(request.tamizajes() != null){
            TAMIZAJE_SERVICE.actualizarTamizajes(request.tamizajes(), actualizada);
        }

        if(request.examenesLaboratorio() != null){
            EXAMENLAB_SERVICE.actualizarExamenesLab(request.examenesLaboratorio(), actualizada);
        }

        if(request.antropometria() != null){
            ANTROPOMETRIA_SERVICE.actualizarAntropometria(request.antropometria(), actualizada);
        }

    }

    @Override
    @Transactional
    public void desactivarConsultaNutricional(UUID id) {
        ConsultaNutricional consultaNutricional = obtenerConsultaNutricionalCheck(id);
        CONSULTA_SERVICE.desactivarConsulta(consultaNutricional.getConsulta().getConsultaId());
        validarEspecialidad(AUTH_HELPER.obtenerUsuarioAutenticado());

        consultaNutricional.getConsulta().setActivo(false);
        REPOSITORY.save(consultaNutricional);
    }

    private ConsultaNutricional obtenerConsultaNutricionalCheck(UUID id){
        return REPOSITORY.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Consulta Nutricional indicada no encontrada."
                ));
    }

    private void validarEspecialidad(Personal personal){
        String especialidad = personal.getEspecialidad() != null
                ? personal.getEspecialidad().getLabel()
                : null;
        if(especialidad == null){
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Personal no tiene especialidad."
            );
        }

        if(!especialidad.equals("Nutrición")){
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Sólo personal de nutrición puede realizar acciones sobre consulta nutricional."
            );
        }
    }
}
