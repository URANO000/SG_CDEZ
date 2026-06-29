package com.cdez.sg_cdez_api.service;

import com.cdez.sg_cdez_api.dto.request.ContactoCreateRequest;
import com.cdez.sg_cdez_api.dto.request.ContactoUpdateRequest;
import com.cdez.sg_cdez_api.dto.response.ContactoResponse;
import com.cdez.sg_cdez_api.entity.EncargadoLegal;
import com.cdez.sg_cdez_api.entity.Personal;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public interface ContactoService {
    List<ContactoResponse> listarContactoPorId(UUID uuid);
    void crearContactoPersonal(List<ContactoCreateRequest> requests, Personal personal);
    void crearContactoEncargado(List<ContactoCreateRequest> requests, EncargadoLegal encargadoLegal);
    ContactoResponse actualizarContacto(UUID id, ContactoUpdateRequest request);

}
