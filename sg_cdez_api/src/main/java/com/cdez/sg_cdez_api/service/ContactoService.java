package com.cdez.sg_cdez_api.service;

import com.cdez.sg_cdez_api.dto.request.*;
import com.cdez.sg_cdez_api.dto.response.ContactoResponse;
import com.cdez.sg_cdez_api.entity.*;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public interface ContactoService {
    List<ContactoResponse> listarContactoPorPersonal(Personal personal);
    List<ContactoResponse> listarContactoPorEncargado(EncargadoLegal encargado);
    void crearContactoPersonal(List<ContactoCreateRequest> requests, Personal personal);
    void crearContactoEncargado(List<ContactoCreateRequest> requests, EncargadoLegal encargadoLegal);
    ContactoResponse actualizarContacto(UUID id, ContactoUpdateRequest request);

}
