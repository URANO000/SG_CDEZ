package com.cdez.sg_cdez_api.service;

import com.cdez.sg_cdez_api.dto.request.AntropometriaCreateRequest;
import com.cdez.sg_cdez_api.dto.request.AntropometriaUpdateRequest;
import com.cdez.sg_cdez_api.dto.response.AntropometriaResponse;
import com.cdez.sg_cdez_api.entity.ConsultaNutricional;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public interface AntropometriaService {
    AntropometriaResponse obtenerAntropometriaPorConsulta(ConsultaNutricional consultaNutricional);
    AntropometriaResponse crearAntropometria(AntropometriaCreateRequest request, ConsultaNutricional consultaNutricional);
    AntropometriaResponse actualizarAntropometria(AntropometriaUpdateRequest request, ConsultaNutricional consultaNutricional);
}
