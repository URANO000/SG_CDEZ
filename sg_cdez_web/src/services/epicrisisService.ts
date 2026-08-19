import { apiClient } from "../utils/helper";
import type { EpicrisisResponse } from "./interfaces/epicrisisInterface";
import type { PageResponse } from "./interfaces/pageResponse";

export async function obtenerEpicrisisVigente(
  adultoId: string,
): Promise<EpicrisisResponse> {
  const response = await apiClient.get<EpicrisisResponse>(
    `/adultos-mayores/${adultoId}/epicrisis/vigente`,
  );

  return response.data;
}

export async function listarHistorialEpicrisis(
  adultoId: string,
  pagina: number,
  cantidad: number,
  anio?: number,
): Promise<PageResponse<EpicrisisResponse>> {
  const response = await apiClient.get<PageResponse<EpicrisisResponse>>(
    `/adultos-mayores/${adultoId}/epicrisis/historial`,
    {
      params: {
        page: pagina,
        size: cantidad,
        anio,
      },
    },
  );

  return response.data;
}
export async function descargarEpicrisis(epicrisisId: string): Promise<Blob> {
  const response = await apiClient.get(`/epicrisis/${epicrisisId}/descargar`, {
    responseType: "blob",
  });

  return response.data;
}
