package com.cdez.sg_cdez_api.service.impl;

import com.cdez.sg_cdez_api.dto.request.PerfilActualizarRequest;
import com.cdez.sg_cdez_api.dto.response.PerfilResponse;
import com.cdez.sg_cdez_api.entity.Personal;
import com.cdez.sg_cdez_api.repository.PersonalRepository;
import com.cdez.sg_cdez_api.service.AuditoriaService;
import com.cdez.sg_cdez_api.service.PerfilService;
import com.cdez.sg_cdez_api.util.AuthHelper;
import org.springframework.stereotype.Service;
import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import com.cdez.sg_cdez_api.service.ContactoService;
import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Objects;

@Service
public class PerfilServiceImpl implements PerfilService {

    private final AuthHelper authHelper;
    private final PersonalRepository personalRepository;
    private final AuditoriaService auditoriaService;
    private final ContactoService contactoService;

    public PerfilServiceImpl(
            AuthHelper authHelper,
            PersonalRepository personalRepository,
            AuditoriaService auditoriaService,
            ContactoService contactoService
    ) {
        this.authHelper = authHelper;
        this.personalRepository = personalRepository;
        this.auditoriaService = auditoriaService;
        this.contactoService = contactoService;
    }

    @Override
    public PerfilResponse obtenerPerfil() {
        Personal personal = authHelper.obtenerUsuarioAutenticado();

        return convertirAPerfilResponse(personal);
    }

    private PerfilResponse convertirAPerfilResponse(Personal personal) {
        return new PerfilResponse(
                personal.getPersonalId(),
                personal.getNombreCompleto(),
                personal.getRol().getNombre(),
                personal.getEspecialidad().getLabel(),
                personal.getTipoIdentificacion().getLabel(),
                personal.getIdentificacion(),
                personal.getDireccion(),
                personal.getCarnet(),
                personal.getUsuario(),
                personal.isActivo() ? "Activo" : "Inactivo",
                contactoService.listarContactoPorPersonal(personal)
        );
    }

    @Override
    @Transactional
    public PerfilResponse actualizarPerfil(PerfilActualizarRequest request) {
        if (request == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Debe proporcionar la información del perfil."
            );
        }

        if (
                request.direccion() == null ||
                        request.direccion().isBlank()
        ) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "La dirección es obligatoria."
            );
        }

        String nuevaDireccion = request.direccion().trim();

        if (nuevaDireccion.length() > 200) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "La dirección no puede superar los 200 caracteres."
            );
        }

        Personal personal = authHelper.obtenerUsuarioAutenticado();
        Map<String, Object> cambios = new LinkedHashMap<>();

        if (!Objects.equals(personal.getDireccion(), nuevaDireccion)) {
            cambios.put(
                    "direccion",
                    Map.of(
                            "anterior",
                            personal.getDireccion() == null
                                    ? ""
                                    : personal.getDireccion(),
                            "nuevo",
                            nuevaDireccion
                    )
            );

            personal.setDireccion(nuevaDireccion);
        }

        if (
                request.contactosActualizar() != null &&
                        !request.contactosActualizar().isEmpty()
        ) {
            contactoService.actualizarContacto(
                    request.contactosActualizar(),
                    personal
            );

            cambios.put(
                    "contactosActualizados",
                    request.contactosActualizar().size()
            );
        }

        if (
                request.contactosDesactivar() != null &&
                        !request.contactosDesactivar().isEmpty()
        ) {
            contactoService.desactivarContactosPersonal(
                    request.contactosDesactivar(),
                    personal
            );

            cambios.put(
                    "contactosDesactivados",
                    request.contactosDesactivar().size()
            );
        }

        if (
                request.contactosCrear() != null &&
                        !request.contactosCrear().isEmpty()
        ) {
            contactoService.crearContactoPersonal(
                    request.contactosCrear(),
                    personal
            );

            cambios.put(
                    "contactosCreados",
                    request.contactosCrear().size()
            );
        }

        if (!cambios.isEmpty()) {
            personal.setUpdatedAt(LocalDateTime.now());
            personal.setUpdatedBy(personal);
            personalRepository.save(personal);

            auditoriaService.registrarAccion(
                    "ACTUALIZAR_PERFIL",
                    "PERFIL",
                    "Personal",
                    personal.getPersonalId().toString(),
                    "El usuario actualizó la información de su perfil.",
                    cambios
            );
        }

        return convertirAPerfilResponse(personal);
    }
}