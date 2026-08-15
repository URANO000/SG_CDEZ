export type EstadoAdultoMayor = "activos" | "inactivos" | "fallecidos";

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
  pension: boolean;
  funcionalidadFisica: string | null;
  ayudaBiomecanica: boolean;
  fechaIngreso: string;
  activo: "Activo" | "Inactivo";
}

export interface AdultoMayorDesactivarRequest {
  fechaRetiro: string;
  motivoRetiro: string;
}
