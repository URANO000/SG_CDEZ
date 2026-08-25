package com.cdez.sg_cdez_api.service;

import com.cdez.sg_cdez_api.dto.request.PerfilActualizarRequest;
import com.cdez.sg_cdez_api.dto.response.PerfilResponse;

public interface PerfilService {

    PerfilResponse obtenerPerfil();

    PerfilResponse actualizarPerfil(PerfilActualizarRequest request);
}