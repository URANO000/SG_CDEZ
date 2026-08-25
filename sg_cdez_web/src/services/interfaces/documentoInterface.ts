export interface DocumentoResponse {
  documentoId: number;
  adultoId: string | null;
  nombreArchivo: string;
  tipoArchivo: string;
  tamanoArchivo: number;
  activo: string;
  createdAt: string;
  updatedAt: string | null;
}
