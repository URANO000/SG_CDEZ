import { apiClient } from "../utils/apiHelper";

import type {
  EncargadoLegalCreateRequest,
  EncargadoLegalResponse,
} from "./interfaces/encargadoLegalInterface";

export async function listarEncargadosPorAdulto(
  adultoId: string,
): Promise<EncargadoLegalResponse[]> {
  const response = await apiClient.get<EncargadoLegalResponse[]>(
    `/adultos-mayores/${adultoId}/encargados`,
  );

  return response.data;
}

export async function registrarEncargadoLegal(
  adultoId: string,
  request: EncargadoLegalCreateRequest,
): Promise<EncargadoLegalResponse> {
  const response = await apiClient.post<EncargadoLegalResponse>(
    `/adultos-mayores/${adultoId}/encargados`,
    request,
  );

  return response.data;
}
