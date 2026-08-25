package com.cdez.sg_cdez_api.dto.response;

import com.cdez.sg_cdez_api.entity.enums.Apetito;

import java.util.*;

public record ConsultaNutricionalDetailResponse(
        UUID consultaNutricionalId,
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
        List<TamizajeResponse> tamizajes,
        List<ExamenLaboratorioResponse> examenesLaboratorio,
        AntropometriaResponse antropometria
) {
}
