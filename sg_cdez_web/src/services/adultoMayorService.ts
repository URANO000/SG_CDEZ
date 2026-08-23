import { apiClient } from "../utils/helper";

import type {
  AdultoMayorCreateRequest,
  AdultoMayorDesactivarRequest,
  AdultoMayorFiltro,
  AdultoMayorResponse,
} from "./interfaces/adultoMayorInterface";

import type { PageResponse } from "./interfaces/pageResponse";

export async function registrarAdultoMayor(
  request: AdultoMayorCreateRequest,
): Promise<AdultoMayorResponse> {
  const response = await apiClient.post<AdultoMayorResponse>(
    "/adultos-mayores",
    request,
  );

  return response.data;
}

export async function listarAdultosMayoresFiltrados(
  filtros: AdultoMayorFiltro,
  page = 0,
  size = 10,
): Promise<PageResponse<AdultoMayorResponse>> {
  const response = await apiClient.post<PageResponse<AdultoMayorResponse>>(
    `/adultos-mayores/listarFiltrado?page=${page}&size=${size}`,
    filtros,
  );

  return response.data;
}

export async function obtenerAdultoMayorPorId(
  adultoId: string,
): Promise<AdultoMayorResponse> {
  const response = await apiClient.get<AdultoMayorResponse>(
    `/adultos-mayores/${adultoId}`,
  );

  return response.data;
}

export async function desactivarAdultoMayor(
  adultoId: string,
  request: AdultoMayorDesactivarRequest,
): Promise<AdultoMayorResponse> {
  const response = await apiClient.patch<AdultoMayorResponse>(
    `/adultos-mayores/${adultoId}/desactivar`,
    request,
  );

  return response.data;
}

export async function activarAdultoMayor(
  adultoId: string,
): Promise<AdultoMayorResponse> {
  const response = await apiClient.patch<AdultoMayorResponse>(
    `/adultos-mayores/${adultoId}/activar`,
  );

  return response.data;
}
