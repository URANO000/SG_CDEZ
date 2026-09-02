package com.cdez.sg_cdez_api.controller;

import com.cdez.sg_cdez_api.dto.request.ConsultaPsychActualizarRequest;
import com.cdez.sg_cdez_api.dto.request.ConsultaPsychCreateRequest;
import com.cdez.sg_cdez_api.service.ConsultaPsychService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/consulta-psych")
public class ConsultaPsychController {
    private final ConsultaPsychService SERVICE;

    @PostMapping("/crearConsulta")
    public void crearConsultaPsych(@Valid @RequestBody ConsultaPsychCreateRequest request){
        SERVICE.crearConsultaPsych(request);
    }

    @PutMapping("/actualizarConsulta/{id}")
    public void actualizarConsultaPsych(@PathVariable(name = "id") UUID id, @Valid @RequestBody ConsultaPsychActualizarRequest request) {
        SERVICE.actualizarConsultaPsych(id, request);
    }

    @PostMapping("/desactivarConsulta/{id}")
    public void desactivarConsultaPsych(@PathVariable(name = "id") UUID id){
        SERVICE.desactivarConsultaPsych(id);
    }
}
