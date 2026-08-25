package com.cdez.sg_cdez_api.controller;

import com.cdez.sg_cdez_api.dto.request.ConsultaCreateRequest;
import com.cdez.sg_cdez_api.dto.request.ConsultaFiltro;
import com.cdez.sg_cdez_api.dto.request.ConsultaUpdateRequest;
import com.cdez.sg_cdez_api.dto.response.ConsultaDetailResponse;
import com.cdez.sg_cdez_api.dto.response.ConsultaPageResponse;
import com.cdez.sg_cdez_api.dto.response.PageResponse;
import com.cdez.sg_cdez_api.service.ConsultaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;


@RestController
@RequiredArgsConstructor
@RequestMapping("api/consulta")
public class ConsultaController {
    private final ConsultaService SERVICE;

    @PostMapping("/listarConsultasFiltradas")
    public PageResponse<ConsultaPageResponse> listarConsultasFiltradas(@Valid @RequestBody ConsultaFiltro filtros, @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable){
        return SERVICE.listarConsultasFiltradas(filtros, pageable);
    }

    @GetMapping("/obtenerConsulta/{id}")
    public ConsultaDetailResponse obtenerConsultaPorId(@PathVariable(name = "id")UUID id){
        return SERVICE.obtenerConsultaPorId(id);
    }

    @PostMapping("/crearConsulta")
    public ConsultaDetailResponse crearConsulta(@Valid @RequestBody ConsultaCreateRequest request){
        return SERVICE.crearConsulta(request);
    }

    @PutMapping("/actualizarConsulta/{id}")
    public ConsultaDetailResponse actualizarConsulta(@PathVariable(name = "id") UUID id, @Valid @RequestBody ConsultaUpdateRequest request){
        return SERVICE.actualizarConsulta(request, id);
    }

    @PostMapping("/desactivarConsulta/{id}")
    public ConsultaDetailResponse desactivarConsulta(@PathVariable(name = "id") UUID id){
        return SERVICE.desactivarConsulta(id);
    }
}
