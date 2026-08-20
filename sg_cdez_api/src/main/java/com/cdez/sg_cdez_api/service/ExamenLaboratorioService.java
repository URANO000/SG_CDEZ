package com.cdez.sg_cdez_api.service;

import com.cdez.sg_cdez_api.dto.response.ExamenLaboratorioResponse;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public interface ExamenLaboratorioService {
    List<ExamenLaboratorioResponse> listarExamenesPorConsulta(UUID id);
}
