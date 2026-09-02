package com.cdez.sg_cdez_api.service.impl;

import com.cdez.sg_cdez_api.entity.Personal;
import com.cdez.sg_cdez_api.entity.reports.Column;
import com.cdez.sg_cdez_api.entity.reports.ExcelColumn;
import com.cdez.sg_cdez_api.entity.reports.ExcelTableReport;
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
import com.cdez.sg_cdez_api.repository.specifications.AdultoMayorSpecs;

import java.io.IOException;
import java.time.format.DateTimeFormatter;
import java.util.*;

import java.time.LocalDateTime;
import java.math.BigDecimal;

import com.cdez.sg_cdez_api.dto.request.AdultoMayorFiltro;
import com.cdez.sg_cdez_api.dto.response.PageResponse;
import com.cdez.sg_cdez_api.util.ValidationHelper;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

@Service
@RequiredArgsConstructor
public class AdultoMayorServiceImpl implements AdultoMayorService {

    private final AdultoMayorRepository adultoMayorRepository;
    private final ReportService REPORT_SERVICE;
    private final MiscHelper MISC_HELPER;
    private final AuthHelper AUTH_HELPER;
    private final AuditoriaService auditoriaService;
    private final ValidationHelper VALIDATION_HELPER;


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
        return adultoMayorRepository
                .findAll(
                        AdultoMayorSpecs.hasEstado(
                                "ACTIVO"
                        )
                )
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public List<AdultoMayorResponse>
    listarAdultosMayoresInactivos() {
        return adultoMayorRepository
                .findAll(
                        AdultoMayorSpecs.hasEstado(
                                "INACTIVO"
                        )
                )
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public List<AdultoMayorResponse>
    listarAdultosMayoresFallecidos() {
        return adultoMayorRepository
                .findAll(
                        AdultoMayorSpecs.hasEstado(
                                "FALLECIDO"
                        )
                )
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

                adultoMayor.getEstadoCivil(),
                adultoMayor.getGradoDependencia(),
                adultoMayor.getCuotaMensual(),

                adultoMayor.isPension(),
                adultoMayor.getTipoPension(),
                adultoMayor.getMontoPension(),

                adultoMayor.getFuncionalidadFisica(),
                adultoMayor.isAyudaBiomecanica(),
                adultoMayor.getFechaIngreso(),
                MISC_HELPER.activoConversion(adultoMayor.isActivo())
        );
    }

    @Override
    public List<AdultoMayorResponse> buscarAdultosMayores(
            String texto
    ) {
        if (
                texto == null ||
                        texto.isBlank()
        ) {
            return listarAdultosMayores();
        }

        return adultoMayorRepository
                .findAll(
                        AdultoMayorSpecs.containsSearch(
                                texto
                        )
                )
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public PageResponse<AdultoMayorResponse>
    listarAdultosMayoresFiltrados(
            AdultoMayorFiltro filtros,
            Pageable pageable
    ) {
        Specification<AdultoMayor> spec =
                Specification.unrestricted();

        if (
                filtros != null &&
                        filtros.estado() != null &&
                        !filtros.estado().isBlank()
        ) {
            String estado =
                    filtros.estado()
                            .trim()
                            .toUpperCase();

            Set<String> estadosPermitidos =
                    Set.of(
                            "ACTIVO",
                            "INACTIVO",
                            "FALLECIDO"
                    );

            if (
                    !estadosPermitidos.contains(
                            estado
                    )
            ) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "El estado indicado no es válido."
                );
            }

            spec = spec.and(
                    AdultoMayorSpecs.hasEstado(
                            estado
                    )
            );
        }

        if (
                filtros != null &&
                        filtros.searchTerm() != null &&
                        !filtros.searchTerm().isBlank()
        ) {
            spec = spec.and(
                    AdultoMayorSpecs.containsSearch(
                            filtros.searchTerm()
                    )
            );
        }

        Page<AdultoMayor> adultoMayorPage =
                adultoMayorRepository.findAll(
                        spec,
                        pageable
                );

        VALIDATION_HELPER.checkPaginationBounds(
                adultoMayorPage,
                pageable
        );

        Page<AdultoMayorResponse> responsePage =
                adultoMayorPage.map(
                        this::mapToResponse
                );

        return new PageResponse<>(
                responsePage
        );
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
        adultoMayor.setEstadoCivil(request.estadoCivil());
        adultoMayor.setGradoDependencia(request.gradoDependencia());

