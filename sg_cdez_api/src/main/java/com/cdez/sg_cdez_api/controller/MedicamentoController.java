package com.cdez.sg_cdez_api.controller;

import com.cdez.sg_cdez_api.dto.request.MedicamentoCreateRequest;
import com.cdez.sg_cdez_api.dto.request.MedicamentoUpdateRequest;
import com.cdez.sg_cdez_api.dto.response.MedicamentoResponse;
import com.cdez.sg_cdez_api.service.MedicamentoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
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
    public MedicamentoResponse crearMedicamento(@Valid @RequestBody MedicamentoCreateRequest request, @PathVariable(name = "adultoId") UUID adultoId){
        return SERVICE.crearMedicamentos(request, adultoId);
    }

    @PutMapping("/actualizarMedicamentos/{adultoId}")
    public MedicamentoResponse actualizarMedicamento(@Valid @RequestBody MedicamentoUpdateRequest request, @PathVariable(name = "adultoId") UUID adultoId){
        return SERVICE.actualizarMedicamentos(request, adultoId);
    }

    @PostMapping("/desactivarMedicamentos/{medicamentoId}")
    public void desactivarMedicamento(@PathVariable(name = "medicamentoId") UUID medicamentoId){
        SERVICE.desactivarMedicamentos(medicamentoId);
    }

    @PostMapping("/desactivarMedicamentos/{medicamentoId}")
    public void activarMedicamento(@PathVariable(name = "medicamentoId") UUID medicamentoId){
        SERVICE.activarMedicamentos(medicamentoId);
    }
}
