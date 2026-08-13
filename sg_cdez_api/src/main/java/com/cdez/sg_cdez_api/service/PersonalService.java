package com.cdez.sg_cdez_api.service;

import com.cdez.sg_cdez_api.dto.request.PersonalActualizarRequest;
import com.cdez.sg_cdez_api.dto.request.PersonalCreateRequest;
import com.cdez.sg_cdez_api.dto.request.PersonalFiltro;
import com.cdez.sg_cdez_api.dto.response.PageResponse;
import com.cdez.sg_cdez_api.dto.response.PersonalResponse;
import com.cdez.sg_cdez_api.entity.Personal;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public interface PersonalService {
    List<PersonalResponse> listarPersonal();
    PageResponse<PersonalResponse> listarPersonalFiltrado(PersonalFiltro filtros,@PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable);
    PersonalResponse obtenerPersonalPorId(UUID id);
    PersonalResponse crearPersonal(PersonalCreateRequest request) throws IOException;
    PersonalResponse actualizarPersonal(UUID id, PersonalActualizarRequest request);
    PersonalResponse activarPersonal(UUID id);
    PersonalResponse desactivarPersonal(UUID id);
    byte[] generarReportePersonalPDF() throws IOException;
    String obtenerNombrePorId(UUID id);
}
