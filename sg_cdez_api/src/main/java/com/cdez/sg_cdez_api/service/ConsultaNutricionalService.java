package com.cdez.sg_cdez_api.service;

import com.cdez.sg_cdez_api.dto.request.ConsultaFiltro;
import com.cdez.sg_cdez_api.dto.request.ConsultaNutricionalCreateRequest;
import com.cdez.sg_cdez_api.dto.request.ConsultaNutricionalUpdateRequest;
import com.cdez.sg_cdez_api.dto.response.ConsultaNutricionalResponse;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public interface ConsultaNutricionalService {
    ConsultaNutricionalResponse listarConsultasNutricionalesFiltradas(ConsultaFiltro filtro);
    ConsultaNutricionalResponse obtenerConsultaNutricionalPorId(UUID id);
    ConsultaNutricionalResponse crearConsultaNutricional(ConsultaNutricionalCreateRequest request);
    ConsultaNutricionalResponse actualizarConsultaNutricional(UUID id, ConsultaNutricionalUpdateRequest request);
    ConsultaNutricionalResponse desactivarConsultaNutricional(UUID id);
}
