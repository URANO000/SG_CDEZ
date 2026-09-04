package com.cdez.sg_cdez_api.controller;

import com.cdez.sg_cdez_api.dto.request.AuditoriaFiltroRequest;
import com.cdez.sg_cdez_api.dto.response.AuditoriaResponse;
import com.cdez.sg_cdez_api.service.AuditoriaService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.UUID;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auditorias")
public class AuditoriaController {

    private final AuditoriaService auditoriaService;

    @GetMapping
    public ResponseEntity<Page<AuditoriaResponse>> consultarAuditorias(
            @RequestParam(required = false) UUID usuarioId,
            @RequestParam(required = false) String usuario,
            @RequestParam(required = false) String accion,
            @RequestParam(required = false)
            List<String> modulos,

            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
            LocalDateTime fechaDesde,

            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
            LocalDateTime fechaHasta,

            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        AuditoriaFiltroRequest filtro = new AuditoriaFiltroRequest(
                usuarioId,
                usuario,
                accion,
                modulos,
                fechaDesde,
                fechaHasta
        );

        Pageable pageable = PageRequest.of(
                page,
                size,
                Sort.by(Sort.Direction.DESC, "createdAt")
        );

        return ResponseEntity.ok(
                auditoriaService.consultarAuditorias(filtro, pageable)
        );
    }
}