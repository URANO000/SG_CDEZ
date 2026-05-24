package com.cdez.sg_cdez_api.controller;

import com.cdez.sg_cdez_api.dto.request.AdultoMayorRequest;
import com.cdez.sg_cdez_api.dto.response.AdultoMayorResponse;
import com.cdez.sg_cdez_api.service.AdultoMayorService;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;

import java.util.List;

@RestController
@RequestMapping("/adultos-mayores")
public class AdultoMayorController {

    private final AdultoMayorService adultoMayorService;

    public AdultoMayorController(AdultoMayorService adultoMayorService) {
        this.adultoMayorService = adultoMayorService;
    }

    @GetMapping
    public List<AdultoMayorResponse> listarAdultosMayores() {
        return adultoMayorService.listarAdultosMayores();
    }
    @GetMapping("/{id}")
    public AdultoMayorResponse obtenerAdultoMayorPorId(@PathVariable UUID id) {
        return adultoMayorService.obtenerAdultoMayorPorId(id);
    }

    @PostMapping
    public AdultoMayorResponse crearAdultoMayor(@RequestBody AdultoMayorRequest request) {
        return adultoMayorService.crearAdultoMayor(request);
    }

    @PutMapping("/{id}")
    public AdultoMayorResponse actualizarAdultoMayor(
            @PathVariable UUID id,
            @RequestBody AdultoMayorRequest request
    ) {
        return adultoMayorService.actualizarAdultoMayor(id, request);
    }
}