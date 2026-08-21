package com.cdez.sg_cdez_api.service.impl;

import com.cdez.sg_cdez_api.dto.request.*;
import com.cdez.sg_cdez_api.dto.response.*;
import com.cdez.sg_cdez_api.entity.*;
import com.cdez.sg_cdez_api.repository.ConsultaRepository;
import com.cdez.sg_cdez_api.repository.specifications.ConsultaSpecs;
import com.cdez.sg_cdez_api.service.*;
import com.cdez.sg_cdez_api.util.*;
import jakarta.transaction.Transactional;
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

    @Override
    public PageResponse<ConsultaResponse> listarConsultasFiltradas(ConsultaFiltro filtros, Pageable pageable) {
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

        Page<ConsultaResponse> responsePage = consultaPage.map(this::mapDTO);
        return new PageResponse<>(responsePage);
    }

    @Override
    public ConsultaResponse obtenerConsultaPorId(UUID id) {
        return mapDTO(obtenerConsultaCheck(id));
    }

    @Override
    @Transactional
    public ConsultaResponse crearConsulta(ConsultaCreateRequest request) {
        AUTH_HELPER.validarUsuarioActivo();

        Consulta nuevaConsulta = new Consulta();
        AdultoMayor adultoMayor = ADULTO_SERVICE.obtenerAdultoCheck(request.adultoId());

        nuevaConsulta.setAdultoMayor(adultoMayor);
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
        nuevaConsulta.setNotas(request.notas().trim());
        nuevaConsulta.setActivo(true);

        nuevaConsulta.setCreatedBy(AUTH_HELPER.obtenerUsuarioAutenticado());
        nuevaConsulta.setCreatedAt(LocalDateTime.now(Clock.systemUTC()));

        Consulta consulta = REPOSITORY.save(nuevaConsulta);

        return mapDTO(consulta);
    }

    @Override
    public ConsultaResponse actualizarConsulta(ConsultaUpdateRequest request, UUID id) {
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

        return mapDTO(consultaActualizada);
    }

    @Override
    public ConsultaResponse desactivarConsulta(UUID id) {
        Consulta consulta = obtenerConsultaCheck(id);

        verificarEdicionValida(consulta.getCreatedBy().getPersonalId());

        consulta.setActivo(false);

        Consulta consultaDesactivada = REPOSITORY.save(consulta);
        return mapDTO(consultaDesactivada);
    }

    public ConsultaResponse mapDTO(Consulta consulta){
        AdultoMayor adultoMayor = consulta.getAdultoMayor();
        Personal personal = consulta.getCreatedBy();
        return new ConsultaResponse(
                consulta.getConsultaId(),
                new AdultoMayorConsultaResponse(
                        adultoMayor.getAdultoId(),
                        adultoMayor.getTipoIdentificacion(),
                        adultoMayor.getIdentificacion(),
                        adultoMayor.getNombreCompleto(),
                        adultoMayor.getFechaNacimiento()
                ),
                consulta.getMotivo(),
                consulta.getTipoConsulta(),
                consulta.getDescripcion(),
                consulta.getDiagnostico(),
                consulta.getRecomendaciones(),
                consulta.getNotas(),
                consulta.isActivo() ? "Activo" : "Inactivo",
                new PersonalConsultaResponse(
                        personal.getPersonalId(),
                        personal.getUsuario(),
                        personal.getNombreCompleto(),
                        personal.getEspecialidad()
                ),
                consulta.getCreatedAt(),
                consulta.getUpdatedAt()
        );
    }

    public Consulta obtenerConsultaCheck(UUID id){
        return REPOSITORY.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Consulta indicada no existe."
                ));
    }

    public void verificarEdicionValida(UUID id){
        if(!AUTH_HELPER.obtenerUsuarioAutenticado().getPersonalId()
                .equals(id)){
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Solo el creador de una consulta puede editarla."
            );
        }
    }
}
