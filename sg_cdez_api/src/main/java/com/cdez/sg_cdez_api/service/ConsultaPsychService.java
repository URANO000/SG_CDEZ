package com.cdez.sg_cdez_api.service;

import com.cdez.sg_cdez_api.dto.request.ConsultaPsychActualizarRequest;
import com.cdez.sg_cdez_api.dto.request.ConsultaPsychCreateRequest;

import java.util.UUID;

public interface ConsultaPsychService {
    void crearConsultaPsych(ConsultaPsychCreateRequest request);
    void actualizarConsultaPsych(UUID id, ConsultaPsychActualizarRequest request);
    void desactivarConsultaPsych(UUID id);
}
