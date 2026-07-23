package com.cdez.sg_cdez_api.service;

import com.cdez.sg_cdez_api.dto.request.ConsultaFiltro;
import com.cdez.sg_cdez_api.dto.response.*;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.stereotype.Service;

import java.awt.print.Pageable;

@Service
public interface ConsultaService {
    PageResponse<ConsultaResponse> listarConsultasFiltradas(ConsultaFiltro filtros,@PageableDefault(size = 10, sort = "createdAt",direction = Sort.Direction.DESC) Pageable pageable);
    ConsultaResponse obtenerConsultaPorId(int id);
}
