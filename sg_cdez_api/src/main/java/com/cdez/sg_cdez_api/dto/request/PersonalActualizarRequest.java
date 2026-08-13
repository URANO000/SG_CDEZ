package com.cdez.sg_cdez_api.dto.request;

import com.cdez.sg_cdez_api.dto.response.ContactoResponse;
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

        List<ContactoResponse> contactos,
        List<MultipartFile> documentos
) {
}
