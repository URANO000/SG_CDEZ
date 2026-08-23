package com.cdez.sg_cdez_api.service;

import com.cdez.sg_cdez_api.dto.request.MedicamentoCreateRequest;
import com.cdez.sg_cdez_api.dto.request.MedicamentoUpdateRequest;
import com.cdez.sg_cdez_api.dto.response.MedicamentoResponse;
import com.cdez.sg_cdez_api.entity.AdultoMayor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public interface MedicamentoService {
    List<MedicamentoResponse> listarMedicamentosPorAdulto(UUID adultoId);
    List<MedicamentoResponse> crearMedicamentos(List<MedicamentoCreateRequest> requests, UUID adultoId);
    List<MedicamentoResponse> actualizarMedicamentos(List<MedicamentoUpdateRequest> requests, UUID adultoId);
    void desactivarMedicamentos(List<UUID> medicamentos);
}
