import type { ContactoResponse } from "./personalResponse";
import type { ContactoCreateRequest } from "./personalCreateRequest";

export interface EncargadoLegalResponse {
  encargadoId: string;
  tipoIdentificacion: string;
  identificacion: string;
  primerNombre: string;
  segundoNombre: string | null;
  primerApellido: string;
  segundoApellido: string | null;
  direccion: string;
  activo: boolean;
  contactos: ContactoResponse[];
}

export interface EncargadoLegalCreateRequest {
  tipoIdentificacion: string;
  identificacion: string;
  primerNombre: string;
  segundoNombre: string | null;
  primerApellido: string;
  segundoApellido: string | null;
  direccion: string;
  contactos: ContactoCreateRequest[];
}
