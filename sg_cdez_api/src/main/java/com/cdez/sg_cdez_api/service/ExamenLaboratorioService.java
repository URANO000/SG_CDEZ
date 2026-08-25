package com.cdez.sg_cdez_api.service;

import com.cdez.sg_cdez_api.dto.request.ExamenLaboratorioCreateRequest;
import com.cdez.sg_cdez_api.dto.request.ExamenLaboratorioUpdateRequest;
import com.cdez.sg_cdez_api.dto.response.ExamenLaboratorioResponse;
import com.cdez.sg_cdez_api.entity.ConsultaNutricional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public interface ExamenLaboratorioService {
    List<ExamenLaboratorioResponse> listarExamenesPorConsulta(ConsultaNutricional consultaNutricional);
    List<ExamenLaboratorioResponse> crearExamenesLab(List<ExamenLaboratorioCreateRequest> requests, ConsultaNutricional consultaNutricional);
    List<ExamenLaboratorioResponse> actualizarExamenesLab(List<ExamenLaboratorioUpdateRequest> requests, ConsultaNutricional consultaNutricional);
}
