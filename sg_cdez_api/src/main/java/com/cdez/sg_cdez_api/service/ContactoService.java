package com.cdez.sg_cdez_api.service;

import com.cdez.sg_cdez_api.dto.request.*;
import com.cdez.sg_cdez_api.dto.response.ContactoResponse;
import com.cdez.sg_cdez_api.entity.EncargadoLegal;
import com.cdez.sg_cdez_api.entity.Personal;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public interface ContactoService {
    List<ContactoResponse> listarContactoPorPersonal(Personal personal);
    List<ContactoResponse> listarContactoPorEncargado(EncargadoLegal encargadoLegal);
    List<ContactoResponse> crearContactoPersonal(List<ContactoCreateRequest> requests, Personal personal);
    List<ContactoResponse> crearContactoEncargado(List<ContactoCreateRequest> requests, EncargadoLegal encargadoLegal);
    List<ContactoResponse> actualizarContacto(List<ContactoUpdateRequest> requests, Personal personal);
    void desactivarContactosPersonal(List<Integer> requests, Personal personal);

}
