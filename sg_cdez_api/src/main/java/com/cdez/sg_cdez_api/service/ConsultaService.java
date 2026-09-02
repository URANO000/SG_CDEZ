package com.cdez.sg_cdez_api.service;

import com.cdez.sg_cdez_api.dto.request.*;
import com.cdez.sg_cdez_api.dto.response.*;
import com.cdez.sg_cdez_api.entity.Consulta;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.UUID;


@Service
public interface ConsultaService {
    PageResponse<ConsultaPageResponse> listarConsultasFiltradas(ConsultaFiltro filtros, Pageable pageable);
    ConsultaDetailResponse obtenerConsultaPorId(UUID id);
    ConsultaDetailResponse crearConsulta(ConsultaCreateRequest request);
    Consulta crearConsultaEntity(ConsultaCreateRequest request);
    ConsultaDetailResponse actualizarConsulta(ConsultaUpdateRequest request, UUID id);
    ConsultaDetailResponse desactivarConsulta(UUID id);
    Consulta obtenerConsultaCheck(UUID id);
    byte[] exportarConsultaPDF(UUID consultaId) throws IOException;
}
