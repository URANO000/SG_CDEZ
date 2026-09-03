package com.cdez.sg_cdez_api.service.impl;

import com.cdez.sg_cdez_api.dto.request.EncargadoLegalRequest;
import com.cdez.sg_cdez_api.dto.request.EncargadoLegalUpdateRequest;
import com.cdez.sg_cdez_api.dto.response.EncargadoLegalResponse;
import com.cdez.sg_cdez_api.entity.AdultoMayor;
import com.cdez.sg_cdez_api.entity.EncargadoLegal;
import com.cdez.sg_cdez_api.entity.Personal;
import com.cdez.sg_cdez_api.repository.AdultoMayorRepository;
import com.cdez.sg_cdez_api.repository.EncargadoLegalRepository;
import com.cdez.sg_cdez_api.service.ContactoService;
import com.cdez.sg_cdez_api.service.EncargadoLegalService;
import com.cdez.sg_cdez_api.util.AuthHelper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.cdez.sg_cdez_api.service.AuditoriaService;
import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.LinkedHashMap;
import java.util.Map;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class EncargadoLegalServiceImpl implements EncargadoLegalService {

    private final EncargadoLegalRepository encargadoLegalRepository;
    private final AdultoMayorRepository adultoMayorRepository;
    private final ContactoService CONTACTO_SERVICE;
    private final AuthHelper AUTH_HELPER;
    private final AuditoriaService auditoriaService;

    /**
     * Registra un nuevo encargado legal y establece
     * su relación con un adulto mayor.
     */

    @Override
    @Transactional
    public EncargadoLegalResponse registrarEncargado(UUID adultoId, EncargadoLegalRequest request) {

        AdultoMayor adultoMayor = adultoMayorRepository.findById(adultoId)
                .orElseThrow(() -> new RuntimeException("Adulto mayor no encontrado"));

        long cantidadEncargadosActivos =
                encargadoLegalRepository
                        .countByAdultosAdultoIdAndActivoTrue(adultoId);

        if (cantidadEncargadosActivos >= 2) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "El adulto mayor ya tiene el máximo de dos encargados legales activos."
            );
        }

        Personal personalActual = AUTH_HELPER.obtenerUsuarioAutenticado();

        EncargadoLegal encargado = new EncargadoLegal();
        encargado.setTipoIdentificacion(request.tipoIdentificacion());
        encargado.setIdentificacion(request.identificacion());
        encargado.setPrimerNombre(request.primerNombre());
        encargado.setSegundoNombre(request.segundoNombre());
        encargado.setPrimerApellido(request.primerApellido());
        encargado.setSegundoApellido(request.segundoApellido());
        encargado.setDireccion(request.direccion());
        encargado.setActivo(true);
        encargado.setCreatedAt(LocalDateTime.now());
        encargado.setCreatedBy(personalActual);

        EncargadoLegal guardado = encargadoLegalRepository.save(encargado);

        adultoMayor.getEncargados().add(guardado);
        adultoMayorRepository.save(adultoMayor);

        //Crear contacto si aplica

        CONTACTO_SERVICE.crearContactoEncargado(request.contactos(), guardado);

        return mapToResponse(guardado);
    }

    @Override
    public List<EncargadoLegalResponse> listarEncargadosPorAdulto(UUID adultoId) {
        return encargadoLegalRepository.findByAdultosAdultoIdAndActivoTrue(adultoId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public EncargadoLegalResponse obtenerEncargadoPorId(UUID encargadoId) {
        EncargadoLegal encargado = obtenerEncargadoCheck(encargadoId);

        return mapToResponse(encargado);
    }

    @Override
    @Transactional
    public EncargadoLegalResponse actualizarEncargado(
            UUID encargadoId,
            EncargadoLegalUpdateRequest request
    ) {
        EncargadoLegal encargado =
                obtenerEncargadoCheck(encargadoId);

        if (!encargado.isActivo()) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "No se puede editar un encargado legal inactivo."
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

        String nuevaDireccion =
                request.direccion().trim();

        if (nuevaDireccion.length() > 200) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "La dirección no puede superar los 200 caracteres."
            );
        }

        Personal personalActual =
                AUTH_HELPER.obtenerUsuarioAutenticado();

        Map<String, Object> cambios =
                new LinkedHashMap<>();

        if (!java.util.Objects.equals(
                encargado.getDireccion(),
                nuevaDireccion
        )) {
            Map<String, Object> detalleDireccion =
                    new LinkedHashMap<>();

            detalleDireccion.put(
                    "anterior",
                    encargado.getDireccion()
            );

            detalleDireccion.put(
                    "nuevo",
                    nuevaDireccion
            );

            cambios.put(
                    "direccion",
                    detalleDireccion
            );
        }

        if (
                request.contactosActualizar() != null &&
                        !request.contactosActualizar().isEmpty()
        ) {
            cambios.put(
                    "contactosActualizados",
                    request.contactosActualizar().size()
            );
        }

        if (
                request.contactosCrear() != null &&
                        !request.contactosCrear().isEmpty()
        ) {
            cambios.put(
                    "contactosCreados",
                    request.contactosCrear().size()
            );
        }

        if (
                request.contactosDesactivar() != null &&
                        !request.contactosDesactivar().isEmpty()
        ) {
            cambios.put(
                    "contactosDesactivados",
                    request.contactosDesactivar().size()
            );
        }

        encargado.setDireccion(nuevaDireccion);
        encargado.setUpdatedAt(LocalDateTime.now());
        encargado.setUpdatedBy(personalActual);

        EncargadoLegal actualizado =
                encargadoLegalRepository.save(encargado);

        if (request.contactosActualizar() != null) {
            CONTACTO_SERVICE.actualizarContactoEncargado(
                    request.contactosActualizar(),
                    actualizado
            );
        }

        if (request.contactosDesactivar() != null) {
            CONTACTO_SERVICE.desactivarContactosEncargado(
                    request.contactosDesactivar(),
                    actualizado
            );
        }

        if (request.contactosCrear() != null) {
            CONTACTO_SERVICE.crearContactoEncargado(
                    request.contactosCrear(),
                    actualizado
            );
        }

        if (!cambios.isEmpty()) {
            auditoriaService.registrarAccion(
                    "ACTUALIZAR_ENCARGADO_LEGAL",
                    "ENCARGADO_LEGAL",
                    "EncargadoLegal",
                    actualizado.getEncargadoId().toString(),
                    "Se actualizó la información de un encargado legal.",
                    cambios
            );
        }

        return mapToResponse(actualizado);
    }

    @Override
    public EncargadoLegalResponse desactivarEncargado(
            UUID encargadoId
    ) {
        EncargadoLegal encargado =
                obtenerEncargadoCheck(encargadoId);

        if (!encargado.isActivo()) {
            return mapToResponse(encargado);
        }

        Personal personalActual =
                AUTH_HELPER.obtenerUsuarioAutenticado();

        encargado.setActivo(false);
        encargado.setUpdatedAt(LocalDateTime.now());
        encargado.setUpdatedBy(personalActual);

        EncargadoLegal actualizado =
                encargadoLegalRepository.save(encargado);

        auditoriaService.registrarAccion(
                "DESACTIVAR_ENCARGADO_LEGAL",
                "ENCARGADO_LEGAL",
                "EncargadoLegal",
                actualizado.getEncargadoId().toString(),
                "Se desactivó un encargado legal."
        );

        return mapToResponse(actualizado);
    }

    private EncargadoLegalResponse mapToResponse(EncargadoLegal encargado) {
        return new EncargadoLegalResponse(
                encargado.getEncargadoId(),
                encargado.getTipoIdentificacion(),
                encargado.getIdentificacion(),
                encargado.getPrimerNombre(),
                encargado.getSegundoNombre(),
                encargado.getPrimerApellido(),
                encargado.getSegundoApellido(),
                encargado.getDireccion(),
                encargado.isActivo(),

                CONTACTO_SERVICE.listarContactoPorEncargado(encargado)
        );
    }

    public EncargadoLegal obtenerEncargadoCheck(UUID encargadoId){
        return encargadoLegalRepository.findById(encargadoId)
                .orElseThrow(() -> new RuntimeException("Encargado legal no encontrado"));
    }

}