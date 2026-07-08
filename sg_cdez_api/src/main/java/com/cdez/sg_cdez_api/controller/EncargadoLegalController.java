package com.cdez.sg_cdez_api.controller;

import com.cdez.sg_cdez_api.dto.request.EncargadoLegalRequest;
import com.cdez.sg_cdez_api.dto.request.EncargadoLegalUpdateRequest;
import com.cdez.sg_cdez_api.dto.response.EncargadoLegalResponse;
import com.cdez.sg_cdez_api.service.EncargadoLegalService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
public class EncargadoLegalController {

    private final EncargadoLegalService encargadoLegalService;

    public EncargadoLegalController(EncargadoLegalService encargadoLegalService) {
        this.encargadoLegalService = encargadoLegalService;
    }

    @PostMapping("/adultos-mayores/{adultoId}/encargados")
    public EncargadoLegalResponse registrarEncargado(
            @PathVariable UUID adultoId,
            @RequestBody EncargadoLegalRequest request
    ) {
        return encargadoLegalService.registrarEncargado(adultoId, request);
    }

    @GetMapping("/adultos-mayores/{adultoId}/encargados")
    public List<EncargadoLegalResponse> listarEncargadosPorAdulto(
            @PathVariable UUID adultoId
    ) {
        return encargadoLegalService.listarEncargadosPorAdulto(adultoId);
    }

    @GetMapping("/encargados/{encargadoId}")
    public EncargadoLegalResponse obtenerEncargadoPorId(
            @PathVariable UUID encargadoId
    ) {
        return encargadoLegalService.obtenerEncargadoPorId(encargadoId);
    }

    @PutMapping("/encargados/{encargadoId}")
    public EncargadoLegalResponse actualizarEncargado(
            @PathVariable UUID encargadoId,
            @RequestBody EncargadoLegalUpdateRequest request
    ) {
        return encargadoLegalService.actualizarEncargado(encargadoId, request);
    }
}