import { apiClient } from "../utils/helper";

import type {
  AdultoMayorDesactivarRequest,
  AdultoMayorResponse,
  EstadoAdultoMayor,
} from "./interfaces/adultoMayorInterface";

export async function listarAdultosMayores(
  estado: EstadoAdultoMayor = "activos",
): Promise<AdultoMayorResponse[]> {
  const ruta = estado === "activos" ? "" : `/${estado}`;

  const response = await apiClient.get<AdultoMayorResponse[]>(
    `/adultos-mayores${ruta}`,
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