        if (
                request.cuotaMensual() == null ||
                        request.cuotaMensual().signum() < 0
        ) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "La cuota mensual no puede ser negativa."
            );
        }

        adultoMayor.setCuotaMensual(request.cuotaMensual());

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
        adultoMayor.setPension(
                request.pension()
        );

        if (request.pension()) {
            if (
                    request.tipoPension() == null ||
                            request.tipoPension().isBlank()
            ) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Debe indicar el tipo de pensión."
                );
            }

            if (
                    request.montoPension() == null ||
                            request.montoPension().signum() <= 0
            ) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "El monto de la pensión debe ser mayor que cero."
                );
            }

            adultoMayor.setTipoPension(
                    request.tipoPension().trim()
            );

            adultoMayor.setMontoPension(
                    request.montoPension()
            );
        } else {
            adultoMayor.setTipoPension(null);
            adultoMayor.setMontoPension(null);
        }
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
        if (!AUTH_HELPER.isUsuarioAdmin()) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Sólo un usuario administrador puede editar un adulto mayor."
            );
        }

        AUTH_HELPER.validarUsuarioActivo();

        AdultoMayor adultoMayor = adultoMayorRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Adulto mayor no encontrado."
                ));

        if (
                !adultoMayor.isActivo() ||
                        adultoMayor.getFechaFallecimiento() != null
        ) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "No se puede editar un adulto mayor inactivo o fallecido."
            );
        }

        if (
                request.cuotaMensual() == null ||
                        request.cuotaMensual().signum() < 0
        ) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "La cuota mensual no puede ser negativa."
            );
        }

        String nuevoTipoPension = null;
        BigDecimal nuevoMontoPension = null;

        if (request.pension()) {
            if (
                    request.tipoPension() == null ||
                            request.tipoPension().isBlank()
            ) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Debe indicar el tipo de pensión."
                );
            }

            if (
                    request.montoPension() == null ||
                            request.montoPension().signum() <= 0
            ) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "El monto de la pensión debe ser mayor que cero."
                );
            }

            nuevoTipoPension = request.tipoPension().trim();
            nuevoMontoPension = request.montoPension();
        }

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
                "estadoCivil",
                adultoMayor.getEstadoCivil(),
                request.estadoCivil()
        );

        agregarCambio(
                cambios,
                "gradoDependencia",
                adultoMayor.getGradoDependencia(),
                request.gradoDependencia()
        );

        agregarCambio(
                cambios,
                "cuotaMensual",
                adultoMayor.getCuotaMensual(),
                request.cuotaMensual()
        );

        agregarCambio(
                cambios,
                "pension",
                adultoMayor.isPension(),
                request.pension()
        );

        agregarCambio(
                cambios,
                "tipoPension",
                adultoMayor.getTipoPension(),
                nuevoTipoPension
        );

        agregarCambio(
                cambios,
                "montoPension",
                adultoMayor.getMontoPension(),
                nuevoMontoPension
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
        adultoMayor.setEstadoCivil(request.estadoCivil());
        adultoMayor.setGradoDependencia(request.gradoDependencia());
        adultoMayor.setCuotaMensual(request.cuotaMensual());

        adultoMayor.setPension(request.pension());
        adultoMayor.setTipoPension(nuevoTipoPension);
        adultoMayor.setMontoPension(nuevoMontoPension);

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
            if (!AUTH_HELPER.isUsuarioAdmin()) {
                throw new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED,
                        "Sólo un usuario administrador puede generar reportes de adultos mayores."
                );
            }

            AUTH_HELPER.validarUsuarioActivo();
            List<AdultoMayorResponse> adultosMayores = listarAdultosMayoresSinFiltro();

            PdfTableReport<AdultoMayorResponse> reporte =
                    PdfTableReport.<AdultoMayorResponse>builder()
                            .titulo("Reporte de Adultos Mayores")
                            .datos(adultosMayores)
                            .columnas(List.of(
                                    new Column<>("Tipo Identificación", AdultoMayorResponse::tipoIdentificacion, TextAlignment.LEFT, 2f),
                                    new Column<>("Identificación", AdultoMayorResponse::identificacion, TextAlignment.LEFT, 1.5f),
                                    new Column<>("Nombre Completo", AdultoMayorResponse::nombreCompleto, TextAlignment.LEFT, 2.5f),
                                    new Column<>("Nacionalidad", AdultoMayorResponse::nacionalidad, TextAlignment.LEFT, 1.5f),
                                    new Column<>("Dirección", AdultoMayorResponse::direccion, TextAlignment.LEFT, 2.5f),
                                    new Column<>("Estado civil", adulto -> adulto.estadoCivil() == null
                                                    ? "No registrado"
                                                    : adulto.estadoCivil(),
                                            TextAlignment.LEFT,
                                            1.3f
                                    ),
                                    new Column<>("Dependencia", adulto -> adulto.gradoDependencia() == null
                                                    ? "No registrado"
                                                    : adulto.gradoDependencia(),
                                            TextAlignment.LEFT,
                                            1.3f
                                    ),
                                    new Column<>(
                                            "Cuota mensual", adulto -> adulto.cuotaMensual() == null
                                                    ? "₡0.00"
                                                    : "₡" + adulto.cuotaMensual().toPlainString(),
                                            TextAlignment.RIGHT,
                                            1.3f
                                    ),
                                    new Column<>("Pensión", adulto -> adulto.pension() ? "Sí" : "No",
                                            TextAlignment.CENTER,
                                            0.8f
                                    ),
                                    new Column<>("Tipo de pensión", adulto -> adulto.pension() &&
                                                    adulto.tipoPension() != null
                                                    ? adulto.tipoPension()
                                                    : "No aplica",
                                            TextAlignment.LEFT,
                                            1.5f
                                    ),

                                    new Column<>("Monto de pensión", adulto -> adulto.pension() &&
                                                    adulto.montoPension() != null
                                                    ? "₡" + adulto.montoPension().toPlainString()
                                                    : "No aplica",
                                            TextAlignment.RIGHT,
                                            1.4f
                                    ),
                                    new Column<>("Sexo", AdultoMayorResponse::sexo),
                                    new Column<>("Estado", AdultoMayorResponse::activo)
                            )).build();
            byte[] archivo =
                    REPORT_SERVICE.generarTablaPDF(reporte);

            registrarAuditoriaReporte(
                    "PDF",
                    adultosMayores.size()
            );

            return archivo;

        }catch (IOException ex){
            throw new RuntimeException("Error de fuente.");
        }
    }

    public byte[] generarReporteAdultoExcel() {
        try {
            if (!AUTH_HELPER.isUsuarioAdmin()) {
                throw new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED,
                        "Sólo un usuario administrador puede generar reportes del personal."
                );
            }

            AUTH_HELPER.validarUsuarioActivo();
            List<AdultoMayorResponse> adultos = listarAdultosMayores();

            ExcelTableReport<AdultoMayorResponse> reporte =
                    ExcelTableReport.<AdultoMayorResponse>builder()
                            .titulo("Reporte de Adultos Mayores")
                            .datos(adultos)
                            .columnas(List.of(
                                    new ExcelColumn<>(
                                            "Tipo Identificación",
                                            AdultoMayorResponse::tipoIdentificacion,
                                            25,
                                            org.apache.poi.ss.usermodel.HorizontalAlignment.LEFT
                                    ),
                                    new ExcelColumn<>(
                                            "Identificación",
                                            AdultoMayorResponse::identificacion,
                                            20,
                                            org.apache.poi.ss.usermodel.HorizontalAlignment.LEFT
                                    ),
                                    new ExcelColumn<>(
                                            "Nombre Completo",
                                            AdultoMayorResponse::nombreCompleto,
                                            35,
                                            org.apache.poi.ss.usermodel.HorizontalAlignment.LEFT
                                    ),
                                    new ExcelColumn<>(
                                            "Nacionalidad",
                                            AdultoMayorResponse::nacionalidad,
                                            20,
                                            org.apache.poi.ss.usermodel.HorizontalAlignment.LEFT
                                    ),
                                    new ExcelColumn<>(
                                            "Fecha Nacimiento",
                                            r -> r.fechaNacimiento()
                                                    .format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm")),
                                            30,
                                            org.apache.poi.ss.usermodel.HorizontalAlignment.LEFT
                                    ),
                                    new ExcelColumn<>(
                                            "Sexo",
                                            AdultoMayorResponse::sexo,
                                            6,
                                            org.apache.poi.ss.usermodel.HorizontalAlignment.LEFT
                                    ),
                                    new ExcelColumn<>(
                                            "Dirección",
                                            AdultoMayorResponse::direccion,
                                            35,
                                            org.apache.poi.ss.usermodel.HorizontalAlignment.LEFT
                                    ),
                                    new ExcelColumn<>(
                                            "Escolaridad",
                                            AdultoMayorResponse::escolaridad,
                                            35,
                                            org.apache.poi.ss.usermodel.HorizontalAlignment.LEFT
                                    ),
                                    new ExcelColumn<>(
                                            "Grupo Familiar",
                                            AdultoMayorResponse::grupoFamiliar,
                                            35,
                                            org.apache.poi.ss.usermodel.HorizontalAlignment.LEFT
                                    ),
                                    new ExcelColumn<>(
                                            "Estado civil",
                                            AdultoMayorResponse::estadoCivil,
                                            20,
                                            org.apache.poi.ss.usermodel.HorizontalAlignment.LEFT
                                    ),

                                    new ExcelColumn<>(
                                            "Grado de dependencia",
                                            AdultoMayorResponse::gradoDependencia,
                                            25,
                                            org.apache.poi.ss.usermodel.HorizontalAlignment.LEFT
                                    ),

                                    new ExcelColumn<>(
                                            "Cuota mensual",
                                            AdultoMayorResponse::cuotaMensual,
                                            18,
                                            org.apache.poi.ss.usermodel.HorizontalAlignment.RIGHT
                                    ),
                                    new ExcelColumn<>(
                                            "Pensión",
                                            a -> a.pension() ? "Sí" : "No",
                                            15,
                                            org.apache.poi.ss.usermodel.HorizontalAlignment.CENTER
                                    ),
                                    new ExcelColumn<>(
                                            "Tipo de pensión",
                                            adulto -> adulto.pension()
                                                    ? adulto.tipoPension()
                                                    : "No aplica",
                                            25,
                                            org.apache.poi.ss.usermodel.HorizontalAlignment.LEFT
                                    ),

                                    new ExcelColumn<>(
                                            "Monto de pensión",
                                            adulto -> adulto.pension()
                                                    ? adulto.montoPension()
                                                    : null,
                                            20,
                                            org.apache.poi.ss.usermodel.HorizontalAlignment.RIGHT
                                    ),
                                    new ExcelColumn<>(
                                            "Funcionalidad Física",
                                            AdultoMayorResponse::funcionalidadFisica,
                                            20,
                                            org.apache.poi.ss.usermodel.HorizontalAlignment.LEFT
                                    ),
                                    new ExcelColumn<>(
                                            "Ayuda Biomecánica",
                                            b -> b.ayudaBiomecanica() ? "Sí" : "No",
                                            10,
                                            org.apache.poi.ss.usermodel.HorizontalAlignment.LEFT
                                    ),
                                    new ExcelColumn<>(
                                            "Fecha de Ingreso",
                                            r -> r.fechaIngreso()
                                                    .format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm")),
                                            30,
                                            org.apache.poi.ss.usermodel.HorizontalAlignment.LEFT
                                    ),
                                    new ExcelColumn<>(
                                            "Motivo Retiro",
                                            AdultoMayorResponse::activo,
                                            15,
                                            org.apache.poi.ss.usermodel.HorizontalAlignment.CENTER
                                    )

                    )).showTimestamp(true)
                        .zebraRows(true)
                        .autoFilter(true)
                        .freezeHeader(true)
                        .build();
            byte[] archivo =
                    REPORT_SERVICE.generarTablaExcel(reporte);

            registrarAuditoriaReporte(
                    "EXCEL",
                    adultos.size()
            );

            return archivo;
        } catch (IOException ex) {
            throw new RuntimeException(
                    "Error al generar el reporte de personal en Excel.",
                    ex
            );
        }
    }

    public AdultoMayor obtenerAdultoCheck(UUID id){
        return adultoMayorRepository.findById(id)
                .orElseThrow(()-> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Adulto indicado no encontrado"
                ));
    }

    private void registrarAuditoriaReporte(
            String formato,
            int cantidadRegistros
    ) {
        Map<String, Object> cambios =
                new LinkedHashMap<>();

        cambios.put("formato", formato);
        cambios.put(
                "cantidadRegistros",
                cantidadRegistros
        );

        auditoriaService.registrarAccion(
                "GENERAR_REPORTE",
                "ADULTO_MAYOR",
                "REPORTE",
                "ADULTOS_MAYORES",
                "Se generó un reporte de adultos mayores.",
                cambios
        );
    }
}