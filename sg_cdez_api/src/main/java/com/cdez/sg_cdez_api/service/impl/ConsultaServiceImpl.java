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
import java.util.*;


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
    private final AuditoriaService AUDITORIA_SERVICE;

    private void registrarAuditoria(
            String accion,
            Consulta consulta,
            String descripcion
    ) {
        AUDITORIA_SERVICE.registrarAccion(
                accion,
                "CONSULTA",
                "Consulta",
                consulta.getConsultaId().toString(),
                descripcion
        );
    }

    private void agregarCambio(
            Map<String, Object> cambios,
            String campo,
            Object anterior,
            Object nuevo
    ) {
        if (Objects.equals(anterior, nuevo)) {
            return;
        }

        Map<String, Object> detalle = new LinkedHashMap<>();
        detalle.put("anterior", anterior);
        detalle.put("nuevo", nuevo);

        cambios.put(campo, detalle);
    }

    private void agregarCambioClinico(
            Map<String, Object> cambios,
            String campo,
            Object anterior,
            Object nuevo
    ) {
        if (Objects.equals(anterior, nuevo)) {
            return;
        }

        Map<String, Object> detalle = new LinkedHashMap<>();
        detalle.put("anterior", "Valor clínico protegido");
        detalle.put("nuevo", "Valor clínico modificado");

        cambios.put(campo, detalle);
    }

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

        registrarAuditoria(
                "REGISTRAR_CONSULTA",
                consulta,
                "Se registró una consulta para el adulto mayor: "
                        + consulta.getAdultoMayor().getNombreCompleto()
                        + "."
        );

        return mapDetailDTO(consulta);
    }

    @Override
    public ConsultaDetailResponse actualizarConsulta(
            ConsultaUpdateRequest request,
            UUID id
    ) {
        Consulta consultaActualizar = obtenerConsultaCheck(id);

        verificarEdicionValida(
                consultaActualizar.getCreatedBy().getPersonalId()
        );

        String tipoConsultaNuevo =
                request.tipoConsulta() == null
                        ? null
                        : request.tipoConsulta()
                        .trim()
                        .toUpperCase();

        String motivoNuevo =
                request.motivo() == null
                        ? null
                        : request.motivo().trim();

        String descripcionNueva =
                request.descripcion() == null
                        ? "N/A"
                        : request.descripcion().trim();

        String diagnosticoNuevo =
                request.diagnostico() == null
                        ? "N/A"
                        : request.diagnostico().trim();

        String resultadosNuevos =
                request.resultadosEvaluaciones() == null
                        ? "N/A"
                        : request.resultadosEvaluaciones();

        String recomendacionesNuevas =
                request.recomendaciones() == null
                        ? "N/A"
                        : request.recomendaciones().trim();

        String notasNuevas =
                request.notas() == null
                        ? "N/A"
                        : request.notas().trim();

        boolean esConsultaNutricional =
                consultaActualizar.getConsultaNutricional() != null;

        Map<String, Object> cambios = new LinkedHashMap<>();

        agregarCambio(
                cambios,
                "tipoConsulta",
                consultaActualizar.getTipoConsulta(),
                tipoConsultaNuevo
        );

        agregarCambioClinico(
                cambios,
                "motivo",
                consultaActualizar.getMotivo(),
                motivoNuevo
        );

        agregarCambioClinico(
                cambios,
                "descripcion",
                consultaActualizar.getDescripcion(),
                descripcionNueva
        );

        agregarCambioClinico(
                cambios,
                "diagnostico",
                consultaActualizar.getDiagnostico(),
                diagnosticoNuevo
        );

        agregarCambioClinico(
                cambios,
                "resultadosEvaluaciones",
                consultaActualizar.getResultadosEvaluaciones(),
                resultadosNuevos
        );

        agregarCambioClinico(
                cambios,
                "recomendaciones",
                consultaActualizar.getRecomendaciones(),
                recomendacionesNuevas
        );

        agregarCambioClinico(
                cambios,
                "notas",
                consultaActualizar.getNotas(),
                notasNuevas
        );

        consultaActualizar.setTipoConsulta(tipoConsultaNuevo);
        consultaActualizar.setMotivo(motivoNuevo);
        consultaActualizar.setDescripcion(descripcionNueva);
        consultaActualizar.setDiagnostico(diagnosticoNuevo);
        consultaActualizar.setResultadosEvaluaciones(resultadosNuevos);
        consultaActualizar.setRecomendaciones(recomendacionesNuevas);
        consultaActualizar.setNotas(notasNuevas);

        consultaActualizar.setUpdatedBy(
                AUTH_HELPER.obtenerUsuarioAutenticado()
        );

        consultaActualizar.setUpdatedAt(
                LocalDateTime.now(Clock.systemUTC())
        );

        Consulta consultaActualizada =
                REPOSITORY.save(consultaActualizar);

        AUDITORIA_SERVICE.registrarAccion(
                esConsultaNutricional
                        ? "ACTUALIZAR_CONSULTA_NUTRICIONAL"
                        : "ACTUALIZAR_CONSULTA",
                "CONSULTA",
                "Consulta",
                consultaActualizada.getConsultaId().toString(),
                cambios.isEmpty()
                        ? esConsultaNutricional
                        ? "Se procesó la actualización de una consulta nutricional."
                        : "Se procesó una actualización de consulta sin cambios."
                        : esConsultaNutricional
                        ? "Se actualizó una consulta nutricional del adulto mayor: "
                        + consultaActualizada
                        .getAdultoMayor()
                        .getNombreCompleto()
                        + "."
                        : "Se actualizó una consulta del adulto mayor: "
                        + consultaActualizada
                        .getAdultoMayor()
                        .getNombreCompleto()
                        + ".",
                cambios.isEmpty() ? null : cambios
        );

        return mapDetailDTO(consultaActualizada);
    }

    @Override
    public ConsultaDetailResponse desactivarConsulta(UUID id) {
        Consulta consulta = obtenerConsultaCheck(id);

        verificarEdicionValida(
                consulta.getCreatedBy().getPersonalId()
        );

        consulta.setActivo(false);
        consulta.setUpdatedBy(
                AUTH_HELPER.obtenerUsuarioAutenticado()
        );
        consulta.setUpdatedAt(
                LocalDateTime.now(Clock.systemUTC())
        );

        Consulta consultaDesactivada = REPOSITORY.save(consulta);

        boolean esConsultaNutricional =
                consulta.getConsultaNutricional() != null;

        registrarAuditoria(
                esConsultaNutricional
                        ? "DESACTIVAR_CONSULTA_NUTRICIONAL"
                        : "DESACTIVAR_CONSULTA",
                consultaDesactivada,
                esConsultaNutricional
                        ? "Se desactivó una consulta nutricional del adulto mayor: "
                        + consultaDesactivada
                        .getAdultoMayor()
                        .getNombreCompleto()
                        + "."
                        : "Se desactivó una consulta del adulto mayor: "
                        + consultaDesactivada
                        .getAdultoMayor()
                        .getNombreCompleto()
                        + "."
        );

        return mapDetailDTO(consultaDesactivada);
    }

    public ConsultaPageResponse mapPageDTO(Consulta consulta){
        AdultoMayor adultoMayor = consulta.getAdultoMayor();
        Personal personal = consulta.getCreatedBy();

        ConsultaNutricionalPageResponse nutricional = null;

        if(consulta.getConsultaNutricional() != null){
            nutricional = nutricionalMapDTO(consulta.getConsultaNutricional());
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
                nutricional
        );
    }

    private ConsultaDetailResponse mapDetailDTO(Consulta consulta) {
        AdultoMayor adultoMayor = consulta.getAdultoMayor();
        Personal personal = consulta.getCreatedBy();

        ConsultaNutricionalDetailResponse nutricional = null;
        if (consulta.getConsultaNutricional() != null) {
            nutricional = nutricionalMapDetailDTO(consulta.getConsultaNutricional());
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
                nutricional
        );
    }

    public ConsultaNutricionalPageResponse nutricionalMapDTO(ConsultaNutricional consultaNutricional){
        return new ConsultaNutricionalPageResponse(
                consultaNutricional.getConsultaNutricionalId()
        );
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
                TAMIZAJE_SERVICE.listarTamizajesPorConsulta(consultaNutricional),
                EXAMENLAB_SERVICE.listarExamenesPorConsulta(consultaNutricional),
                ANTROPOMETRIA_SERVICE.obtenerAntropometriaPorConsulta(consultaNutricional)
        );
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
