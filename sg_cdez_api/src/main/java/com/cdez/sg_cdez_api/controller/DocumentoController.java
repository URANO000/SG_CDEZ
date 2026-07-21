package com.cdez.sg_cdez_api.controller;

import com.cdez.sg_cdez_api.dto.response.DocumentoResponse;
import com.cdez.sg_cdez_api.service.DocumentoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class DocumentoController {

    private final DocumentoService documentoService;

    @PostMapping(
            value = "/adultos-mayores/{adultoId}/documentos",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<DocumentoResponse> registrarDocumentoExpediente(
            @PathVariable UUID adultoId,
            @RequestParam("archivo") MultipartFile archivo
    ) {
        DocumentoResponse response = documentoService.registrarDocumentoExpediente(
                adultoId,
                archivo
        );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/adultos-mayores/{adultoId}/documentos")
    public ResponseEntity<List<DocumentoResponse>> listarDocumentosPorAdulto(
            @PathVariable UUID adultoId
    ) {
        return ResponseEntity.ok(
                documentoService.listarDocumentosPorAdulto(adultoId)
        );
    }

    @GetMapping("/documentos/{documentoId}")
    public ResponseEntity<DocumentoResponse> obtenerDocumentoPorId(
            @PathVariable Integer documentoId
    ) {
        return ResponseEntity.ok(
                documentoService.obtenerDocumentoPorId(documentoId)
        );
    }

    @GetMapping("/documentos/{documentoId}/descargar")
    public ResponseEntity<byte[]> descargarDocumento(
            @PathVariable Integer documentoId
    ) {
        byte[] archivo = documentoService.descargarArchivo(documentoId);
        String nombreArchivo = documentoService.obtenerNombreArchivo(documentoId);
        String tipoArchivo = documentoService.obtenerTipoArchivo(documentoId);

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

    @PatchMapping("/documentos/{documentoId}/desactivar")
    public ResponseEntity<Void> desactivarDocumento(
            @PathVariable Integer documentoId
    ) {
        documentoService.desactivarDocumento(documentoId);
        return ResponseEntity.noContent().build();
    }
}