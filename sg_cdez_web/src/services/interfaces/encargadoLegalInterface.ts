import type { ContactoResponse } from "./personalResponse";

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
