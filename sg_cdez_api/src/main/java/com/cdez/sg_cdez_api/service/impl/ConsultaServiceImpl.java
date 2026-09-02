package com.cdez.sg_cdez_api.service.impl;

import com.cdez.sg_cdez_api.dto.request.*;
import com.cdez.sg_cdez_api.dto.response.*;
import com.cdez.sg_cdez_api.entity.*;
import com.cdez.sg_cdez_api.entity.enums.Especialidad;
import com.cdez.sg_cdez_api.repository.ConsultaRepository;
import com.cdez.sg_cdez_api.repository.specifications.ConsultaSpecs;
import com.cdez.sg_cdez_api.service.*;
import com.cdez.sg_cdez_api.util.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.*;
import java.util.UUID;


@Service
@RequiredArgsConstructor
public class ConsultaServiceImpl implements ConsultaService {
    private final ConsultaRepository REPOSITORY;
    private final AuthHelper AUTH_HELPER;
    private final ValidationHelper VALIDATION_HELPER;
    private final AdultoMayorService ADULTO_SERVICE;
    private final TamizajeService TAMIZAJE_SERVICE;
    private final AntropometriaService ANTROPOMETRIA_SERVICE;
    private final ExamenLaboratorioService EXAMENLAB_SERVICE;
    private final ReferenciaService REFERENCIA_SERVICE;

    @Override
    public PageResponse<ConsultaPageResponse> listarConsultasFiltradas(ConsultaFiltro filtros, Pageable pageable) {
        Specification<Consulta> spec = Specification.unrestricted();

        if(filtros.searchTerm() != null){
            spec = spec.and(ConsultaSpecs.containsSearch(filtros.searchTerm()));
        }

        if (filtros.personalView()) {
            UUID personalId = AUTH_HELPER.obtenerUsuarioAutenticado().getPersonalId();

            spec = spec.and(
                    ConsultaSpecs.hasCreatedById(personalId)
            );
        }

        if(filtros.especialidad() != null){
            spec = spec.and(ConsultaSpecs.hasEspecialidad(filtros.especialidad()));
        }


        spec = spec.and(ConsultaSpecs.isActivo(true)); // Siempre (por ahora).

        Page<Consulta> consultaPage = REPOSITORY.findAll(spec, pageable);
        VALIDATION_HELPER.checkPaginationBounds(consultaPage, pageable);

        Page<ConsultaPageResponse> responsePage = consultaPage.map(this::mapPageDTO);
        return new PageResponse<>(responsePage);
    }

    @Override
    public ConsultaDetailResponse obtenerConsultaPorId(UUID id) {
        return mapDetailDTO(obtenerConsultaCheck(id));
    }

    @Override
    public Consulta crearConsultaEntity(ConsultaCreateRequest request) {
        AUTH_HELPER.validarUsuarioActivo();

        Consulta nuevaConsulta = new Consulta();

        AdultoMayor adultoMayor =
                ADULTO_SERVICE.obtenerAdultoCheck(request.adultoId());

        nuevaConsulta.setAdultoMayor(adultoMayor);
        nuevaConsulta.setTipoConsulta(
                request.tipoConsulta() == null
                        ? null
                        : request.tipoConsulta().trim().toUpperCase()
        );
        nuevaConsulta.setTipoConsulta((request.tipoConsulta() == null)
                ? null : request.tipoConsulta().trim().toUpperCase());
        nuevaConsulta.setMotivo((request.motivo() == null)
                ? null : request.motivo().trim());
        nuevaConsulta.setDescripcion((request.descripcion() == null)
                ? "N/A" : request.descripcion().trim());
        nuevaConsulta.setDiagnostico((request.diagnostico() == null)
                ? "N/A" : request.diagnostico().trim());
        nuevaConsulta.setResultadosEvaluaciones((request.resultadosEvaluaciones() == null)
                ? "N/A" : request.resultadosEvaluaciones());
        nuevaConsulta.setRecomendaciones((request.recomendaciones() == null)
                ? "N/A" : request.recomendaciones().trim());
        nuevaConsulta.setNotas(request.notas() == null
                ? "N/A"
                : request.notas().trim());
        nuevaConsulta.setActivo(true);

        nuevaConsulta.setCreatedBy(
                AUTH_HELPER.obtenerUsuarioAutenticado()
        );
        nuevaConsulta.setCreatedAt(
                LocalDateTime.now(Clock.systemUTC())
        );

        return REPOSITORY.save(nuevaConsulta);
    }

