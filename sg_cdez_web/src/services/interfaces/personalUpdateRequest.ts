import type { ContactoCreateRequest } from "./personalCreateRequest";

export interface ContactoUpdateRequest{
    contactoId: number;
    valor: string;
    tipoValor: string;
}

export interface PersonalActualizarRequest{
    rol: number;
    especialidad: string;
    tipoIdentificacion: string;
    identificacion: string;
    primerNombre: string;
    segundoNombre: string;
    primerApellido: string;
    segundoApellido: string;
    direccion: string;
    carnet: string;
    usuario: string;

    contactosActualizar: ContactoUpdateRequest[];
    contactosDesactivar: number[];
    contactosCrear: ContactoCreateRequest[];

    documentosDesactivar: number[];
}