package com.cdez.sg_cdez_api.dto.request;

public record ExamenLaboratorioCreateRequest(
        String nombre,
        String valor,
        String unidad,
        String fecha,
        String observaciones
) {
}
