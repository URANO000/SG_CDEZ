export type EstadoAdultoMayor = "ACTIVO" | "INACTIVO" | "FALLECIDO";

export const ESCOLARIDADES = [
  "Sin escolaridad",
  "Primaria completa",
  "Secundaria completa",
  "Técnico",
  "Universidad completa",
] as const;

export interface AdultoMayorCreateRequest {
  tipoIdentificacion: string;
  identificacion: string;
  primerNombre: string;
  segundoNombre: string | null;
  primerApellido: string;
  segundoApellido: string | null;
  nacionalidad: string;
  fechaNacimiento: string | null;
  sexo: "F" | "M";
  direccion: string;
  escolaridad: string;
  grupoFamiliar: string | null;

  estadoCivil: string | null;
  gradoDependencia: string | null;
  cuotaMensual: number;

  pension: boolean;
  tipoPension: string | null;
  montoPension: number | null;

  funcionalidadFisica: string | null;
  ayudaBiomecanica: boolean;
  fechaIngreso: string;
}

export interface AdultoMayorUpdateRequest {
  direccion: string;
  escolaridad: string;
  grupoFamiliar: string | null;

  estadoCivil: string | null;
  gradoDependencia: string | null;
  cuotaMensual: number;

  pension: boolean;
  tipoPension: string | null;
  montoPension: number | null;

  funcionalidadFisica: string | null;
  ayudaBiomecanica: boolean;
}

export interface AdultoMayorFiltro {
  searchTerm: string | null;
  estado: EstadoAdultoMayor;
}

export interface AdultoMayorResponse {
  adultoId: string;
  tipoIdentificacion: string;
  identificacion: string;
  nombreCompleto: string;
  nacionalidad: string;
  fechaNacimiento: string | null;
  sexo: string;
  direccion: string;
  escolaridad: string;
  grupoFamiliar: string | null;

  estadoCivil: string | null;
  gradoDependencia: string | null;
  cuotaMensual: number;

  pension: boolean;
  tipoPension: string | null;
  montoPension: number | null;

  funcionalidadFisica: string | null;
  ayudaBiomecanica: boolean;
  fechaIngreso: string;
  activo: "Activo" | "Inactivo";
}

export interface AdultoMayorDesactivarRequest {
  fechaRetiro: string;
  motivoRetiro: string;
}

export interface AdultoMayorFallecimientoRequest {
  fechaFallecimiento: string;
  motivoRetiro: string;
}
