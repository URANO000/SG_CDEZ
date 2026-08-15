package com.cdez.sg_cdez_api.service;

import com.cdez.sg_cdez_api.dto.request.*;
import com.cdez.sg_cdez_api.dto.response.*;
import com.cdez.sg_cdez_api.entity.Personal;
import org.springframework.data.domain.*;
import org.springframework.data.web.PageableDefault;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;

@Service
public interface PersonalService {
    List<PersonalResponse> listarPersonal();
    PageResponse<PersonalResponse> listarPersonalFiltrado(PersonalFiltro filtros,@PageableDefault(sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable);
    PersonalResponse obtenerPersonalPorId(UUID id);
    PersonalResponse crearPersonal(PersonalCreateRequest request, List<MultipartFile> documentos) throws IOException;
    PersonalResponse actualizarPersonal(UUID id, PersonalActualizarRequest request, List<MultipartFile> documentosCrear) throws IOException;
    PersonalResponse activarPersonal(UUID id);
    PersonalResponse desactivarPersonal(UUID id);
    byte[] generarReportePersonalPDF() throws IOException;
    String obtenerNombrePorId(UUID id);
    Personal obtenerPersonalCheck(UUID id);
}
