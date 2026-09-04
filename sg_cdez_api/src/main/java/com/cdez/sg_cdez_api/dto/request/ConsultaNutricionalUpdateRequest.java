package com.cdez.sg_cdez_api.dto.request;

import com.cdez.sg_cdez_api.entity.enums.Apetito;

import java.util.List;

public record ConsultaNutricionalUpdateRequest(
        ConsultaUpdateRequest consulta,
        String historiaAlimentaria,
        Apetito apetito,
        String masticacion,
        String deglucion,
        boolean nauseas,
        boolean vomitos,
        boolean distension,
        boolean gases,
        boolean reflujo,
        boolean diarrea,
        boolean estrenimiento,
        String frecuenciaEvacuaciones,
        String consistenciaBristol,
        String estadoCognitivo,
        List<TamizajeUpdateRequest> tamizajes,
        List<ExamenLaboratorioUpdateRequest> examenesLaboratorio,
        AntropometriaUpdateRequest antropometria

) {
}
