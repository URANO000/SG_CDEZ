import {apiClient} from "../utils/helper";
import type { Session } from "./sessionInterface";

export const iniciarSesion = async (usuario: string, contrasena: string) => {
    await apiClient.post("/auth/iniciarSesion", {usuario, contrasena});
}

// Para la sesión

export async function obtenerSesion() {
    const response = await apiClient.get<Session>("/auth/session");
    return response.data;
}

export async function cerrarSesion(){
    await apiClient.post("/auth/cerrarSesion")
}

export const activarCuenta = async (token:string, contrasena:string, confirmarContrasena:string) => {
    await apiClient.post("/auth/activar", {token, contrasena, confirmarContrasena});
}