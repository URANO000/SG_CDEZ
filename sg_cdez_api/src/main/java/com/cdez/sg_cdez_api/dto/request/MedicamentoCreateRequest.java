package com.cdez.sg_cdez_api.dto.request;

import com.cdez.sg_cdez_api.entity.enums.TipoMedicamento;

public record MedicamentoCreateRequest(
        String nombre,
        String dosis,
        String horario,
        TipoMedicamento tipo,
        String observaciones
) {
}
