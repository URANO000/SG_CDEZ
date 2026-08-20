package com.cdez.sg_cdez_api.dto.request;

import com.cdez.sg_cdez_api.entity.enums.Apetito;

import java.util.List;
import java.util.UUID;

public record ConsultaNutricionalUpdateRequest(
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
        List<TamizajeNutricionalUpdateRequest> tamizajes,
        List<ExamenLaboratorioUpdateRequest> examenesLaboratorio,
        AntropometriaUpdateRequest antropometria

) {
}
