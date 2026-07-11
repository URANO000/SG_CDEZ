package com.cdez.sg_cdez_api.service.impl;

import com.cdez.sg_cdez_api.dto.request.*;
import com.cdez.sg_cdez_api.dto.response.ContactoResponse;
import com.cdez.sg_cdez_api.entity.*;
import com.cdez.sg_cdez_api.repository.ContactoRepository;
import com.cdez.sg_cdez_api.service.ContactoService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ContactoServiceImpl implements ContactoService {
    private final ContactoRepository CONTACTO_REPOSITORY;

    @Override
    public List<ContactoResponse> listarContactoPorPersonal(Personal personal) {
        return CONTACTO_REPOSITORY.findByPersonal(personal).stream().map(this::mapDTO).toList();
    }

    @Override
    public List<ContactoResponse> listarContactoPorEncargado(EncargadoLegal encargado) {
        return CONTACTO_REPOSITORY.findByEncargado(encargado).stream().map(this::mapDTO).toList();
    }

    @Override
    public void crearContactoPersonal(List<ContactoCreateRequest> requests, Personal personal) {
        for(var contacto : requests){
            Contacto contactoNuevo = new Contacto();

            contactoNuevo.setPersonal(personal);
            contactoNuevo.setValor(contacto.valor());
            contactoNuevo.setTipoValor(contacto.tipoValor());

            CONTACTO_REPOSITORY.save(contactoNuevo);

        }
    }

    @Override
    public void crearContactoEncargado(List<ContactoCreateRequest> requests, EncargadoLegal encargadoLegal) {
        for(var contacto : requests){
            Contacto contactoNuevo = new Contacto();

            contactoNuevo.setEncargado(encargadoLegal);
            contactoNuevo.setValor(contacto.valor());
            contactoNuevo.setTipoValor(contacto.tipoValor());

            CONTACTO_REPOSITORY.save(contactoNuevo);
        }
    }

    @Override
    public ContactoResponse actualizarContacto(UUID id, ContactoUpdateRequest request) {
        return null;
    }

    private ContactoResponse mapDTO(Contacto contacto){
        return new ContactoResponse(
                contacto.getContactoId(),
                contacto.getPersonal() != null ? contacto.getPersonal().getNombreCompleto() : null,
                contacto.getEncargado() != null ? contacto.getEncargado().getNombreCompleto() : null,
                contacto.getValor(),
                contacto.getTipoValor()
        );
    }
}
