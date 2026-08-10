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

export const cambiarContrasena = async (nuevaContrasena: string, confirmarContrasena:string) => {
    await apiClient.post("/auth/cambiarContrasena", {nuevaContrasena, confirmarContrasena});
}

export const forgotPassword = async (correo: string) => {
    await apiClient.post("/auth/forgot-password", {correo})
}

export const reenviarVerificacion = async (correo: string) => {
    await apiClient.post("/auth/resend-verification", {correo})
}

export const restablecerContrasena = async (token: string, contrasena:string, confirmarContrasena:string) => {
    await apiClient.post("auth/restablecer-contrasena", {token, contrasena, confirmarContrasena})
}