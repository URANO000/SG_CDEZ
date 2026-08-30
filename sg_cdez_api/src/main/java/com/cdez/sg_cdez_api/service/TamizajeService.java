package com.cdez.sg_cdez_api.service;

import com.cdez.sg_cdez_api.dto.request.TamizajeNutricionalCreateRequest;
import com.cdez.sg_cdez_api.dto.request.TamizajeNutricionalUpdateRequest;
import com.cdez.sg_cdez_api.dto.response.TamizajeResponse;
import com.cdez.sg_cdez_api.entity.ConsultaNutricional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface TamizajeService {
    List<TamizajeResponse> listarTamizajesPorConsultaNutricional(ConsultaNutricional consultaNutricional);
    List<TamizajeResponse> crearTamizajesNutricional(List<TamizajeNutricionalCreateRequest> requests, ConsultaNutricional consultaNutricional);
    List<TamizajeResponse> actualizarTamizajesNutricional(List<TamizajeNutricionalUpdateRequest> requests, ConsultaNutricional consultaNutricional);
}
