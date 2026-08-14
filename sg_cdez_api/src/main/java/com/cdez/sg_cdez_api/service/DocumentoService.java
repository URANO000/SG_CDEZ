package com.cdez.sg_cdez_api.service;

import com.cdez.sg_cdez_api.dto.response.DocumentoResponse;
import com.cdez.sg_cdez_api.entity.Personal;
import org.springframework.security.core.parameters.P;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

public interface DocumentoService {

    DocumentoResponse registrarDocumentoExpediente(UUID adultoId, MultipartFile archivo);

    void registrarDocumentoPersonal(List<MultipartFile> archivos,Personal personal) throws IOException;

    List<DocumentoResponse> listarDocumentosPorAdulto(UUID adultoId);

    List<DocumentoResponse> listarDocumentosPorPersonal(Personal personal);

    DocumentoResponse obtenerDocumentoPorId(Integer documentoId);

    byte[] descargarArchivo(Integer documentoId);

    String obtenerNombreArchivo(Integer documentoId);

    String obtenerTipoArchivo(Integer documentoId);

    void desactivarDocumento(Integer documentoId);

    void desactivarDocumentosPersonal(List<Integer> documentos,Personal personal);
}