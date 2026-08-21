package com.cdez.sg_cdez_api.service;

import com.cdez.sg_cdez_api.dto.request.*;
import com.cdez.sg_cdez_api.dto.response.*;
import com.cdez.sg_cdez_api.entity.Consulta;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.UUID;


@Service
public interface ConsultaService {
    PageResponse<ConsultaResponse> listarConsultasFiltradas(ConsultaFiltro filtros,Pageable pageable);
    ConsultaResponse obtenerConsultaPorId(UUID id);
    ConsultaResponse crearConsulta(ConsultaCreateRequest request);
    ConsultaResponse actualizarConsulta(ConsultaUpdateRequest request, UUID id);
    ConsultaResponse desactivarConsulta(UUID id);
    ConsultaResponse mapDTO(Consulta consulta);
    Consulta obtenerConsultaCheck(UUID id);
    void verificarEdicionValida(UUID id);
}
