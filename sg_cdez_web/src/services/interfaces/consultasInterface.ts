
export interface ConsultaNutricionalPageResponse {
    consultaNutricionalId : string;
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

export interface ConsultaPageResponse {
    consultaId : string;
    adultoMayor: AdultoMayorConsultaResponse;
    tipoConsulta: string;
    activo: string;
    createdBy: PersonalConsultaResponse;
    createdAt: string;
    updatedAt: string;
    consultaNutricional: ConsultaNutricionalPageResponse;
}

export interface ConsultaFiltro {
    searchTerm: string | null;
    personalView: boolean;
    especialidad: string | null;
}