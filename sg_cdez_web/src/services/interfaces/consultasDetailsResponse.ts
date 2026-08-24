import {BigDecimal} from 'bigdecimal.js';
export type Apetito = "BUENO" | "REGULAR" | "MALO";
export type TipoTamizaje = "MNA" | "SARC_F" | "MUST" | "NRS";

export interface TamizajeResponse {
    tamizajeId: string;
    tipo: TipoTamizaje;
    puntaje: BigDecimal;
    resultado: string;
    observaciones: string;
}

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
    pesoActual: BigDecimal;
    pesoHabitual: BigDecimal;
    pesoHace6Meses: BigDecimal;
    talla: BigDecimal;
    alturaEstimada: BigDecimal;
    imc: BigDecimal;
    circumferenciaPantorrilla: BigDecimal;
    circumferenciaBraquial: BigDecimal;
    circumferenciaCintura: BigDecimal;
    perdidaPesoPorcentaje: BigDecimal;
}

export interface ConsultaNutricionalDetailResponse {
    consultaNutricionalId : string;
    historiaAlimentaria: string;
    apetito: Apetito;
    masticacion: string;
    deglucion: string;
    nauseas: boolean;
    vomitos: boolean;
    distencion: boolean;
    gases: boolean;
    reflujo: boolean;
    frecuenciaEvaluaciones: string;
    estadoCognitivo: string;
    tamizajes: TamizajeResponse[];
    examenesLaboratorio: ExamenLaboratorioResponse[];
    antropometria: AntropometriaResponse
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
    consultaId : string;
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
}