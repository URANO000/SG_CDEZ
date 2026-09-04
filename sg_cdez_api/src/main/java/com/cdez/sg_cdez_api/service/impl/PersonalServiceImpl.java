package com.cdez.sg_cdez_api.service.impl;

import com.cdez.sg_cdez_api.dto.request.*;
import com.cdez.sg_cdez_api.dto.response.*;
import com.cdez.sg_cdez_api.entity.*;
import com.cdez.sg_cdez_api.entity.reports.*;
import com.cdez.sg_cdez_api.repository.*;
import com.cdez.sg_cdez_api.repository.specifications.PersonalSpecs;
import com.cdez.sg_cdez_api.service.*;
import com.cdez.sg_cdez_api.util.*;
import com.itextpdf.layout.properties.TextAlignment;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.HorizontalAlignment;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.time.*;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PersonalServiceImpl implements PersonalService {
    private final PersonalRepository REPOSITORY;
    private final AuthHelper AUTH_HELPER;
    private final ValidationHelper VALIDATION_HELPER;
    private final RolRepository ROL_REPOSITORY;
    private final TokenService VERIFICATION_SERVICE;
    private final ContactoService CONTACTO_SERVICE;
    private final ReportService REPORT_SERVICE;
    private final DocumentoService DOCUMENTO_SERVICE;
    private final RefreshTokenService REFRESH_TOKEN_SERVICE;
    private final AuditoriaService AUDITORIA_SERVICE;

    private void registrarAuditoria(
            String accion,
            Personal personal,
            String descripcion
    ) {
        AUDITORIA_SERVICE.registrarAccion(
                accion,
                "PERSONAL",
                "Personal",
                personal.getPersonalId().toString(),
                descripcion
        );
    }

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
    public List<PersonalResponse> listarPersonal() {
        return REPOSITORY.findAll().stream().map(this::mapDTO).toList();
    }

    @Override
    public PageResponse<PersonalResponse> listarPersonalFiltrado(PersonalFiltro filtros,@PageableDefault(sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable){
        // Validaciones
//        if(!AUTH_HELPER.isUsuarioAdmin()){
//            throw new RuntimeException("Sólo un usuario administrador puede ver el personal.");
//        }

        AUTH_HELPER.validarUsuarioActivo();

        Specification<Personal> spec = Specification.unrestricted();

        if(filtros.especialidad() != null){
            spec = spec.and(PersonalSpecs.hasEspecialidad(filtros.especialidad()));
        }

        if(filtros.activo() != null){
            spec = spec.and(PersonalSpecs.hasEstado(filtros.activo()));
        }

        if(filtros.searchTerm() != null){
            spec = spec.and(PersonalSpecs.containsSearch(filtros.searchTerm()));
        }

        Page<Personal> personalPage = REPOSITORY.findAll(spec, pageable);

        VALIDATION_HELPER.checkPaginationBounds(personalPage, pageable);
        Page<PersonalResponse> responsePage = personalPage.map(this::mapDTO);
        return new PageResponse<>(responsePage);

    }

    @Override
    public PersonalResponse obtenerPersonalPorId(UUID id) {
        return mapDTO(obtenerPersonalCheck(id));
    }

    @Transactional
    @Override
    public PersonalResponse crearPersonal(PersonalCreateRequest request, List<MultipartFile> documentos) throws IOException {
        // Validaciones
        if(!AUTH_HELPER.isUsuarioAdmin()){
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Sólo un usuario administrador puede crear nuevo personal."
            );
        }
        AUTH_HELPER.validarUsuarioActivo();

        if(REPOSITORY.existsByUsuario(request.usuario())){
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Ya existe un usuario con ese correo."
            );
        }

        Personal personalNuevo = new Personal();

        Rol rol = ROL_REPOSITORY.findById(request.rol()).orElseThrow(() -> new RuntimeException("Rol no encontrado"));
        personalNuevo.setRol(rol);
        personalNuevo.setEspecialidad(request.especialidad());
        personalNuevo.setTipoIdentificacion(request.tipoIdentificacion());
        personalNuevo.setIdentificacion(request.identificacion());
        personalNuevo.setPrimerNombre(request.primerNombre());
        personalNuevo.setSegundoNombre(request.segundoNombre());
        personalNuevo.setPrimerApellido(request.primerApellido());
        personalNuevo.setSegundoApellido(request.segundoApellido());
        personalNuevo.setDireccion(request.direccion());
        personalNuevo.setCarnet(request.carnet());
        personalNuevo.setUsuario(request.usuario());
        personalNuevo.setActivo(true);
        personalNuevo.setEmailVerificado(false);
        personalNuevo.setCreatedAt(LocalDateTime.now(Clock.systemUTC()));
        personalNuevo.setCreatedBy(AUTH_HELPER.obtenerUsuarioAutenticado());

        Personal personalGuardado = REPOSITORY.save(personalNuevo);

        // Crear contactos
        CONTACTO_SERVICE.crearContactoPersonal(request.contactos(), personalGuardado);
        DOCUMENTO_SERVICE.registrarDocumentoPersonal(documentos, personalGuardado);

        // Enviar correo de verificación
        VERIFICATION_SERVICE.verificacionCrearYEnviar(personalGuardado);

        // para la auditoría
        registrarAuditoria(
                "REGISTRAR_PERSONAL",
                personalGuardado,
                "Se registró un nuevo miembro del personal: "
                        + personalGuardado.getNombreCompleto()
                        + "."
        );

        return mapDTO(personalGuardado);
    }

    @Override
    @Transactional
    public PersonalResponse actualizarPersonal(UUID id, PersonalActualizarRequest request, List<MultipartFile> documentosCrear) throws IOException {
        if(!AUTH_HELPER.isUsuarioAdmin()){
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Sólo un usuario administrador puede editar el personal."
            );
        }

        AUTH_HELPER.validarUsuarioActivo();

        Personal personalViejo = obtenerPersonalCheck(id);

        Map<String, Object> cambios = new LinkedHashMap<>();

        agregarCambio(
                cambios,
                "rol",
                personalViejo.getRol().getRolId(),
                request.rol()
        );

        agregarCambio(
                cambios,
                "especialidad",
                personalViejo.getEspecialidad(),
                request.especialidad()
        );

        agregarCambio(
                cambios,
                "tipoIdentificacion",
                personalViejo.getTipoIdentificacion(),
                request.tipoIdentificacion()
        );

        agregarCambio(
                cambios,
                "identificacion",
                personalViejo.getIdentificacion(),
                request.identificacion()
        );

        agregarCambio(
                cambios,
                "primerNombre",
                personalViejo.getPrimerNombre(),
                request.primerNombre()
        );

        agregarCambio(
                cambios,
                "segundoNombre",
                personalViejo.getSegundoNombre(),
                request.segundoNombre()
        );

        agregarCambio(
                cambios,
                "primerApellido",
                personalViejo.getPrimerApellido(),
                request.primerApellido()
        );

        agregarCambio(
                cambios,
                "segundoApellido",
                personalViejo.getSegundoApellido(),
                request.segundoApellido()
        );

        agregarCambio(
                cambios,
                "direccion",
                personalViejo.getDireccion(),
                request.direccion()
        );

        agregarCambio(
                cambios,
                "carnet",
                personalViejo.getCarnet(),
                request.carnet()
        );

        agregarCambio(
                cambios,
                "usuario",
                personalViejo.getUsuario(),
                request.usuario()
        );

        if (
                request.contactosActualizar() != null
                        && !request.contactosActualizar().isEmpty()
        ) {
            agregarCambio(
                    cambios,
                    "contactosActualizados",
                    null,
                    request.contactosActualizar().size()
            );
        }

        if (
                request.contactosCrear() != null
                        && !request.contactosCrear().isEmpty()
        ) {
            agregarCambio(
                    cambios,
                    "contactosCreados",
                    null,
                    request.contactosCrear().size()
            );
        }

        if (
                request.contactosDesactivar() != null
                        && !request.contactosDesactivar().isEmpty()
        ) {
            agregarCambio(
                    cambios,
                    "contactosDesactivados",
                    null,
                    request.contactosDesactivar().size()
            );
        }

        if (
                request.documentosDesactivar() != null
                        && !request.documentosDesactivar().isEmpty()
        ) {
            agregarCambio(
                    cambios,
                    "documentosDesactivados",
                    null,
                    request.documentosDesactivar().size()
            );
        }

        if (documentosCrear != null && !documentosCrear.isEmpty()) {
            agregarCambio(
                    cambios,
                    "documentosAdjuntados",
                    null,
                    documentosCrear.size()
            );
        }

        Rol rol = ROL_REPOSITORY.findById(request.rol()).orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "Rol no encontrado"
        ));
        personalViejo.setRol(rol);
        personalViejo.setEspecialidad(request.especialidad());
        personalViejo.setTipoIdentificacion(request.tipoIdentificacion());
        personalViejo.setIdentificacion(request.identificacion());
        personalViejo.setPrimerNombre(request.primerNombre());
        personalViejo.setSegundoNombre(request.segundoNombre());
        personalViejo.setPrimerApellido(request.primerApellido());
        personalViejo.setSegundoApellido(request.segundoApellido());
        personalViejo.setDireccion(request.direccion());
        personalViejo.setCarnet(request.carnet());
        personalViejo.setUsuario(request.usuario());
        personalViejo.setUpdatedBy(AUTH_HELPER.obtenerUsuarioAutenticado());
        personalViejo.setUpdatedAt(LocalDateTime.now(Clock.systemUTC()));

        Personal personalNuevo = REPOSITORY.save(personalViejo);

        // Actualizar contactos
        if(request.contactosActualizar() != null){
            CONTACTO_SERVICE.actualizarContacto(request.contactosActualizar(), personalNuevo);
        }

        // Desactivar contactos (si aplica)
        if(request.contactosDesactivar() != null){
            CONTACTO_SERVICE.desactivarContactosPersonal(request.contactosDesactivar(), personalNuevo);
        }

        // Crear contactos (si aplica)
        if(request.contactosCrear() != null){
            CONTACTO_SERVICE.crearContactoPersonal(request.contactosCrear(), personalNuevo);
        }
        // Desactivar documentos (si aplica)
        if(request.documentosDesactivar() != null){
            DOCUMENTO_SERVICE.desactivarDocumentosPersonal(request.documentosDesactivar(), personalNuevo);
        }
        // Crear documentos nuevos (si aplica)
        if(documentosCrear != null){
            DOCUMENTO_SERVICE.registrarDocumentoPersonal(documentosCrear, personalNuevo);
        }

        AUDITORIA_SERVICE.registrarAccion(
                "ACTUALIZAR_PERSONAL",
                "PERSONAL",
                "Personal",
                personalNuevo.getPersonalId().toString(),
                cambios.isEmpty()
                        ? "Se procesó una actualización del personal sin cambios."
                        : "Se actualizaron los datos del miembro del personal: "
                        + personalNuevo.getNombreCompleto()
                        + ".",
                cambios.isEmpty() ? null : cambios
        );

        return mapDTO(personalNuevo);
    }

    @Override
    public PersonalResponse activarPersonal(UUID id){
        if(!AUTH_HELPER.isUsuarioAdmin()){
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Sólo un usuario administrador puede activar el personal."
            );
        }

        AUTH_HELPER.validarUsuarioActivo();

        Personal personal = obtenerPersonalCheck(id);
        if(personal.isActivo()){
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Personal ya es activo."
            );
        }
        personal.setActivo(true);
        personal.setUpdatedBy(AUTH_HELPER.obtenerUsuarioAutenticado());
        personal.setUpdatedAt(LocalDateTime.now(Clock.systemUTC()));

        Personal personalActivado = REPOSITORY.save(personal);

        registrarAuditoria(
                "ACTIVAR_PERSONAL",
                personalActivado,
                "Se activó al miembro del personal: "
                        + personalActivado.getNombreCompleto()
                        + "."
        );

        return mapDTO(personalActivado);
    }

    @Transactional
    @Override
    public PersonalResponse desactivarPersonal(UUID id) {
        if (!AUTH_HELPER.isUsuarioAdmin()) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Sólo un usuario administrador puede desactivar el personal."
            );
        }
        AUTH_HELPER.validarUsuarioActivo();
        Personal personal =
                obtenerPersonalCheck(id);
        if (!personal.isActivo()) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Personal ya es inactivo."
            );
        }
        personal.setActivo(false);
        personal.setUpdatedBy(AUTH_HELPER.obtenerUsuarioAutenticado());
        personal.setUpdatedAt(LocalDateTime.now(Clock.systemUTC()));

        Personal personalDesactivado = REPOSITORY.save(personal);

    // Al desactivar la cuenta se invalidan sus sesiones persistentes.
        REFRESH_TOKEN_SERVICE.revocarTodosPorPersonal(
                personalDesactivado.getPersonalId()
        );

        registrarAuditoria(
                "DESACTIVAR_PERSONAL",
                personalDesactivado,
                "Se desactivó al miembro del personal: "
                        + personalDesactivado.getNombreCompleto()
                        + "."
        );

        return mapDTO(personalDesactivado);
    }

    @Override
    public byte[] generarReportePersonalPDF() {
        try{
            if(!AUTH_HELPER.isUsuarioAdmin()){
                throw new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED,
                        "Sólo un usuario administrador puede generar reportes del personal."
                );
            }

            AUTH_HELPER.validarUsuarioActivo();

            List<PersonalResponse> personal = listarPersonal();

            PdfTableReport<PersonalResponse> reporte =
                    PdfTableReport.<PersonalResponse>builder()
                            .titulo("Reporte de Personal")
                            .datos(personal)
                            .columnas(List.of(
                                    new Column<>("Rol", p -> p.rol().nombre(), TextAlignment.LEFT, 1f),
                                    new Column<>("Especialidad", p -> p.especialidad() != null ? p.especialidad().getLabel() : "", TextAlignment.LEFT, 1.5f),
                                    new Column<>("Tipo Identificación", p -> p.tipoIdentificacion() != null ? p.tipoIdentificacion().getLabel() : "", TextAlignment.LEFT, 2f),
                                    new Column<>("Identificación", PersonalResponse::identificacion, TextAlignment.LEFT, 1.5f),
                                    new Column<>( "Nombre Completo",
                                            p -> {
                                                List<String> parts = new ArrayList<>();
                                                if (p.primerNombre() != null && !p.primerNombre().isBlank()) parts.add(p.primerNombre());
                                                if (p.segundoNombre() != null && !p.segundoNombre().isBlank()) parts.add(p.segundoNombre());
                                                if (p.primerApellido() != null && !p.primerApellido().isBlank()) parts.add(p.primerApellido());
                                                if (p.segundoApellido() != null && !p.segundoApellido().isBlank()) parts.add(p.segundoApellido());
                                                return String.join(" ", parts);
                                            },
                                            TextAlignment.LEFT, 2.5f),
                                    new Column<>("Carné", PersonalResponse::carnet, TextAlignment.LEFT, 1f),
                                    new Column<>("Usuario", PersonalResponse::usuario, TextAlignment.LEFT, 2f),
                                    new Column<>(
                                            "Contactos",
                                            p -> p.contactos().isEmpty()
                                                    ? "Sin contactos"
                                                    : p.contactos().stream()
                                                    .map(c -> c.tipoValor() + ": " + c.valor())
                                                    .collect(Collectors.joining("\n")),
                                            TextAlignment.LEFT, 3f
                                    ),
                                    new Column<>("Estado", PersonalResponse::activo, TextAlignment.CENTER, 1f)
                            )).build();

            byte[] archivo =
                    REPORT_SERVICE.generarTablaPDF(reporte);

            registrarAuditoriaReportePersonal(
                    "PDF",
                    personal.size()
            );

            return archivo;
        }catch(IOException ex){
            throw new RuntimeException("Error de fuente.");
        }
    }

    @Override
    public byte[] generarReportePersonalExcel() {
        try {
            if (!AUTH_HELPER.isUsuarioAdmin()) {
                throw new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED,
                        "Sólo un usuario administrador puede generar reportes del personal."
                );
            }

            AUTH_HELPER.validarUsuarioActivo();

            List<PersonalResponse> personal = listarPersonal();

            ExcelTableReport<PersonalResponse> reporte =
                    ExcelTableReport.<PersonalResponse>builder()
                            .titulo("Reporte de Personal")
                            .datos(personal)
                            .columnas(List.of(
                                    new ExcelColumn<>(
                                            "Rol",
                                            p -> p.rol().nombre(),
                                            18,
                                            org.apache.poi.ss.usermodel.HorizontalAlignment.LEFT
                                    ),

                                    new ExcelColumn<>(
                                            "Especialidad",
                                            p -> p.especialidad() != null
                                                    ? p.especialidad().getLabel()
                                                    : "",
                                            25,
                                            org.apache.poi.ss.usermodel.HorizontalAlignment.LEFT
                                    ),

                                    new ExcelColumn<>(
                                            "Tipo Identificación",
                                            p -> p.tipoIdentificacion() != null
                                                    ? p.tipoIdentificacion().getLabel()
                                                    : "",
                                            25,
                                            org.apache.poi.ss.usermodel.HorizontalAlignment.LEFT
                                    ),

                                    new ExcelColumn<>(
                                            "Identificación",
                                            PersonalResponse::identificacion,
                                            20,
                                            org.apache.poi.ss.usermodel.HorizontalAlignment.LEFT
                                    ),

                                    new ExcelColumn<>(
                                            "Nombre Completo",
                                            p -> {
                                                List<String> parts = new ArrayList<>();

                                                if (p.primerNombre() != null && !p.primerNombre().isBlank()) {
                                                    parts.add(p.primerNombre());
                                                }

                                                if (p.segundoNombre() != null && !p.segundoNombre().isBlank()) {
                                                    parts.add(p.segundoNombre());
                                                }

                                                if (p.primerApellido() != null && !p.primerApellido().isBlank()) {
                                                    parts.add(p.primerApellido());
                                                }

                                                if (p.segundoApellido() != null && !p.segundoApellido().isBlank()) {
                                                    parts.add(p.segundoApellido());
                                                }

                                                return String.join(" ", parts);
                                            },
                                            35,
                                            org.apache.poi.ss.usermodel.HorizontalAlignment.LEFT
                                    ),
                                    new ExcelColumn<>(
                                            "Dirección",
                                            PersonalResponse::direccion,
                                            35,
                                            org.apache.poi.ss.usermodel.HorizontalAlignment.LEFT
                                    ),

                                    new ExcelColumn<>(
                                            "Carné",
                                            PersonalResponse::carnet,
                                            15,
                                            org.apache.poi.ss.usermodel.HorizontalAlignment.LEFT
                                    ),

                                    new ExcelColumn<>(
                                            "Usuario",
                                            PersonalResponse::usuario,
                                            35,
                                            org.apache.poi.ss.usermodel.HorizontalAlignment.LEFT
                                    ),
                                    new ExcelColumn<>(
                                            "Contactos",
                                            p -> p.contactos() == null || p.contactos().isEmpty()
                                                    ? "Sin contactos"
                                                    : p.contactos().stream()
                                                    .map(c -> c.tipoValor() + ": " + c.valor())
                                                    .collect(Collectors.joining("\n")),
                                            40,
                                            org.apache.poi.ss.usermodel.HorizontalAlignment.LEFT
                                    ),

                                    new ExcelColumn<>(
                                            "Estado",
                                            PersonalResponse::activo,
                                            15,
                                            org.apache.poi.ss.usermodel.HorizontalAlignment.CENTER
                                    ),
                                    new ExcelColumn<>(
                                            "Creado Por",
                                            PersonalResponse::createdBy,
                                            35,
                                            org.apache.poi.ss.usermodel.HorizontalAlignment.LEFT

                                    ),
                                    new ExcelColumn<>(
                                            "Fecha Creación",
                                            r -> r.createdAt()
                                                    .atZone(ZoneOffset.UTC)
                                                    .withZoneSameInstant(ZoneId.of("America/Costa_Rica"))
                                                    .format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm")),
                                            30,
                                            HorizontalAlignment.LEFT
                                    ),
                                    new ExcelColumn<>(
                                            "Última Actualización Por",
                                            PersonalResponse::updatedBy,
                                            35,
                                            org.apache.poi.ss.usermodel.HorizontalAlignment.LEFT
                                    ),
                                    new ExcelColumn<>(
                                            "Última Actualización En",
                                            r -> r.updatedAt() != null ?
                                            r.updatedAt().atZone(ZoneOffset.UTC)
                                                    .withZoneSameInstant(ZoneId.of("America/Costa_Rica"))
                                                    .format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm"))
                                            : "",
                                            30,
                                            org.apache.poi.ss.usermodel.HorizontalAlignment.LEFT
                                    )
                            ))
                            .showTimestamp(true)
                            .zebraRows(true)
                            .autoFilter(true)
                            .freezeHeader(true)
                            .build();

            byte[] archivo =
                    REPORT_SERVICE.generarTablaExcel(reporte);

            registrarAuditoriaReportePersonal(
                    "EXCEL",
                    personal.size()
            );

            return archivo;

        } catch (IOException ex) {
            throw new RuntimeException(
                    "Error al generar el reporte de personal en Excel.",
                    ex
            );
        }
    }

    public String obtenerNombrePorId(UUID id){
        Personal personal = obtenerPersonalCheck(id);
        return personal.getNombreCompleto();
    }

    //Mapper
    private PersonalResponse mapDTO(Personal personal){
        Rol rol = personal.getRol();
        return new PersonalResponse(
                personal.getPersonalId(),
                new RolResponse(
                        rol.getRolId(),
                        rol.getNombre()
                ),
                personal.getEspecialidad(),
                personal.getTipoIdentificacion(),
                personal.getIdentificacion(),
                personal.getPrimerNombre(),
                personal.getSegundoNombre(),
                personal.getPrimerApellido(),
                personal.getSegundoApellido(),
                personal.getDireccion(),
                personal.getCarnet(),
                personal.getUsuario(),
                personal.isActivo() ? "Activo" : "Inactivo",
                personal.getCreatedBy() != null ? personal.getCreatedBy().getUsuario() : null,
                personal.getCreatedAt(),
                personal.getUpdatedBy() != null ? personal.getUpdatedBy().getUsuario() : null ,
                personal.getUpdatedAt(),

                CONTACTO_SERVICE.listarContactoPorPersonal(personal),
                DOCUMENTO_SERVICE.listarDocumentosPorPersonal(personal)
        );
    }

    //Personal existe?
    public Personal obtenerPersonalCheck(UUID id){
        return REPOSITORY.findById(id)
                .orElseThrow(()-> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Miembro del personal indicado no existe."
                ));
    }
    private void registrarAuditoriaReportePersonal(
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

        AUDITORIA_SERVICE.registrarAccion(
                "GENERAR_REPORTE",
                "PERSONAL",
                "REPORTE",
                "PERSONAL",
                "Se generó un reporte del personal.",
                cambios
        );
    }
}
