package com.cdez.sg_cdez_api.service;

import com.cdez.sg_cdez_api.dto.request.*;
import com.cdez.sg_cdez_api.dto.response.TamizajeResponse;
import com.cdez.sg_cdez_api.entity.*;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface TamizajeService {
    List<TamizajeResponse> listarTamizajesPorConsultaNutricional(ConsultaNutricional consultaNutricional);
    List<TamizajeResponse> crearTamizajesNutricional(List<TamizajeCreateRequest> requests, ConsultaNutricional consultaNutricional);
    List<TamizajeResponse> actualizarTamizajesNutricional(List<TamizajeUpdateRequest> requests, ConsultaNutricional consultaNutricional);
    List<TamizajeResponse> actualizarTamizajesPsych(List<TamizajeUpdateRequest> requests, ConsultaPsych consultaPsych);
    List<TamizajeResponse> crearTamizajesPsych(List<TamizajeCreateRequest> requests, ConsultaPsych consultaPsych);
    List<TamizajeResponse> listarTamizajesPorConsultaPsych(ConsultaPsych consultaPsych);
}
