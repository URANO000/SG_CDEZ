package com.cdez.sg_cdez_api.service;
import com.cdez.sg_cdez_api.dto.request.AdultoMayorRequest;
import com.cdez.sg_cdez_api.dto.response.AdultoMayorResponse;
import com.cdez.sg_cdez_api.dto.request.AdultoMayorUpdateRequest;
import java.util.UUID;
import com.cdez.sg_cdez_api.dto.request.AdultoMayorDesactivarRequest;
import com.cdez.sg_cdez_api.dto.request.AdultoMayorFallecimientoRequest;
import com.cdez.sg_cdez_api.dto.request.AdultoMayorFiltro;
import com.cdez.sg_cdez_api.dto.response.PageResponse;

import com.cdez.sg_cdez_api.entity.AdultoMayor;
import org.springframework.data.domain.Pageable;
import java.util.List;

public interface AdultoMayorService {
    List<AdultoMayorResponse> listarAdultosMayoresSinFiltro();
    List<AdultoMayorResponse> listarAdultosMayores();
    List<AdultoMayorResponse> listarAdultosMayoresInactivos();
    List<AdultoMayorResponse> listarAdultosMayoresFallecidos();
    List<AdultoMayorResponse> buscarAdultosMayores(String texto);
    AdultoMayorResponse crearAdultoMayor(AdultoMayorRequest request);
    AdultoMayorResponse obtenerAdultoMayorPorId(UUID id);
    AdultoMayorResponse actualizarAdultoMayor(UUID id, AdultoMayorUpdateRequest request);
    AdultoMayorResponse desactivarAdultoMayor(UUID id, AdultoMayorDesactivarRequest request);
    AdultoMayorResponse activarAdultoMayor(UUID id);
    AdultoMayorResponse registrarFallecimiento(UUID id, AdultoMayorFallecimientoRequest request);
    byte[] generarReporteAdultoPDF();
    byte[] generarReporteAdultoExcel();
    PageResponse<AdultoMayorResponse> listarAdultosMayoresFiltrados(AdultoMayorFiltro filtros, Pageable pageable);
    AdultoMayor obtenerAdultoCheck(UUID id);

}