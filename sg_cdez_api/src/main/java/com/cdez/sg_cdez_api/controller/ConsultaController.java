package com.cdez.sg_cdez_api.controller;

import com.cdez.sg_cdez_api.dto.request.ConsultaCreateRequest;
import com.cdez.sg_cdez_api.dto.request.ConsultaFiltro;
import com.cdez.sg_cdez_api.dto.request.ConsultaUpdateRequest;
import com.cdez.sg_cdez_api.dto.response.ConsultaResponse;
import com.cdez.sg_cdez_api.dto.response.PageResponse;
import com.cdez.sg_cdez_api.service.ConsultaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;


@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class ConsultaController {
    private final ConsultaService SERVICE;

    @PostMapping("/listarConsultasFiltradas")
    public PageResponse<ConsultaResponse> listarConsultasFiltradas(ConsultaFiltro filtros, @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable){
        return SERVICE.listarConsultasFiltradas(filtros, pageable);
    }

    @GetMapping("/obtenerConsulta/{id}")
    public ConsultaResponse obtenerConsultaPorId(@PathVariable(name = "id")UUID id){
        return SERVICE.obtenerConsultaPorId(id);
    }

    @PostMapping("/crearConsulta")
    public ConsultaResponse crearConsulta(@Valid @RequestBody ConsultaCreateRequest request){
        return SERVICE.crearConsulta(request);
    }

    @PostMapping("/actualizarConsulta/{id}")
    public ConsultaResponse actualizarConsulta(@PathVariable(name = "id") UUID id, @Valid @RequestBody ConsultaUpdateRequest request){
        return SERVICE.actualizarConsulta(request, id);
    }

    @PostMapping("/desactivarConsulta/{id}")
    public ConsultaResponse desactivarConsulta(@PathVariable(name = "id") UUID id){
        return SERVICE.desactivarConsulta(id);
    }
}
