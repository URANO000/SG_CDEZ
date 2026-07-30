package com.cdez.sg_cdez_api.service;

import com.cdez.sg_cdez_api.dto.request.AuditoriaFiltroRequest;
import com.cdez.sg_cdez_api.dto.response.AuditoriaResponse;

import java.util.List;
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
    List<AuditoriaResponse> consultarAuditorias(AuditoriaFiltroRequest filtro);
}