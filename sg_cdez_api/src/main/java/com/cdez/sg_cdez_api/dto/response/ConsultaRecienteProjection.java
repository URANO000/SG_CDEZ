package com.cdez.sg_cdez_api.dto.response;

import java.time.LocalDateTime;
import java.util.UUID;

public interface ConsultaRecienteProjection {
    UUID getConsultaId();

    UUID getAdultoId();

    String getPrimerNombre();

    String getSegundoNombre();

    String getPrimerApellido();

    String getSegundoApellido();

    String getTipoConsulta();

    String getMotivo();

    LocalDateTime getFecha();
}
