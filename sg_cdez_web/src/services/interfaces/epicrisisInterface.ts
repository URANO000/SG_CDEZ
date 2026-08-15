export interface EpicrisisResponse {
  epicrisisId: string;
  documentoId: number;
  adultoId: string;
  fechaEmision: string;
  fechaRecepcion: string | null;
  centroSalud: string;
  nombreArchivo: string;
  tipoArchivo: string;
  tamanoArchivo: number;
  vigente: boolean;
  activo: boolean;
  createdAt: string;
  updatedAt: string | null;
}
