import type { Apetito, TipoTamizajeNutricional, TipoTamizajePsych } from "./consultasDetailsResponse";

export interface ConsultaUpdateRequest {
    tipoConsulta: string;
    motivo: string;
    descripcion: string | null;
    diagnostico: string | null;
    resultadosEvaluaciones: string | null;
    recomendaciones: string | null;
    notas: string | null;
}

export interface TamizajeNutricionalUpdateRequest {
    tamizajeId: string;
    tipo: TipoTamizajeNutricional | null;
    puntaje: number | null;
    resultado: string | null;
    observaciones: string | null;
}

export interface TamizajePsychUpdateRequest {
    tamizajeId: string;
    tipo: TipoTamizajePsych | null;
    puntaje: null;
    resultado: string | null;
    observaciones: string | null;
}

export interface ExamenLaboratorioUpdateRequest {
    examenId: string;
    nombre: string | null;
    valor: string | null;
    unidad: string | null;
    fecha: string | null;
    observaciones: string | null;
}

export interface AntropometriaUpdateRequest {
    antropometriaId: string;
    pesoActual: number;
    pesoHabitual: number;
    pesoHace6Meses: number;
    talla: number;
    alturaEstimada: number;
    imc: number;
    circunferenciaPantorrilla: number;
    circunferenciaBraquial: number;
    circunferenciaCintura: number;
    perdidaPesoPorcentaje: number;
}

export interface ConsultaNutricionalUpdateRequest {
    consulta: ConsultaUpdateRequest;
    historiaAlimentaria: string | null;
    apetito: Apetito | null;
    masticacion: string | null;
    deglucion: string | null;
    nauseas: boolean;
    vomitos: boolean;
    distension: boolean;
    gases: boolean;
    reflujo: boolean;
    diarrea: boolean;
    estrenimiento: boolean;
    frecuenciaEvacuaciones: string;
    consistenciaBristol: string;
    estadoCognitivo: string;
    tamizajes: TamizajeNutricionalUpdateRequest[];
    examenesLaboratorio: ExamenLaboratorioUpdateRequest[];
    antropometria: AntropometriaUpdateRequest;

}

export interface ConsultaPsychActualizarRequest {
    consulta: ConsultaUpdateRequest;
    tamizajes: TamizajePsychUpdateRequest[];
}