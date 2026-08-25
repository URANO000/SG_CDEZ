import { apiClient } from "../utils/apiHelper";

import type {
  AdultoMayorCreateRequest,
  AdultoMayorUpdateRequest,
  AdultoMayorFallecimientoRequest,
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

export async function actualizarAdultoMayor(
  adultoId: string,
  request: AdultoMayorUpdateRequest,
): Promise<AdultoMayorResponse> {
  const response = await apiClient.put<AdultoMayorResponse>(
    `/adultos-mayores/${adultoId}`,
    request,
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

export async function registrarFallecimientoAdultoMayor(
  adultoId: string,
  request: AdultoMayorFallecimientoRequest,
): Promise<AdultoMayorResponse> {
  const response = await apiClient.patch<AdultoMayorResponse>(
    `/adultos-mayores/${adultoId}/fallecimiento`,
    request,
  );

  return response.data;
}


export const generarReportePDF = async () => {
  const response = await apiClient.get(`/adultos-mayores/reporte`, {
    responseType: 'blob', 
  });
  return response.data; 
};

export const generarReporteExcel = async () => {
  const response = await apiClient.get(`/adultos-mayores/reporteExcel`, {
    responseType: 'blob', 
  });
  return response.data; 
};