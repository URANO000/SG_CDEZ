package com.cdez.sg_cdez_api.controller;

import com.cdez.sg_cdez_api.dto.request.ConsultaFiltro;
import com.cdez.sg_cdez_api.dto.request.ConsultaNutricionalCreateRequest;
import com.cdez.sg_cdez_api.dto.request.ConsultaNutricionalUpdateRequest;
import com.cdez.sg_cdez_api.dto.response.ConsultaNutricionalResponse;
import com.cdez.sg_cdez_api.service.ConsultaNutricionalService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/consulta-nutricional")
public class ConsultaNutricionalController {
    private final ConsultaNutricionalService SERVICE;

    @PostMapping("/listarConsultas")
    public ConsultaNutricionalResponse listarConsultasFiltradas(@Valid @RequestBody ConsultaFiltro filtros){
       return SERVICE.listarConsultasNutricionalesFiltradas(filtros);
    }

    @GetMapping("/obtenerConsulta/{id}")
    public ConsultaNutricionalResponse obtenerConsultaNutricionalPorId(@PathVariable(name = "id") UUID id){
        return SERVICE.obtenerConsultaNutricionalPorId(id);
    }
    @PostMapping("/crearConsulta")
    public ConsultaNutricionalResponse crearConsultaNutricional(@Valid @RequestBody ConsultaNutricionalCreateRequest request){
        return SERVICE.crearConsultaNutricional(request);
    }

    @PutMapping("/actualizarConsulta/{id}")
    public ConsultaNutricionalResponse actualizarConsultaNutricional(@PathVariable(name = "id") UUID id, @Valid @RequestBody ConsultaNutricionalUpdateRequest request){
        return SERVICE.actualizarConsultaNutricional(id, request);
    }

    @PostMapping("/desactivarConsulta/{id}")
    public ConsultaNutricionalResponse desactivarConsultaNutricional(@PathVariable(name = "id") UUID id){
        return SERVICE.desactivarConsultaNutricional(id);
    }
}
