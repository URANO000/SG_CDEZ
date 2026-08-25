package com.cdez.sg_cdez_api.service;

import com.cdez.sg_cdez_api.dto.request.EncargadoLegalRequest;
import com.cdez.sg_cdez_api.dto.request.EncargadoLegalUpdateRequest;
import com.cdez.sg_cdez_api.dto.response.EncargadoLegalResponse;
import com.cdez.sg_cdez_api.entity.EncargadoLegal;

import java.util.List;
import java.util.UUID;

public interface EncargadoLegalService {

    EncargadoLegalResponse registrarEncargado(UUID adultoId, EncargadoLegalRequest request);

    List<EncargadoLegalResponse> listarEncargadosPorAdulto(UUID adultoId);

    EncargadoLegalResponse obtenerEncargadoPorId(UUID encargadoId);

    EncargadoLegalResponse actualizarEncargado(UUID encargadoId, EncargadoLegalUpdateRequest request);

    EncargadoLegalResponse desactivarEncargado(UUID encargadoId);

    EncargadoLegal obtenerEncargadoCheck(UUID encargadoId);
}