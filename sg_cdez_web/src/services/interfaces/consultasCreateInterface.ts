import type { BigDecimal } from "bigdecimal.js";
import type { Apetito, TipoTamizaje } from "./consultasDetailsResponse";

export interface TamizajeNutricionalCreateRequest{
    tipo: TipoTamizaje | null;
    puntaje: BigDecimal | null;
    resultado: string | null;
    observaciones: string | null;
}

export interface ExamenLaboratorioCreateRequest{
    nombre: string | null;
    valor: string | null;
    unidad: string | null;
    fecha: string | null;
    observaciones: string | null;
}

export interface AntropometriaCreateRequest {
    pesoActual: BigDecimal;
    pesoHabitual: BigDecimal;
    pesoHace6Meses: BigDecimal;
    talla: BigDecimal;
    alturaEstimada: BigDecimal;
    imc: BigDecimal;
    circunferenciaPantorrilla: BigDecimal;
    circunferenciaBraquial: BigDecimal;
    circunferenciaCintura: BigDecimal;
    perdidaPesoPorcentaje: BigDecimal;
}

export interface ConsultaCreateRequest{
    adultoId: string;
    tipoConsulta: string;
    motivo: string;
    descripcion: string | null;
    diagnostico: string | null;
    resultadosEvaluaciones: string | null;
    recomendaciones: string | null;
    notas: string | null;
}

export interface ConsultaNutricionalCreateRequest{
    consultaGeneral: ConsultaCreateRequest;
    historiaAlimentaria: string | null;
    apetito: Apetito | null;
    masticacion: string | null;
    deglucion: string | null;
    nauseas: boolean;
    vomitos: boolean;
    distension: boolean;
    gases: boolean;
    reflujo: boolean | null;
    frecuenciaEvacuaciones: string;
    consistenciaBristol: string;
    estadoCognitivo: string;
    tamizajes: TamizajeNutricionalCreateRequest[];
    examenesLaboratorio: ExamenLaboratorioCreateRequest[];
    antropometria: AntropometriaCreateRequest;
}