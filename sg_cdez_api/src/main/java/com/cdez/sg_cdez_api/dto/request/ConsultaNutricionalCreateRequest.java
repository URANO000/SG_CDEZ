package com.cdez.sg_cdez_api.dto.request;

import com.cdez.sg_cdez_api.entity.enums.Apetito;

import java.util.*;

public record ConsultaNutricionalCreateRequest(
        ConsultaCreateRequest consultaGeneral,
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
        List<TamizajeNutricionalCreateRequest> tamizajes,
        List<ExamenLaboratorioCreateRequest> examenesLaboratorio,
        AntropometriaCreateRequest antropometria
) {
}
