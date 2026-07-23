package com.cdez.sg_cdez_api.service;

import com.cdez.sg_cdez_api.dto.request.AuditoriaFiltroRequest;
import com.cdez.sg_cdez_api.dto.response.AuditoriaResponse;

import java.util.List;

public interface AuditoriaService {

    void registrarAccion(
            String accion,
            String modulo,
            String entidadAfectada,
            String registroAfectadoId,
            String descripcion
    );

    List<AuditoriaResponse> consultarAuditorias(AuditoriaFiltroRequest filtro);
}