    @Override
    public ConsultaDetailResponse crearConsulta(ConsultaCreateRequest request) {
        Consulta consulta = crearConsultaEntity(request);
        if(request.referencia() != null){
            REFERENCIA_SERVICE.crearReferencia(
                    consulta,
                    request.referencia()
            );
        }

        return mapDetailDTO(consulta);
    }

    @Override
    public ConsultaDetailResponse actualizarConsulta(ConsultaUpdateRequest request, UUID id) {
        Consulta consultaActualizar = obtenerConsultaCheck(id);

        verificarEdicionValida(consultaActualizar.getCreatedBy().getPersonalId());

        consultaActualizar.setTipoConsulta((request.tipoConsulta() == null)
                ? null : request.tipoConsulta().trim().toUpperCase());
        consultaActualizar.setMotivo((request.motivo() == null)
                ? null : request.motivo().trim());
        consultaActualizar.setDescripcion((request.descripcion() == null)
                ? "N/A" : request.descripcion().trim());
        consultaActualizar.setDiagnostico((request.diagnostico() == null)
                ? "N/A" : request.diagnostico().trim());
        consultaActualizar.setResultadosEvaluaciones((request.resultadosEvaluaciones() == null)
                ? "N/A" : request.resultadosEvaluaciones());
        consultaActualizar.setRecomendaciones((request.recomendaciones() == null)
                ? "N/A" : request.recomendaciones().trim());
        consultaActualizar.setNotas((request.notas() == null)
                ? "N/A" : request.notas().trim());

        consultaActualizar.setUpdatedBy(AUTH_HELPER.obtenerUsuarioAutenticado());
        consultaActualizar.setUpdatedAt(LocalDateTime.now(Clock.systemUTC()));

        Consulta consultaActualizada = REPOSITORY.save(consultaActualizar);

        return mapDetailDTO(consultaActualizada);
    }

    @Override
    public ConsultaDetailResponse desactivarConsulta(UUID id) {
        Consulta consulta = obtenerConsultaCheck(id);

        verificarEdicionValida(consulta.getCreatedBy().getPersonalId());

        consulta.setActivo(false);

        Consulta consultaDesactivada = REPOSITORY.save(consulta);
        return mapDetailDTO(consultaDesactivada);
    }

    public ConsultaPageResponse mapPageDTO(Consulta consulta){
        AdultoMayor adultoMayor = consulta.getAdultoMayor();
        Personal personal = consulta.getCreatedBy();

        UUID nutricional = null;
        UUID psych = null;

        if(consulta.getConsultaNutricional() != null){
            nutricional = nutricionalDetaiLResponse(consulta.getConsultaNutricional());
        }

        if(consulta.getConsultaPsych() != null){
            psych = psychDetailResponse(consulta.getConsultaPsych());
        }

        return new ConsultaPageResponse(
                consulta.getConsultaId(),
                new AdultoMayorConsultaResponse(
                        adultoMayor.getAdultoId(),
                        adultoMayor.getTipoIdentificacion(),
                        adultoMayor.getIdentificacion(),
                        adultoMayor.getNombreCompleto(),
                        adultoMayor.getFechaNacimiento()
                ),
                consulta.getTipoConsulta(),
                consulta.isActivo() ? "Activo" : "Inactivo",
                new PersonalConsultaResponse(
                        personal.getPersonalId(),
                        personal.getUsuario(),
                        personal.getNombreCompleto(),
                        personal.getEspecialidad().getLabel()
                ),
                consulta.getCreatedAt(),
                consulta.getUpdatedAt(),
                nutricional,
                psych
        );
    }

