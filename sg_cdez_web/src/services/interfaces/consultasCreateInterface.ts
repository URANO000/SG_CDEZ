import type { Apetito, TipoTamizajeNutricional, TipoTamizajePsych } from "./consultasDetailsResponse";

export interface ReferenciaCreateRequest {
  receptorId: string;
  mensaje: string | null;
}

interface TamizajeBaseCreateRequest {
  resultado: string | null;
  observaciones: string | null;
}

export interface TamizajeNutricionalCreateRequest
  extends TamizajeBaseCreateRequest {
  tipo: TipoTamizajeNutricional;
  puntaje: number;
}

export interface TamizajePsychCreateRequest
  extends TamizajeBaseCreateRequest {
  tipo: TipoTamizajePsych;
  puntaje: null;
}

export type TamizajeCreateRequest =
  | TamizajeNutricionalCreateRequest
  | TamizajePsychCreateRequest;

export interface ExamenLaboratorioCreateRequest {
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

export interface ConsultaCreateRequest {
  adultoId: string;
  tipoConsulta: string;
  motivo: string;
  descripcion: string | null;
  diagnostico: string | null;
  resultadosEvaluaciones: string | null;
  recomendaciones: string | null;
  notas: string | null;
  referencia: ReferenciaCreateRequest | null;
}

export interface ConsultaNutricionalCreateRequest {
  consultaGeneral: ConsultaCreateRequest;
  historiaAlimentaria: string | null;
  apetito: Apetito | null;
  masticacion: string | null;
  deglucion: string | null;
  nauseas: boolean;
  vomitos: boolean;
  distension: boolean;
  diarrea: boolean;
  estrenimiento: boolean;
  gases: boolean;
  reflujo: boolean;
  frecuenciaEvacuaciones: string | null;
  consistenciaBristol: string | null;
  estadoCognitivo: string | null;
  tamizajes: TamizajeNutricionalCreateRequest[];
  examenesLaboratorio: ExamenLaboratorioCreateRequest[];
  antropometria: AntropometriaCreateRequest;
}

export interface ConsultaPsychCreateRequest {
  consultaGeneral: ConsultaCreateRequest;
  tamizajes: TamizajePsychCreateRequest[];
}