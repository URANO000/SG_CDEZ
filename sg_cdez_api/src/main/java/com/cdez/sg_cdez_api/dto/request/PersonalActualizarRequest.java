package com.cdez.sg_cdez_api.dto.request;

import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;

public record PersonalActualizarRequest(
        int rol,
        String especialidad,
        String tipoIdentificacion,
        String identificacion,
        String primerNombre,
        String segundoNombre,
        String primerApellido,
        String segundoApellido,
        String direccion,
        String carnet,
        String usuario,
        LocalDateTime updatedAt,

        List<ContactoUpdateRequest> contactosActualizar,
        List<Integer> contactosDesactivar,
        List<ContactoCreateRequest> contactosCrear,
        List<Integer> documentosDesactivar,
        List<MultipartFile> documentosCrear
) {
}
