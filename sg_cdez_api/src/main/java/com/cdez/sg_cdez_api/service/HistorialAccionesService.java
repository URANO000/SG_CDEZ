package com.cdez.sg_cdez_api.service;

import com.cdez.sg_cdez_api.dto.request.HistorialAccionesCreateRequest;
import com.cdez.sg_cdez_api.dto.request.HistorialAccionesFiltro;
import com.cdez.sg_cdez_api.dto.response.HistorialAccionesResponse;
import com.cdez.sg_cdez_api.dto.response.PageResponse;
import org.springframework.stereotype.Service;

import java.awt.print.Pageable;

@Service
public interface HistorialAccionesService {
    PageResponse<HistorialAccionesResponse> listarHistorialFiltrado(HistorialAccionesFiltro filtros, Pageable pageable);
    HistorialAccionesResponse obtenerHistorialPorId(int id);
    HistorialAccionesResponse crearHistorial(HistorialAccionesCreateRequest request);
}