    private ConsultaDetailResponse mapDetailDTO(Consulta consulta) {
        AdultoMayor adultoMayor = consulta.getAdultoMayor();
        Personal personal = consulta.getCreatedBy();

        ConsultaNutricionalDetailResponse nutricional = null;
        if (consulta.getConsultaNutricional() != null) {
            nutricional = nutricionalMapDetailDTO(consulta.getConsultaNutricional());
        }

        ConsultaPsychResponse psych = null;
        if(consulta.getConsultaPsych() != null){
            psych = psychMapDetailDTO(consulta.getConsultaPsych());
        }

        Personal currentUser = AUTH_HELPER.obtenerUsuarioAutenticado();

        boolean esConsultaPsicologica = personal.getEspecialidad() == Especialidad.PSICOLOGIA;
        boolean puedeVerCamposClinicos = !esConsultaPsicologica
                || currentUser.getEspecialidad() == Especialidad.PSICOLOGIA;

        return new ConsultaDetailResponse(
                consulta.getConsultaId(),
                new AdultoMayorConsultaResponse(
                        adultoMayor.getAdultoId(),
                        adultoMayor.getTipoIdentificacion(),
                        adultoMayor.getIdentificacion(),
                        adultoMayor.getNombreCompleto(),
                        adultoMayor.getFechaNacimiento()
                ),
                puedeVerCamposClinicos ? consulta.getMotivo() : null,
                consulta.getTipoConsulta(),
                puedeVerCamposClinicos ? consulta.getDescripcion() : null,
                consulta.getDiagnostico(),
                puedeVerCamposClinicos ? consulta.getResultadosEvaluaciones() : null,
                consulta.getRecomendaciones(),
                puedeVerCamposClinicos ? consulta.getNotas() : null,
                consulta.isActivo() ? "Activo" : "Inactivo",
                new PersonalConsultaResponse(
                        personal.getPersonalId(),
                        personal.getUsuario(),
                        personal.getNombreCompleto(),
                        personal.getEspecialidad().getLabel()
                ),
                consulta.getCreatedAt(),
                consulta.getUpdatedAt(),
                nutricional,
                psych
        );
    }

    public UUID nutricionalDetaiLResponse(ConsultaNutricional consultaNutricional){
        return consultaNutricional.getConsultaNutricionalId();

    }

    private ConsultaNutricionalDetailResponse nutricionalMapDetailDTO(ConsultaNutricional consultaNutricional){
        return new ConsultaNutricionalDetailResponse(
                consultaNutricional.getConsultaNutricionalId(),
                consultaNutricional.getHistoriaAlimentaria(),
                consultaNutricional.getApetito(),
                consultaNutricional.getMasticacion(),
                consultaNutricional.getDeglucion(),
                consultaNutricional.getNauseas(),
                consultaNutricional.getVomitos(),
                consultaNutricional.getDistension(),
                consultaNutricional.getGases(),
                consultaNutricional.getReflujo(),
                consultaNutricional.getDiarrea(),
                consultaNutricional.getEstrenimiento(),
                consultaNutricional.getFrecuenciaEvacuaciones(),
                consultaNutricional.getConsistenciaBristol(),
                consultaNutricional.getEstadoCognitivo(),
                TAMIZAJE_SERVICE.listarTamizajesPorConsultaNutricional(consultaNutricional),
                EXAMENLAB_SERVICE.listarExamenesPorConsulta(consultaNutricional),
                ANTROPOMETRIA_SERVICE.obtenerAntropometriaPorConsulta(consultaNutricional)
        );
    }

    private ConsultaPsychResponse psychMapDetailDTO(ConsultaPsych consultaPsych){
        return new ConsultaPsychResponse(
                consultaPsych.getConsultaPsychId(),
                TAMIZAJE_SERVICE.listarTamizajesPorConsultaPsych(consultaPsych)
        );
    }

    private UUID psychDetailResponse(ConsultaPsych consultaPsych){
        return consultaPsych.getConsultaPsychId();
    }

    public Consulta obtenerConsultaCheck(UUID id){
        return REPOSITORY.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Consulta indicada no existe."
                ));
    }

    private void verificarEdicionValida(UUID id){
        if(!AUTH_HELPER.obtenerUsuarioAutenticado().getPersonalId()
                .equals(id)){
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Solo el creador de una consulta puede editarla."
            );
        }
    }
}
