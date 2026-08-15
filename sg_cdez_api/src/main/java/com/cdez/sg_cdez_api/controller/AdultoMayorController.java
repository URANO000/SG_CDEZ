package com.cdez.sg_cdez_api.controller;

import com.cdez.sg_cdez_api.dto.request.AdultoMayorRequest;
import com.cdez.sg_cdez_api.dto.request.AdultoMayorUpdateRequest;
import com.cdez.sg_cdez_api.dto.response.AdultoMayorResponse;
import com.cdez.sg_cdez_api.service.AdultoMayorService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.cdez.sg_cdez_api.dto.request.AdultoMayorDesactivarRequest;
import com.cdez.sg_cdez_api.dto.request.AdultoMayorFallecimientoRequest;
import com.cdez.sg_cdez_api.dto.request.AdultoMayorFiltro;
import com.cdez.sg_cdez_api.dto.response.PageResponse;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;

import java.io.IOException;
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

    @PostMapping("/listarFiltrado")
    public PageResponse<AdultoMayorResponse>
    listarAdultosMayoresFiltrados(
            @RequestBody AdultoMayorFiltro filtros,

            @PageableDefault(
                    sort = "createdAt",
                    direction = Sort.Direction.DESC
            )
            Pageable pageable
    ) {
        return adultoMayorService
                .listarAdultosMayoresFiltrados(
                        filtros,
                        pageable
                );
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

    @GetMapping("/reporte")
    public ResponseEntity<byte[]> generarReportePdf() throws IOException {
        byte[] pdf = adultoMayorService.generarReporteAdultoPDF();
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=reporte_de_adultoMayor.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }
}