export const ESPECIALIDADES = [
    { value: "MEDICINA", label: "Medicina" },
    { value: "ENFERMERIA", label: "Enfermería" },
    { value: "PSICOLOGIA", label: "Psicología" },
    { value: "NUTRICION", label: "Nutrición" },
    { value: "TRABAJO_SOCIAL", label: "Trabajo Social" },
    { value: "TERAPIA_FISICA", label: "Terapia Física" },
    { value: "TERAPIA_RESPIRATORIA", label: "Terapia Respiratoria" },
    { value: "TERAPIA_LENGUAJE", label: "Terapia de Lenguaje" },
    {value: "COORDINACION", label: "Coordinación"},
    {value: "TERAPIA_OCUPACIONAL", label: "Terapia Ocupacional"}
] as const;

export type Especialidad = typeof ESPECIALIDADES[number]["value"];

export const TIPOIDENTIFICACION = [
    {value: "CIC", label: "Cédula de identidad Costarricense"},
    {value: "CRP", label: "Cédula de residencia permanente"},
    {value: "CRR", label: "Carné de residente rentista"},
    {value: "RE", label: "Cédula de residencia permanente libre de condición"},
    {value: "APO", label: "Documento de residencia de asilado político"},
    {value: "CRT", label: "Carné de residencia temporal"},
    {value: "CRE", label: "Carné de refugiado"},
    {value: "PEX", label: "Pasaporte extranjero"}
]

export const ROLES = [
    { value: "1", label: "Administrador" },
    { value: "2", label: "Usuario normal" },
    { value: "3", label: "Ayudante administrativo" },
] as const;

export const ROL = [
    { value: "ADMIN", label: "Administrador" },
    { value: "PERSONAL", label: "Usuario normal" },
    { value: "AYUDANTE", label: "Ayudante administrativo" },
]

export type Rol = typeof ROL[number]["value"];

export type Tipoidentificacion = typeof TIPOIDENTIFICACION[number]["value"];

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
