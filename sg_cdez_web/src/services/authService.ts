import {apiClient} from "../utils/helper";

export const iniciarSesion = (usuario: string, contrasena: string) => {
    return apiClient.post("/auth/iniciarSesion",{usuario, contrasena} ).then((response) => response.data);
}