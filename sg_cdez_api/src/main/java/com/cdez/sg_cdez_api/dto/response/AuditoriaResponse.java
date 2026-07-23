package com.cdez.sg_cdez_api.dto.response;

import java.time.LocalDateTime;
import java.util.UUID;

public record AuditoriaResponse(
        UUID auditoriaId,
        UUID usuarioId,
        String usuario,
        String nombreUsuario,
        String accion,
        String modulo,
        String entidadAfectada,
        String registroAfectadoId,
        String descripcion,
        LocalDateTime createdAt
) {
}