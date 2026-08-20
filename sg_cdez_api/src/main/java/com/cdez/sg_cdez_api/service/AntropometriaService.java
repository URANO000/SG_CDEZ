package com.cdez.sg_cdez_api.service;

import com.cdez.sg_cdez_api.dto.response.AntropometriaResponse;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public interface AntropometriaService {
    AntropometriaResponse listarAntropometriaPorConsulta(UUID id);
}
