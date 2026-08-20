package com.cdez.sg_cdez_api.service.impl;

import com.cdez.sg_cdez_api.dto.response.AntropometriaResponse;
import com.cdez.sg_cdez_api.service.AntropometriaService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;


import java.util.UUID;

@Service
@AllArgsConstructor
public class AntropometriaServiceImpl implements AntropometriaService {
    @Override
    public AntropometriaResponse listarAntropometriaPorConsulta(UUID id) {
        return null;
    }
}
