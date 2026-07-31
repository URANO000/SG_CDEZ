package com.cdez.sg_cdez_api.service.impl;

import com.cdez.sg_cdez_api.entity.Personal;
import com.cdez.sg_cdez_api.entity.reports.Column;
import com.cdez.sg_cdez_api.entity.reports.PdfTableReport;
import com.cdez.sg_cdez_api.dto.request.AdultoMayorRequest;
import com.cdez.sg_cdez_api.dto.response.AdultoMayorResponse;
import com.cdez.sg_cdez_api.dto.request.AdultoMayorUpdateRequest;
import com.cdez.sg_cdez_api.entity.AdultoMayor;
import com.cdez.sg_cdez_api.repository.AdultoMayorRepository;
import com.cdez.sg_cdez_api.service.AdultoMayorService;
import com.cdez.sg_cdez_api.service.ReportService;
import com.cdez.sg_cdez_api.util.AuthHelper;
import com.cdez.sg_cdez_api.util.MiscHelper;
import com.itextpdf.layout.properties.TextAlignment;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.cdez.sg_cdez_api.dto.request.AdultoMayorDesactivarRequest;
import com.cdez.sg_cdez_api.dto.request.AdultoMayorFallecimientoRequest;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.transaction.annotation.Transactional;
import com.cdez.sg_cdez_api.service.AuditoriaService;

