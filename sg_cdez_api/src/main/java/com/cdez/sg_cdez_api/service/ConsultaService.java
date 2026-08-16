package com.cdez.sg_cdez_api.service;

import com.cdez.sg_cdez_api.dto.request.ConsultaFiltro;
import com.cdez.sg_cdez_api.dto.response.*;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.UUID;


@Service
public interface ConsultaService {
    PageResponse<ConsultaResponse> listarConsultasFiltradas(ConsultaFiltro filtros,Pageable pageable);
    ConsultaResponse obtenerConsultaPorId(UUID id);
}
