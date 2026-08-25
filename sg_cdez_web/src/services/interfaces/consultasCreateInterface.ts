import type { Apetito, TipoTamizaje } from "./consultasDetailsResponse";

export interface ReferenciaCreateRequest {
    receptorId: string;
    mensaje: string;
}

export interface TamizajeNutricionalCreateRequest{
    tipo: TipoTamizaje | null;
    puntaje: number | null;
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

export interface ConsultaCreateRequest{
    adultoId: string;
    tipoConsulta: string;
    motivo: string;
    descripcion: string | null;
    diagnostico: string | null;
    resultadosEvaluaciones: string | null;
    recomendaciones: string | null;
    notas: string | null;
    referencia?: ReferenciaCreateRequest;
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