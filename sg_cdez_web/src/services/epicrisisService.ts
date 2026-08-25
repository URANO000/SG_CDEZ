import { apiClient } from "../utils/apiHelper";

import type {
  EpicrisisRegistroRequest,
  EpicrisisResponse,
} from "./interfaces/epicrisisInterface";

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

export async function registrarEpicrisis(
  adultoId: string,
  request: EpicrisisRegistroRequest,
): Promise<EpicrisisResponse> {
  const formData = new FormData();

  formData.append("fechaEmision", request.fechaEmision);
  formData.append("centroSalud", request.centroSalud);
  formData.append("archivo", request.archivo);

  if (request.fechaRecepcion) {
    formData.append("fechaRecepcion", request.fechaRecepcion);
  }

  const response = await apiClient.post<EpicrisisResponse>(
    `/adultos-mayores/${adultoId}/epicrisis`,
    formData,
  );

  return response.data;
}

export async function descargarEpicrisis(epicrisisId: string): Promise<Blob> {
  const response = await apiClient.get(`/epicrisis/${epicrisisId}/descargar`, {
    responseType: "blob",
  });

  return response.data;
}
