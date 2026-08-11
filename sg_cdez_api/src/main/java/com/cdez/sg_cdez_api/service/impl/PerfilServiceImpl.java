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

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

@Service
public class PerfilServiceImpl implements PerfilService {

    private final AuthHelper authHelper;
    private final PersonalRepository personalRepository;
    private final AuditoriaService auditoriaService;

    public PerfilServiceImpl(
            AuthHelper authHelper,
            PersonalRepository personalRepository,
            AuditoriaService auditoriaService
    ) {
        this.authHelper = authHelper;
        this.personalRepository = personalRepository;
        this.auditoriaService = auditoriaService;
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
                personal.getEspecialidad(),
                personal.getTipoIdentificacion(),
                personal.getIdentificacion(),
                personal.getDireccion(),
                personal.getCarnet(),
                personal.getUsuario(),
                personal.isActivo() ? "Activo" : "Inactivo"
        );
    }

    @Override
    @Transactional
    public PerfilResponse actualizarPerfil(PerfilActualizarRequest request) {
        if (request == null
                || request.direccion() == null
                || request.direccion().isBlank()) {
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
        String direccionAnterior = personal.getDireccion();

        if (nuevaDireccion.equals(direccionAnterior)) {
            return convertirAPerfilResponse(personal);
        }

        personal.setDireccion(nuevaDireccion);
        personal.setUpdatedBy(personal);
        personal.setUpdatedAt(LocalDateTime.now());

        Personal personalActualizado = personalRepository.save(personal);

        Map<String, Object> detalleDireccion = new LinkedHashMap<>();
        detalleDireccion.put("anterior", direccionAnterior);
        detalleDireccion.put("nuevo", nuevaDireccion);

        Map<String, Object> cambios = new LinkedHashMap<>();
        cambios.put("direccion", detalleDireccion);

        auditoriaService.registrarAccion(
                "ACTUALIZAR_PERFIL",
                "PERFIL",
                "Personal",
                personalActualizado.getPersonalId().toString(),
                "El usuario actualizó la dirección de su perfil.",
                cambios
        );

        return convertirAPerfilResponse(personalActualizado);
    }
}