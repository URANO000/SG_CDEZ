package com.cdez.sg_cdez_api.service.impl;

import com.cdez.sg_cdez_api.dto.response.ExamenLaboratorioResponse;
import com.cdez.sg_cdez_api.service.ExamenLaboratorioService;

import java.util.List;
import java.util.UUID;

public class ExamenLaboratorioServiceImpl implements ExamenLaboratorioService {
    @Override
    public List<ExamenLaboratorioResponse> listarExamenesPorConsulta(UUID id) {
        return List.of();
    }
}
