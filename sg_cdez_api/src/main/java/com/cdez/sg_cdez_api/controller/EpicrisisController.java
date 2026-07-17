package com.cdez.sg_cdez_api.controller;

import com.cdez.sg_cdez_api.dto.request.EpicrisisUpdateRequest;
import com.cdez.sg_cdez_api.dto.response.EpicrisisResponse;
import com.cdez.sg_cdez_api.service.EpicrisisService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class EpicrisisController {

    private final EpicrisisService epicrisisService;

    @PostMapping(
            value = "/adultos-mayores/{adultoId}/epicrisis",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<EpicrisisResponse> registrarEpicrisis(
            @PathVariable UUID adultoId,

            @RequestParam("fechaEmision")
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
            LocalDateTime fechaEmision,

            @RequestParam(value = "fechaRecepcion", required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
            LocalDateTime fechaRecepcion,

            @RequestParam("centroSalud") String centroSalud,
            @RequestParam("archivo") MultipartFile archivo
    ) {
        EpicrisisResponse response = epicrisisService.registrarEpicrisis(
                adultoId,
                fechaEmision,
                fechaRecepcion,
                centroSalud,
                archivo
        );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/adultos-mayores/{adultoId}/epicrisis")
    public ResponseEntity<List<EpicrisisResponse>> listarEpicrisisPorAdulto(
            @PathVariable UUID adultoId
    ) {
        return ResponseEntity.ok(
                epicrisisService.listarEpicrisisPorAdulto(adultoId)
        );
    }

    @GetMapping("/adultos-mayores/{adultoId}/epicrisis/vigente")
    public ResponseEntity<EpicrisisResponse> obtenerEpicrisisVigente(
            @PathVariable UUID adultoId
    ) {
        return ResponseEntity.ok(
                epicrisisService.obtenerEpicrisisVigente(adultoId)
        );
    }

    @GetMapping("/epicrisis/{epicrisisId}")
    public ResponseEntity<EpicrisisResponse> obtenerEpicrisisPorId(
            @PathVariable UUID epicrisisId
    ) {
        return ResponseEntity.ok(
                epicrisisService.obtenerEpicrisisPorId(epicrisisId)
        );
    }

    @GetMapping("/epicrisis/{epicrisisId}/descargar")
    public ResponseEntity<byte[]> descargarEpicrisis(
            @PathVariable UUID epicrisisId
    ) {
        byte[] archivo = epicrisisService.descargarArchivo(epicrisisId);
        String nombreArchivo = epicrisisService.obtenerNombreArchivo(epicrisisId);
        String tipoArchivo = epicrisisService.obtenerTipoArchivo(epicrisisId);

        MediaType mediaType = MediaType.parseMediaType(tipoArchivo);

        ContentDisposition contentDisposition = ContentDisposition
                .attachment()
                .filename(nombreArchivo, StandardCharsets.UTF_8)
                .build();

        return ResponseEntity.ok()
                .contentType(mediaType)
                .header(HttpHeaders.CONTENT_DISPOSITION, contentDisposition.toString())
                .body(archivo);
    }

    @PutMapping("/epicrisis/{epicrisisId}")
    public ResponseEntity<EpicrisisResponse> actualizarMetadatos(
            @PathVariable UUID epicrisisId,
            @RequestBody EpicrisisUpdateRequest request
    ) {
        return ResponseEntity.ok(
                epicrisisService.actualizarMetadatos(epicrisisId, request)
        );
    }

    @PatchMapping("/epicrisis/{epicrisisId}/desactivar")
    public ResponseEntity<Void> desactivarEpicrisis(
            @PathVariable UUID epicrisisId
    ) {
        epicrisisService.desactivarEpicrisis(epicrisisId);
        return ResponseEntity.noContent().build();
    }
}