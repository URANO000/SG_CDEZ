package com.cdez.sg_cdez_api.service;

import com.cdez.sg_cdez_api.dto.request.TamizajeNutricionalCreateRequest;
import com.cdez.sg_cdez_api.dto.request.TamizajeNutricionalUpdateRequest;
import com.cdez.sg_cdez_api.dto.response.TamizajeResponse;
import com.cdez.sg_cdez_api.entity.ConsultaNutricional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public interface TamizajeService {
    List<TamizajeResponse> listarTamizajesPorConsulta(ConsultaNutricional consultaNutricional);
    List<TamizajeResponse> crearTamizajes(List<TamizajeNutricionalCreateRequest> requests, ConsultaNutricional consultaNutricional);
    List<TamizajeResponse> actualizarTamizajes(List<TamizajeNutricionalUpdateRequest> requests, ConsultaNutricional consultaNutricional);
    List<TamizajeResponse> desactivarTamizajes(List<UUID> tamizajes, ConsultaNutricional consultaNutricional);

}
