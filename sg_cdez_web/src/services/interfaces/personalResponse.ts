export interface ContactoResponse {
    contactoId: number;
    personalNombre: string;
    encargadoNombre: string;
    valor: string;
    tipoValor: string;
    activo: string;
    createdBy: string;
    createdAt: string;
    updatedBy: string;
    updatedAt: string;
}

export interface DocumentoResponse {
    documentoId: number | null;
    adultoId: string;
    nombreArchivo: string;
    tipoArchivo: string;
    tamanoArchivo: number;
    activo: string;
    createdAt: string;
    updatedAt: string;
}

export interface RolResponse {
    id: number;
    nombre: string;
}

export interface PersonalResponse {
    personalId: string;
    rol: RolResponse;
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
    activo: string;
    createdBy: string;
    createdAt: string;
    updatedBy: string;
    updatedAt: string;

    contactos: ContactoResponse[];
    documentos: DocumentoResponse[];
}