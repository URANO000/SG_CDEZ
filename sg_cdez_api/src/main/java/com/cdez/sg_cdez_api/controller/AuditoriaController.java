package com.cdez.sg_cdez_api.controller;

import com.cdez.sg_cdez_api.dto.request.AuditoriaFiltroRequest;
import com.cdez.sg_cdez_api.dto.response.AuditoriaResponse;
import com.cdez.sg_cdez_api.service.AuditoriaService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auditorias")
public class AuditoriaController {

    private final AuditoriaService auditoriaService;

    @GetMapping
    public ResponseEntity<List<AuditoriaResponse>> consultarAuditorias(
            @RequestParam(required = false) UUID usuarioId,
            @RequestParam(required = false) String usuario,
            @RequestParam(required = false) String accion,
            @RequestParam(required = false) String modulo,

            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
            LocalDateTime fechaDesde,

            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
            LocalDateTime fechaHasta
    ) {
        AuditoriaFiltroRequest filtro = new AuditoriaFiltroRequest(
                usuarioId,
                usuario,
                accion,
                modulo,
                fechaDesde,
                fechaHasta
        );

        return ResponseEntity.ok(
                auditoriaService.consultarAuditorias(filtro)
        );
    }
}