import {apiClient} from "../utils/helper";

export const iniciarSesion = async (usuario: string, contrasena: string) => {
    await apiClient.post("/auth/iniciarSesion", {usuario, contrasena});
}