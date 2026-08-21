package com.cdez.sg_cdez_api.service.impl;

import com.cdez.sg_cdez_api.dto.request.TamizajeNutricionalCreateRequest;
import com.cdez.sg_cdez_api.dto.request.TamizajeNutricionalUpdateRequest;
import com.cdez.sg_cdez_api.dto.response.TamizajeResponse;
import com.cdez.sg_cdez_api.entity.ConsultaNutricional;
import com.cdez.sg_cdez_api.service.TamizajeService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@AllArgsConstructor
public class TamizajeServiceImpl implements TamizajeService {
    @Override
    public List<TamizajeResponse> listarTamizajesPorConsulta(ConsultaNutricional consultaNutricional) {
        return List.of();
    }

    @Override
    public List<TamizajeResponse> crearTamizajes(List<TamizajeNutricionalCreateRequest> requests, ConsultaNutricional consultaNutricional) {
        return List.of();
    }

    @Override
    public List<TamizajeResponse> actualizarTamizajes(List<TamizajeNutricionalUpdateRequest> requests, ConsultaNutricional consultaNutricional) {
        return List.of();
    }

    @Override
    public List<TamizajeResponse> desactivarTamizajes(List<UUID> tamizajes, ConsultaNutricional consultaNutricional) {
        return List.of();
    }
}
