package com.cdez.sg_cdez_api.controller;

import com.cdez.sg_cdez_api.dto.request.ConsultaFiltro;
import com.cdez.sg_cdez_api.dto.response.ConsultaResponse;
import com.cdez.sg_cdez_api.dto.response.PageResponse;
import com.cdez.sg_cdez_api.service.ConsultaService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;



@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class ConsultaController {
    private final ConsultaService SERVICE;

    @PostMapping("/listarConsultasFiltradas")
    public PageResponse<ConsultaResponse> listarConsultasFiltradas(ConsultaFiltro filtros, @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable){
        return SERVICE.listarConsultasFiltradas(filtros, pageable);
    }
}
