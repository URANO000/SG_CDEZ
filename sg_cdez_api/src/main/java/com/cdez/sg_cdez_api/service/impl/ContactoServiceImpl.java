package com.cdez.sg_cdez_api.service.impl;

import com.cdez.sg_cdez_api.dto.request.*;
import com.cdez.sg_cdez_api.dto.response.ContactoResponse;
import com.cdez.sg_cdez_api.entity.*;
import com.cdez.sg_cdez_api.repository.ContactoRepository;
import com.cdez.sg_cdez_api.service.*;
import com.cdez.sg_cdez_api.util.AuthHelper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.Clock;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;


@Service
@RequiredArgsConstructor
public class ContactoServiceImpl implements ContactoService {
    private final ContactoRepository CONTACTO_REPOSITORY;
    private final AuthHelper AUTH_HELPER;

    @Override
    public List<ContactoResponse> listarContactoPorPersonal(Personal personal) {
        return CONTACTO_REPOSITORY.findByPersonalAndActivoTrue(personal).stream().map(this::mapDTO).toList();
    }

    @Override
    public List<ContactoResponse> listarContactoPorEncargado(EncargadoLegal encargadoLegal) {
        return CONTACTO_REPOSITORY.findByEncargado(encargadoLegal).stream().map(this::mapDTO).toList();
    }

    @Override
    public List<ContactoResponse> crearContactoPersonal(List<ContactoCreateRequest> requests, Personal personal) {
        List<ContactoResponse> contactosNuevos = new ArrayList<>();
        for(var contacto : requests){
            Contacto contactoNuevo = new Contacto();

            contactoNuevo.setPersonal(personal);
            contactoNuevo.setValor(contacto.valor());
            contactoNuevo.setTipoValor(contacto.tipoValor());
            contactoNuevo.setActivo(true);
            contactoNuevo.setCreatedBy(AUTH_HELPER.obtenerUsuarioAutenticado());
            contactoNuevo.setCreatedAt(LocalDateTime.now(Clock.systemUTC()));

            CONTACTO_REPOSITORY.save(contactoNuevo);
            contactosNuevos.add(mapDTO(contactoNuevo));

        }
        return  contactosNuevos;
    }

    @Override
    public List<ContactoResponse> crearContactoEncargado(List<ContactoCreateRequest> requests, EncargadoLegal encargadoLegal) {
        List<ContactoResponse> contactosNuevos = new ArrayList<>();
        for(var contacto : requests){
            Contacto contactoNuevo = new Contacto();

            contactoNuevo.setEncargado(encargadoLegal);
            contactoNuevo.setValor(contacto.valor());
            contactoNuevo.setTipoValor(contacto.tipoValor());
            contactoNuevo.setActivo(true);
            contactoNuevo.setCreatedBy(AUTH_HELPER.obtenerUsuarioAutenticado());
            contactoNuevo.setCreatedAt(LocalDateTime.now(Clock.systemUTC()));

            CONTACTO_REPOSITORY.save(contactoNuevo);
            contactosNuevos.add(mapDTO(contactoNuevo));
        }

        return contactosNuevos;
    }

    @Override
    public List<ContactoResponse> actualizarContacto(List<ContactoUpdateRequest> requests, Personal personal) {
        List<ContactoResponse> contactosActualizados = new ArrayList<>();
        for(var request : requests){
            Contacto contactoAnterior = CONTACTO_REPOSITORY.findByContactoIdAndPersonalPersonalId(request.id(), personal.getPersonalId())
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.NOT_FOUND,
                            "El contacto indicado no fue encontrado"
                    ));

            contactoAnterior.setTipoValor(request.tipoValor());
            contactoAnterior.setValor(request.valor());
            contactoAnterior.setUpdatedBy(AUTH_HELPER.obtenerUsuarioAutenticado());
            contactoAnterior.setUpdatedAt(LocalDateTime.now(Clock.systemUTC()));

            Contacto contactoNuevo = CONTACTO_REPOSITORY.save(contactoAnterior);

            contactosActualizados.add(mapDTO(contactoNuevo));
        }

        return contactosActualizados;
    }

    @Override
    public void desactivarContactosPersonal(List<Integer> requests, Personal personal){
        for (var request:requests){
            Contacto contactoADesactivar = CONTACTO_REPOSITORY.findByContactoIdAndPersonalPersonalId(request, personal.getPersonalId())
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.NOT_FOUND,
                            "El contacto indicado no fue encontrado"
                    ));
            contactoADesactivar.setActivo(false);
            CONTACTO_REPOSITORY.save(contactoADesactivar);
        }
    }

    private ContactoResponse mapDTO(Contacto contacto){
        return new ContactoResponse(
                contacto.getContactoId(),
                contacto.getPersonal() != null ? contacto.getPersonal().getNombreCompleto() : null,
                contacto.getEncargado() != null ? contacto.getEncargado().getNombreCompleto() : null,
                contacto.getValor(),
                contacto.getTipoValor(),
                contacto.isActivo() ? "Activo" : "Inactivo",
                contacto.getCreatedBy().getNombreCompleto(),
                contacto.getCreatedAt(),
                contacto.getUpdatedBy() != null ? contacto.getUpdatedBy().getNombreCompleto() : null,
                contacto.getUpdatedAt()
        );
    }
}
