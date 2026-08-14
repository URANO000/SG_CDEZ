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

export interface PersonalResponse {
    personalId: string;
    rol: string;
    especialidad: string;
    tipoIdentificacion: string;
    identificacion: string;
    nombreCompleto: string;
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