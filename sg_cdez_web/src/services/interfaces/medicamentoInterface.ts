export type TipoMedicamento =
  | "MEDICAMENTO"
  | "VITAMINA"
  | "SUPLEMENTO"
  | "PRODUCTO_NATURAL";

export const TIPOS_MEDICAMENTO = [
  {
    value: "MEDICAMENTO",
    label: "Medicamento",
  },
  {
    value: "VITAMINA",
    label: "Vitamina",
  },
  {
    value: "SUPLEMENTO",
    label: "Suplemento",
  },
  {
    value: "PRODUCTO_NATURAL",
    label: "Producto natural",
  },
] as const;

export interface MedicamentoCreateRequest {
  nombre: string;
  dosis: string | null;
  horario: string | null;
  tipo: TipoMedicamento;
  observaciones: string | null;
}

export interface MedicamentoResponse {
  medicamentoId: string;
  adultoMayorNombre: string;
  nombre: string;
  dosis: string | null;
  horario: string | null;
  tipo: TipoMedicamento;
  observaciones: string | null;
  createdById: string;
  createdBy: string;
  createdAt: string;
  updatedBy: string | null;
  updatedAt: string | null;
}

export interface MedicamentoUpdateRequest {
  medicamentoId: string;
  adultoMayorNombre: string;
  nombre: string;
  dosis: string | null;
  horario: string | null;
  tipo: TipoMedicamento;
  observaciones: string | null;
}
