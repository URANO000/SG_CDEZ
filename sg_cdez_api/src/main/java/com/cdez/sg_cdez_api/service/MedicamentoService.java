package com.cdez.sg_cdez_api.service;

import com.cdez.sg_cdez_api.dto.request.MedicamentoCreateRequest;
import com.cdez.sg_cdez_api.dto.request.MedicamentoUpdateRequest;
import com.cdez.sg_cdez_api.dto.response.MedicamentoResponse;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public interface MedicamentoService {
    List<MedicamentoResponse> listarMedicamentosPorAdulto(UUID adultoId);
    MedicamentoResponse crearMedicamentos(MedicamentoCreateRequest request, UUID adultoId);
    MedicamentoResponse actualizarMedicamentos(MedicamentoUpdateRequest request, UUID adultoId);
    void desactivarMedicamentos(UUID medicamentos);
    void activarMedicamentos(UUID medicamentos);
}
