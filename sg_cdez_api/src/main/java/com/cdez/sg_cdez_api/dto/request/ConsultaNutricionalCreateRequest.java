package com.cdez.sg_cdez_api.dto.request;

import com.cdez.sg_cdez_api.entity.enums.Apetito;

import java.util.*;

public record ConsultaNutricionalCreateRequest(
        ConsultaCreateRequest consultaGeneral,
        String historiaAlimentaria,
        Apetito apetito,
        String masticacion,
        String deglucion,
        Boolean nauseas,
        Boolean vomitos,
        Boolean distension,
        Boolean gases,
        Boolean reflujo,
        String frecuenciaEvacuaciones,
        String consistenciaBristol,
        String estadoCognitivo,
        List<TamizajeNutricionalCreateRequest> tamizajes,
        List<ExamenLaboratorioCreateRequest> examenesLaboratorio,
        AntropometriaCreateRequest antropometria
) {
}
