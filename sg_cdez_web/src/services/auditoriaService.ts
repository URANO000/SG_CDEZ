import { apiClient } from "../utils/apiHelper";

import type {
  AuditoriaFiltros,
  AuditoriaPageResponse,
} from "./interfaces/auditoriaInterface";

export async function listarAuditorias(
  filtros: AuditoriaFiltros = {},
  page = 0,
  size = 10,
): Promise<AuditoriaPageResponse> {
  const params = {
    usuarioId: filtros.usuarioId || undefined,
    usuario: filtros.usuario || undefined,
    accion: filtros.accion || undefined,
    modulo: filtros.modulo || undefined,
    fechaDesde: filtros.fechaDesde || undefined,
    fechaHasta: filtros.fechaHasta || undefined,

    page,
    size,
  };

  const response = await apiClient.get<AuditoriaPageResponse>("/auditorias", {
    params,
  });

  return response.data;
}
