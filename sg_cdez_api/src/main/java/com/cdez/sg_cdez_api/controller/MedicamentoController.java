package com.cdez.sg_cdez_api.controller;

import com.cdez.sg_cdez_api.dto.request.MedicamentoCreateRequest;
import com.cdez.sg_cdez_api.dto.response.MedicamentoResponse;
import com.cdez.sg_cdez_api.service.MedicamentoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/medicamentos")
public class MedicamentoController {
    private final MedicamentoService SERVICE;

    @PostMapping("/listarMedicamentos/{adultoId}")
    public List<MedicamentoResponse> listarMedicamentos(@PathVariable(name = "adultoId") UUID adultoId){
        return SERVICE.listarMedicamentosPorAdulto(adultoId);
    }

    @PostMapping("/crearMedicamentos/{adultoId}")
    public List<MedicamentoResponse> crearMedicamento(@Valid @RequestBody List<MedicamentoCreateRequest> requests, @PathVariable(name = "adultoId") UUID adultoId){
        return SERVICE.crearMedicamentos(requests, adultoId);
    }
}
