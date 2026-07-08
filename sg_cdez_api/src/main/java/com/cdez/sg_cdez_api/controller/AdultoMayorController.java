package com.cdez.sg_cdez_api.controller;

import com.cdez.sg_cdez_api.dto.request.AdultoMayorRequest;
import com.cdez.sg_cdez_api.dto.request.AdultoMayorUpdateRequest;
import com.cdez.sg_cdez_api.dto.response.AdultoMayorResponse;
import com.cdez.sg_cdez_api.service.AdultoMayorService;
import org.springframework.web.bind.annotation.*;
import com.cdez.sg_cdez_api.dto.request.AdultoMayorDesactivarRequest;
import com.cdez.sg_cdez_api.dto.request.AdultoMayorFallecimientoRequest;
import java.util.UUID;

import java.util.List;

@RestController
@RequestMapping("/api/adultos-mayores")
public class AdultoMayorController {

    private final AdultoMayorService adultoMayorService;

    public AdultoMayorController(AdultoMayorService adultoMayorService) {
        this.adultoMayorService = adultoMayorService;
    }

    @GetMapping
    public List<AdultoMayorResponse> listarAdultosMayores() {
        return adultoMayorService.listarAdultosMayores();
    }
    @GetMapping("/buscar")
    public List<AdultoMayorResponse> buscarAdultosMayores(
            @RequestParam(required = false) String texto
    ) {
        return adultoMayorService.buscarAdultosMayores(texto);
    }
    @GetMapping("/{id}")
    public AdultoMayorResponse obtenerAdultoMayorPorId(@PathVariable UUID id) {
        return adultoMayorService.obtenerAdultoMayorPorId(id);
    }

    @GetMapping("/inactivos")
    public List<AdultoMayorResponse> listarAdultosMayoresInactivos() {
        return adultoMayorService.listarAdultosMayoresInactivos();
    }

    @GetMapping("/fallecidos")
    public List<AdultoMayorResponse> listarAdultosMayoresFallecidos() {
        return adultoMayorService.listarAdultosMayoresFallecidos();
    }

    @PostMapping
    public AdultoMayorResponse crearAdultoMayor(@RequestBody AdultoMayorRequest request) {
        return adultoMayorService.crearAdultoMayor(request);
    }
    @PutMapping("/{id}")
    public AdultoMayorResponse actualizarAdultoMayor(
            @PathVariable UUID id,
            @RequestBody AdultoMayorUpdateRequest request
    ) {
        return adultoMayorService.actualizarAdultoMayor(id, request);
    }
    @PatchMapping("/{id}/desactivar")
    public AdultoMayorResponse desactivarAdultoMayor(
            @PathVariable UUID id,
            @RequestBody AdultoMayorDesactivarRequest request
    ) {
        return adultoMayorService.desactivarAdultoMayor(id, request);
    }
    @PatchMapping("/{id}/activar")
    public AdultoMayorResponse activarAdultoMayor(
            @PathVariable UUID id
    ) {
        return adultoMayorService.activarAdultoMayor(id);
    }
    @PatchMapping("/{id}/fallecimiento")
    public AdultoMayorResponse registrarFallecimiento(
            @PathVariable UUID id,
            @RequestBody AdultoMayorFallecimientoRequest request
    ) {
        return adultoMayorService.registrarFallecimiento(id, request);
    }
}