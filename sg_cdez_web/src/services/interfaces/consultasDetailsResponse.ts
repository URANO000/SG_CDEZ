export type Apetito = "BUENO" | "REGULAR" | "MALO";
export const TIPOS_TAMIZAJE = {
    NUTRICION: ["MNA", "SARC_F", "MUST", "NRS"],
    PSICOLOGIA: ["COGNITIVO", "ANSIEDAD", "OTROS"],
} as const;

export type EspecialidadTamizaje = keyof typeof TIPOS_TAMIZAJE;

export type TipoTamizajeNutricional =
    (typeof TIPOS_TAMIZAJE.NUTRICION)[number];

export type TipoTamizajePsych =
    (typeof TIPOS_TAMIZAJE.PSICOLOGIA)[number];

export type TipoTamizaje =
    | TipoTamizajeNutricional
    | TipoTamizajePsych;

interface TamizajeBaseResponse {
    tamizajeId: string;
    resultado: string | null;
    observaciones: string | null;
}


export interface TamizajeNutricionalResponse
  extends TamizajeBaseResponse {
  tipo: TipoTamizajeNutricional;
  puntaje: number;
}


export interface TamizajePsychResponse
    extends TamizajeBaseResponse {
    tipo: TipoTamizajePsych;
    puntaje: null;
}

export type TamizajeResponse =
  | TamizajeNutricionalResponse
  | TamizajePsychResponse;


export interface ExamenLaboratorioResponse {
    examenId: string;
    nombre: string;
    valor: string;
    unidad: string;
    fecha: string;
    observaciones: string;
}

export interface AntropometriaResponse {
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

export interface ConsultaNutricionalDetailResponse {
    consultaNutricionalId: string;
    historiaAlimentaria: string;
    apetito: Apetito;
    masticacion: string;
    deglucion: string;
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
    tamizajes: TamizajeNutricionalResponse[];
    examenesLaboratorio: ExamenLaboratorioResponse[];
    antropometria: AntropometriaResponse
}

export interface ConsultaPsychDetailResponse {
    consultaPsychId: string;
    tamizajes: TamizajePsychResponse[];
}

export interface AdultoMayorConsultaResponse {
    adultoId: string;
    tipoIdentificacion: string;
    identificacion: string;
    nombreCompleto: string;
    fechaNacimiento: string;
}

export interface PersonalConsultaResponse {
    personalId: string;
    usuario: string;
    nombreCompleto: string;
    especialidad: string;
}

export interface ConsultaDetailResponse {
    consultaId: string;
    adultoMayor: AdultoMayorConsultaResponse;
    motivo: string;
    tipoConsulta: string;
    descripcion: string;
    diagnostico: string;
    resultadosEvaluaciones: string;
    recomendaciones: string;
    notas: string;
    activo: string;
    createdBy: PersonalConsultaResponse;
    createdAt: string;
    updatedAt: string;
    consultaNutricional: ConsultaNutricionalDetailResponse | null;
    consultaPsych: ConsultaPsychDetailResponse | null;
}