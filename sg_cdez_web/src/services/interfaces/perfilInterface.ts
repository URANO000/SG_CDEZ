import type { ContactoCreateRequest } from "./personalCreateRequest";
import type { ContactoResponse } from "./personalResponse";
import type { ContactoUpdateRequest } from "./personalUpdateRequest";

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
  contactos: ContactoResponse[];
}

export interface PerfilActualizarRequest {
  direccion: string;
  contactosActualizar: ContactoUpdateRequest[];
  contactosDesactivar: number[];
  contactosCrear: ContactoCreateRequest[];
}