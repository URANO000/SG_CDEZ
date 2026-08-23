package com.cdez.sg_cdez_api.service;

import com.cdez.sg_cdez_api.dto.request.ConsultaFiltro;
import com.cdez.sg_cdez_api.dto.request.ConsultaNutricionalCreateRequest;
import com.cdez.sg_cdez_api.dto.request.ConsultaNutricionalUpdateRequest;
import com.cdez.sg_cdez_api.dto.response.ConsultaNutricionalDetailResponse;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public interface ConsultaNutricionalService {
//    List<ConsultaNutricionalDetailResponse> listarConsultasNutricionalesFiltradas(ConsultaFiltro filtro);
//    ConsultaNutricionalDetailResponse obtenerConsultaNutricionalPorId(UUID id);
    void crearConsultaNutricional(ConsultaNutricionalCreateRequest request);
    void actualizarConsultaNutricional(UUID id, ConsultaNutricionalUpdateRequest request);
    void desactivarConsultaNutricional(UUID id);
}
