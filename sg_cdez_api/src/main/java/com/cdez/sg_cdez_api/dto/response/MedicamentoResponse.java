package com.cdez.sg_cdez_api.dto.response;

import com.cdez.sg_cdez_api.entity.enums.TipoMedicamento;

import java.time.LocalDateTime;
import java.util.UUID;

public record MedicamentoResponse(
        UUID medicamentoId,
        String adultoMayorNombre,
        String nombre,
        String dosis,
        String horario,
        TipoMedicamento tipo,
        String observaciones,
        UUID createdById,
        String createdBy,
        LocalDateTime createdAt,
        String updatedBy,
        LocalDateTime updatedAt
) {
}
