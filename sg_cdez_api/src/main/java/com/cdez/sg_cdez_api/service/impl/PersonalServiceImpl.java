package com.cdez.sg_cdez_api.service.impl;

import com.cdez.sg_cdez_api.dto.response.PersonalResponse;
import com.cdez.sg_cdez_api.entity.Personal;
import com.cdez.sg_cdez_api.repository.AuthRepository;
import com.cdez.sg_cdez_api.repository.PersonalRepository;
import com.cdez.sg_cdez_api.service.PersonalService;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PersonalServiceImpl implements PersonalService {
    private final PersonalRepository REPOSITORY;

    @Override
    public List<PersonalResponse> listarPersonal() {
        return List.of();
    }

    @Override
    public Personal obtenerPersonalPorId() {
        return null;
    }
}
