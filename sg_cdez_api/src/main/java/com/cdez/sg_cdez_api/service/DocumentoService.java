package com.cdez.sg_cdez_api.service;

import com.cdez.sg_cdez_api.dto.response.DocumentoResponse;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

public interface DocumentoService {

    DocumentoResponse registrarDocumentoExpediente(UUID adultoId, MultipartFile archivo);

    List<DocumentoResponse> listarDocumentosPorAdulto(UUID adultoId);

    DocumentoResponse obtenerDocumentoPorId(Integer documentoId);

    byte[] descargarArchivo(Integer documentoId);

    String obtenerNombreArchivo(Integer documentoId);

    String obtenerTipoArchivo(Integer documentoId);

    void desactivarDocumento(Integer documentoId);
}