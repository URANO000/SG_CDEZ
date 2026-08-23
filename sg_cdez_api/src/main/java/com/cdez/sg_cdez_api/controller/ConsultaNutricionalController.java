package com.cdez.sg_cdez_api.controller;

import com.cdez.sg_cdez_api.dto.request.*;
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

    @PostMapping("/crearConsulta")
    public void crearConsultaNutricional(@Valid @RequestBody ConsultaNutricionalCreateRequest request){
        SERVICE.crearConsultaNutricional(request);
    }

    @PutMapping("/actualizarConsulta/{id}")
    public void actualizarConsultaNutricional(@PathVariable(name = "id") UUID id, @Valid @RequestBody ConsultaNutricionalUpdateRequest request){
        SERVICE.actualizarConsultaNutricional(id, request);
    }

    @PostMapping("/desactivarConsulta/{id}")
    public void desactivarConsultaNutricional(@PathVariable(name = "id") UUID id){
        SERVICE.desactivarConsultaNutricional(id);
    }
}
