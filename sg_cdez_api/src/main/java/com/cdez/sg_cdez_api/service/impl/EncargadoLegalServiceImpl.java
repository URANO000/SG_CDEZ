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

    /**
     * Registra un nuevo encargado legal y establece
     * su relación con un adulto mayor.
     */
    @Override
    public EncargadoLegalResponse registrarEncargado(UUID adultoId, EncargadoLegalRequest request) {

        AdultoMayor adultoMayor = adultoMayorRepository.findById(adultoId)
                .orElseThrow(() -> new RuntimeException("Adulto mayor no encontrado"));

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
    public EncargadoLegalResponse actualizarEncargado(UUID encargadoId, EncargadoLegalUpdateRequest request) {
        EncargadoLegal encargado = obtenerEncargadoCheck(encargadoId);

        Personal personalActual = AUTH_HELPER.obtenerUsuarioAutenticado();

        encargado.setDireccion(request.direccion());
        encargado.setUpdatedAt(LocalDateTime.now());
        encargado.setUpdatedBy(personalActual);

        EncargadoLegal actualizado = encargadoLegalRepository.save(encargado);

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