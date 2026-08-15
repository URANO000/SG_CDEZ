export interface ContactoCreateRequest{
    valor: string;
    tipoValor: string;
}

export interface PersonalCreateRequest{
    rol:number;
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

    contactos: ContactoCreateRequest[];
}
