package com.cdez.sg_cdez_api.service;

import com.cdez.sg_cdez_api.dto.response.PersonalResponse;
import com.cdez.sg_cdez_api.entity.Personal;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface PersonalService {
    List<PersonalResponse> listarPersonal();
    Personal obtenerPersonalPorId();
}
