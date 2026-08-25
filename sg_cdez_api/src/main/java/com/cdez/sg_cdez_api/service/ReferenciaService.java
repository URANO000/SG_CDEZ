package com.cdez.sg_cdez_api.service;

import com.cdez.sg_cdez_api.dto.request.ReferenciaCreateRequest;
import com.cdez.sg_cdez_api.entity.Consulta;
import org.springframework.stereotype.Service;

@Service
public interface ReferenciaService {
    void crearReferencia(Consulta consulta, ReferenciaCreateRequest request);
}
