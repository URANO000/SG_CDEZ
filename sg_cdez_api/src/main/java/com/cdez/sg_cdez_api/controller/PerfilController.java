package com.cdez.sg_cdez_api.controller;

import com.cdez.sg_cdez_api.dto.request.PerfilActualizarRequest;
import com.cdez.sg_cdez_api.dto.response.PerfilResponse;
import com.cdez.sg_cdez_api.service.PerfilService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/perfil")
@RequiredArgsConstructor
public class PerfilController {

    private final PerfilService perfilService;

    @GetMapping
    public ResponseEntity<PerfilResponse> obtenerPerfil() {
        return ResponseEntity.ok(perfilService.obtenerPerfil());
    }

    @PutMapping
    public ResponseEntity<PerfilResponse> actualizarPerfil(
            @RequestBody PerfilActualizarRequest request
    ) {
        return ResponseEntity.ok(perfilService.actualizarPerfil(request));
    }
}