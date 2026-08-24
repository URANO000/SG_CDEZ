import { apiClient } from "../utils/apiHelper";

import type {
  PerfilActualizarRequest,
  PerfilResponse,
} from "./interfaces/perfilInterface";


export async function obtenerPerfil(): Promise<PerfilResponse> {
  const response = await apiClient.get<PerfilResponse>(
    "/perfil",
  );

  return response.data;
}


export async function actualizarPerfil(
  request: PerfilActualizarRequest,
): Promise<PerfilResponse> {
  const response = await apiClient.put<PerfilResponse>(
    "/perfil",
    request,
  );

  return response.data;
}