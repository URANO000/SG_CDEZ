package com.cdez.sg_cdez_api.dto.request;

import jakarta.validation.constraints.NotEmpty;

import java.util.UUID;

public record ConsultaCreateRequest(
        @NotEmpty(message = "Adulto Mayor correspondiente a consulta no puede estar vacío.")
        UUID adultoId,
        @NotEmpty(message = "Tipo de consulta no puede estar vacía.")
        String tipoConsulta,
        @NotEmpty(message = "Motivo de la consulta no puede estar vacío.")
        String motivo,
        String descripcion,
        String diagnostico,
        String resultadosEvaluaciones,
        String recomendaciones,
        String notas
) {
}
