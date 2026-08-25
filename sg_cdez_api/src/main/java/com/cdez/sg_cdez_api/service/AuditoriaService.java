package com.cdez.sg_cdez_api.service;

import com.cdez.sg_cdez_api.dto.request.AuditoriaFiltroRequest;
import com.cdez.sg_cdez_api.dto.response.AuditoriaResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Map;

public interface AuditoriaService {

    void registrarAccion(
            String accion,
            String modulo,
            String entidadAfectada,
            String registroAfectadoId,
            String descripcion
    );

    void registrarAccion(
            String accion,
            String modulo,
            String entidadAfectada,
            String registroAfectadoId,
            String descripcion,
            Map<String, Object> cambios
    );

    Page<AuditoriaResponse> consultarAuditorias(
            AuditoriaFiltroRequest filtro,
            Pageable pageable
    );
}