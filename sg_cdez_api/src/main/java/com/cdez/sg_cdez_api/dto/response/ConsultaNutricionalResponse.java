package com.cdez.sg_cdez_api.dto.response;

import com.cdez.sg_cdez_api.dto.request.*;
import com.cdez.sg_cdez_api.entity.enums.Apetito;

import java.time.LocalDateTime;
import java.util.*;

public record ConsultaNutricionalResponse(
        UUID consultaNutricionalId,
        AdultoMayorConsultaResponse adultoMayor,
        ConsultaResponse consultaGeneral,
        String historiaAlimentaria,
        Apetito apetito,
        String masticacion,
        String deglucion,
        boolean nauseas,
        boolean vomitos,
        boolean distension,
        boolean gases,
        boolean reflujo,
        String frecuenciaEvacuaciones,
        String consistenciaBristol,
        String estadoCognitivo,
        List<TamizajeNutricionalCreateRequest> tamizajes,
        List<ExamenLaboratorioCreateRequest> examenesLaboratorio,
        AntropometriaCreateRequest antropometria,
        PersonalConsultaResponse createdBy,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}