import java.io.IOException;
import java.util.UUID;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Objects;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdultoMayorServiceImpl implements AdultoMayorService {

    private final AdultoMayorRepository adultoMayorRepository;
    private final ReportService REPORT_SERVICE;
    private final MiscHelper MISC_HELPER;
    private final AuthHelper AUTH_HELPER;
    private final AuditoriaService auditoriaService;


    // Registra en el historial una acción realizada sobre un adulto mayor.
    private void registrarAuditoria(
            String accion,
            AdultoMayor adultoMayor,
            String descripcion
    ) {
        auditoriaService.registrarAccion(
                accion,
                "ADULTO_MAYOR",
                "AdultoMayor",
                adultoMayor.getAdultoId().toString(),
                descripcion
        );
    }

    // Agrega al historial únicamente los campos cuyo valor realmente cambió.
    private void agregarCambio(
            Map<String, Object> cambios,
            String campo,
            Object valorAnterior,
            Object valorNuevo
    ) {
        if (Objects.equals(valorAnterior, valorNuevo)) {
            return;
        }

        Map<String, Object> detalle = new LinkedHashMap<>();
        detalle.put("anterior", valorAnterior);
        detalle.put("nuevo", valorNuevo);

        cambios.put(campo, detalle);
    }

    @Override
    public List<AdultoMayorResponse> listarAdultosMayoresSinFiltro() {
        return adultoMayorRepository.findAll().stream().map(this::mapToResponse).toList();
    }

    @Override
    public List<AdultoMayorResponse> listarAdultosMayores() {
        return adultoMayorRepository.findByActivoTrue()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }
    @Override
    public List<AdultoMayorResponse> listarAdultosMayoresInactivos() {
        return adultoMayorRepository.findByActivoFalseAndFechaFallecimientoIsNull()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }
    @Override
    public List<AdultoMayorResponse> listarAdultosMayoresFallecidos() {
        return adultoMayorRepository.findByFechaFallecimientoIsNotNull()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    private AdultoMayorResponse mapToResponse(AdultoMayor adultoMayor) {
        return new AdultoMayorResponse(
                adultoMayor.getAdultoId(),
                adultoMayor.getTipoIdentificacion(),
                adultoMayor.getIdentificacion(),
                adultoMayor.getNombreCompleto(),
                adultoMayor.getNacionalidad(),
                adultoMayor.getFechaNacimiento(),
                adultoMayor.getSexo(),
                adultoMayor.getDireccion(),
                adultoMayor.getEscolaridad(),
                adultoMayor.getGrupoFamiliar(),
                adultoMayor.isPension(),
                adultoMayor.getFuncionalidadFisica(),
                adultoMayor.isAyudaBiomecanica(),
                adultoMayor.getFechaIngreso(),
                MISC_HELPER.activoConversion(adultoMayor.isActivo())
        );
    }
    @Override
    public List<AdultoMayorResponse> buscarAdultosMayores(String texto) {

        if (texto == null || texto.isBlank()) {
            return listarAdultosMayores();
        }

        return adultoMayorRepository
                .findByPrimerNombreContainingIgnoreCaseOrSegundoNombreContainingIgnoreCaseOrPrimerApellidoContainingIgnoreCaseOrSegundoApellidoContainingIgnoreCaseOrIdentificacionContainingIgnoreCase(
                        texto,
                        texto,
                        texto,
                        texto,
                        texto
                )
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional
    public AdultoMayorResponse crearAdultoMayor(AdultoMayorRequest request) {

        if (adultoMayorRepository.existsByIdentificacion(request.identificacion())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Ya existe un adulto mayor con esa identificación"
            );
        }
        AdultoMayor adultoMayor = new AdultoMayor();

        adultoMayor.setTipoIdentificacion(request.tipoIdentificacion());
        adultoMayor.setIdentificacion(request.identificacion());
        adultoMayor.setPrimerNombre(request.primerNombre());
        adultoMayor.setSegundoNombre(request.segundoNombre());
        adultoMayor.setPrimerApellido(request.primerApellido());
        adultoMayor.setSegundoApellido(request.segundoApellido());
        adultoMayor.setNacionalidad(request.nacionalidad());
        adultoMayor.setFechaNacimiento(request.fechaNacimiento());
        adultoMayor.setSexo(request.sexo());
        adultoMayor.setDireccion(request.direccion());
        adultoMayor.setEscolaridad(request.escolaridad());
        adultoMayor.setGrupoFamiliar(request.grupoFamiliar());
        adultoMayor.setPension(request.pension());
        adultoMayor.setFuncionalidadFisica(request.funcionalidadFisica());
        adultoMayor.setAyudaBiomecanica(request.ayudaBiomecanica());
        adultoMayor.setFechaIngreso(request.fechaIngreso());

        adultoMayor.setActivo(true);
        adultoMayor.setCreatedAt(java.time.LocalDateTime.now());

        Personal usuarioCreador = AUTH_HELPER.obtenerUsuarioAutenticado();
        adultoMayor.setCreatedBy(usuarioCreador);

        AdultoMayor adultoGuardado = adultoMayorRepository.save(adultoMayor);

        registrarAuditoria(
                "REGISTRAR_ADULTO_MAYOR",
                adultoGuardado,
                "Se registró un adulto mayor."
        );

        return mapToResponse(adultoGuardado);
    }
    @Override
    public AdultoMayorResponse obtenerAdultoMayorPorId(UUID id) {
        AdultoMayor adultoMayor = adultoMayorRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Adulto mayor no encontrado"
                ));

        return mapToResponse(adultoMayor);
    }
    @Override
    @Transactional
    public AdultoMayorResponse actualizarAdultoMayor(
            UUID id,
            AdultoMayorUpdateRequest request
    ) {
        AdultoMayor adultoMayor = adultoMayorRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Adulto mayor no encontrado"
                ));

        Map<String, Object> cambios = new LinkedHashMap<>();

        agregarCambio(
                cambios,
                "direccion",
                adultoMayor.getDireccion(),
                request.direccion()
        );

        agregarCambio(
                cambios,
                "escolaridad",
                adultoMayor.getEscolaridad(),
                request.escolaridad()
        );

        agregarCambio(
                cambios,
                "grupoFamiliar",
                adultoMayor.getGrupoFamiliar(),
                request.grupoFamiliar()
        );

        agregarCambio(
                cambios,
                "funcionalidadFisica",
                adultoMayor.getFuncionalidadFisica(),
                request.funcionalidadFisica()
        );

        agregarCambio(
                cambios,
                "ayudaBiomecanica",
                adultoMayor.isAyudaBiomecanica(),
                request.ayudaBiomecanica()
        );

        adultoMayor.setDireccion(request.direccion());
        adultoMayor.setEscolaridad(request.escolaridad());
        adultoMayor.setGrupoFamiliar(request.grupoFamiliar());
        adultoMayor.setFuncionalidadFisica(request.funcionalidadFisica());
        adultoMayor.setAyudaBiomecanica(request.ayudaBiomecanica());

        adultoMayor.setUpdatedAt(LocalDateTime.now());

        Personal usuarioActualizador =
                AUTH_HELPER.obtenerUsuarioAutenticado();

        adultoMayor.setUpdatedBy(usuarioActualizador);

        AdultoMayor adultoActualizado =
                adultoMayorRepository.save(adultoMayor);

        auditoriaService.registrarAccion(
                "ACTUALIZAR_ADULTO_MAYOR",
                "ADULTO_MAYOR",
                "AdultoMayor",
                adultoActualizado.getAdultoId().toString(),
                cambios.isEmpty()
                        ? "Se procesó una actualización sin cambios."
                        : "Se actualizaron los datos de un adulto mayor.",
                cambios.isEmpty() ? null : cambios
        );

        return mapToResponse(adultoActualizado);
    }

    @Transactional
    @Override
    public AdultoMayorResponse desactivarAdultoMayor(UUID id, AdultoMayorDesactivarRequest request) {

        AdultoMayor adultoMayor = adultoMayorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Adulto mayor no encontrado"));
        if (adultoMayor.getFechaFallecimiento() != null) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "No se puede desactivar un adulto mayor fallecido"
            );
        }
        adultoMayor.setActivo(false);
        adultoMayor.setFechaRetiro(request.fechaRetiro());
        adultoMayor.setMotivoRetiro(request.motivoRetiro());
        adultoMayor.setUpdatedAt(java.time.LocalDateTime.now());

        Personal usuarioActualizador = AUTH_HELPER.obtenerUsuarioAutenticado();
        adultoMayor.setUpdatedBy(usuarioActualizador);

        AdultoMayor actualizado = adultoMayorRepository.save(adultoMayor);

        registrarAuditoria(
                "DESACTIVAR_ADULTO_MAYOR",
                actualizado,
                "Se desactivó un adulto mayor."
        );
        return mapToResponse(actualizado);
    }
    @Override
    public AdultoMayorResponse activarAdultoMayor(UUID id) {

        AdultoMayor adultoMayor = adultoMayorRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Adulto mayor no encontrado"
                ));

        if (adultoMayor.getFechaFallecimiento() != null) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "No se puede activar un adulto mayor fallecido"
            );
        }

        adultoMayor.setActivo(true);
        adultoMayor.setFechaRetiro(null);
        adultoMayor.setMotivoRetiro(null);
        adultoMayor.setUpdatedAt(java.time.LocalDateTime.now());

        Personal usuarioActualizador = AUTH_HELPER.obtenerUsuarioAutenticado();
        adultoMayor.setUpdatedBy(usuarioActualizador);

        AdultoMayor actualizado = adultoMayorRepository.save(adultoMayor);

        registrarAuditoria(
                "ACTIVAR_ADULTO_MAYOR",
                actualizado,
                "Se activó un adulto mayor."
        );

        return mapToResponse(actualizado);
    }
    @Override
    public AdultoMayorResponse registrarFallecimiento(UUID id, AdultoMayorFallecimientoRequest request) {

        AdultoMayor adultoMayor = adultoMayorRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Adulto mayor no encontrado"
                ));

        adultoMayor.setActivo(false);
        adultoMayor.setFechaFallecimiento(request.fechaFallecimiento());
        adultoMayor.setMotivoRetiro(request.motivoRetiro());
        adultoMayor.setUpdatedAt(java.time.LocalDateTime.now());

        Personal usuarioActualizador = AUTH_HELPER.obtenerUsuarioAutenticado();
        adultoMayor.setUpdatedBy(usuarioActualizador);

        AdultoMayor actualizado = adultoMayorRepository.save(adultoMayor);

        registrarAuditoria(
                "REGISTRAR_FALLECIMIENTO",
                actualizado,
                "Se registró el fallecimiento de un adulto mayor."
        );

        return mapToResponse(actualizado);
    }

    @Override
    public byte[] generarReporteAdultoPDF() {
        try{
            List<AdultoMayorResponse> adulosMayores = listarAdultosMayoresSinFiltro();

            PdfTableReport<AdultoMayorResponse> reporte =
                    PdfTableReport.<AdultoMayorResponse>builder()
                            .titulo("Reporte de Adultos Mayores")
                            .datos(adulosMayores)
                            .columnas(List.of(
                                    new Column<>("Tipo Identificación", AdultoMayorResponse::tipoIdentificacion, TextAlignment.LEFT, 2f),
                                    new Column<>("Identificación", AdultoMayorResponse::identificacion, TextAlignment.LEFT, 1.5f),
                                    new Column<>("Nombre Completo", AdultoMayorResponse::nombreCompleto, TextAlignment.LEFT, 2.5f),
                                    new Column<>("Nacionalidad", AdultoMayorResponse::nacionalidad, TextAlignment.LEFT, 1.5f),
                                    new Column<>("Dirección", AdultoMayorResponse::direccion, TextAlignment.LEFT, 2.5f),
                                    new Column<>("Sexo", AdultoMayorResponse::sexo),
                                    new Column<>("Estado", AdultoMayorResponse::activo)
                            )).build();
            return REPORT_SERVICE.generarTablaPDF(reporte);

        }catch (IOException ex){
            throw new RuntimeException("Error de fuente.");
        }
    }


}