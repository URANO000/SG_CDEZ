package com.cdez.sg_cdez_api.service;

import com.cdez.sg_cdez_api.dto.request.PersonalActualizarRequest;
import com.cdez.sg_cdez_api.dto.request.PersonalCreateRequest;
import com.cdez.sg_cdez_api.dto.response.PersonalResponse;
import com.cdez.sg_cdez_api.entity.Personal;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public interface PersonalService {
    List<PersonalResponse> listarPersonal();
    PersonalResponse obtenerPersonalPorId(UUID id);
    PersonalResponse crearPersonal(PersonalCreateRequest request);
    PersonalResponse actualizarPersonal(UUID id, PersonalActualizarRequest request);
    PersonalResponse activarPersonal(UUID id);
    PersonalResponse desactivarPersonal(UUID id);
}
