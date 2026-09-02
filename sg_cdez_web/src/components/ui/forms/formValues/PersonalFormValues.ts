export interface PersonalFormContacto {
    contactoId?: number;
    tipoValor: string;
    valor: string;
}

export interface PersonalFormValues {
    primerNombre: string;
    segundoNombre: string;
    primerApellido: string;
    segundoApellido: string;
    tipoIdentificacion: string;
    identificacion: string;
    carnet: string;
    direccion: string;
    usuario: string;
    rol: string;
    especialidad: string;
    contactos: PersonalFormContacto[];
}

export const emptyPersonalFormValues: PersonalFormValues = {
    primerNombre: "",
    segundoNombre: "",
    primerApellido: "",
    segundoApellido: "",
    tipoIdentificacion: "",
    identificacion: "",
    carnet: "",
    direccion: "",
    usuario: "",
    rol: "",
    especialidad: "",
    contactos: [],
};

export const emptyContacto = (): PersonalFormContacto => ({
    tipoValor: "",
    valor: "",
});