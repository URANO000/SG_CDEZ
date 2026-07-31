import {apiClient} from "../utils/helper";

export const iniciarSesion = async (usuario: string, contrasena: string) => {
    await apiClient.post("/auth/iniciarSesion", {usuario, contrasena});
}

// Para la sesión

export interface Session {
    usuarioId: string;
    usuario: string;
    rol: string;
}

export async function obtenerSesion() {
    const response = await apiClient.get<Session>("/api/auth/session");
    return response.data;
}