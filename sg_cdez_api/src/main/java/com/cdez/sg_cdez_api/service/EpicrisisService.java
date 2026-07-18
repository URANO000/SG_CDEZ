package com.cdez.sg_cdez_api.service;

import com.cdez.sg_cdez_api.dto.request.EpicrisisUpdateRequest;
import com.cdez.sg_cdez_api.dto.response.EpicrisisResponse;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public interface EpicrisisService {

    EpicrisisResponse registrarEpicrisis(
            UUID adultoId,
            LocalDateTime fechaEmision,
            LocalDateTime fechaRecepcion,
            String centroSalud,
            MultipartFile archivo
    );

    List<EpicrisisResponse> listarEpicrisisPorAdulto(UUID adultoId);

    EpicrisisResponse obtenerEpicrisisPorId(UUID epicrisisId);

    EpicrisisResponse obtenerEpicrisisVigente(UUID adultoId);

    byte[] descargarArchivo(UUID epicrisisId);

    String obtenerNombreArchivo(UUID epicrisisId);

    String obtenerTipoArchivo(UUID epicrisisId);

    EpicrisisResponse actualizarMetadatos(UUID epicrisisId, EpicrisisUpdateRequest request);

    void desactivarEpicrisis(UUID epicrisisId);
}