package com.cdez.sg_cdez_api.dto.request;

import com.cdez.sg_cdez_api.entity.enums.TipoMedicamento;

import java.util.UUID;

public record MedicamentoUpdateRequest(
        UUID medicamentoId,
        String adultoMayorNombre,
        String nombre,
        String dosis,
        String horario,
        TipoMedicamento tipo,
        String observaciones
) {
}
