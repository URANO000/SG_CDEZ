export interface PerfilResponse {
  personalId: string;
  nombreCompleto: string;
  rol: string;
  especialidad: string;
  tipoIdentificacion: string;
  identificacion: string;
  direccion: string;
  carnet: string | null;
  correo: string;
  estado: string;
}

export interface PerfilActualizarRequest {
  direccion: string;
}
