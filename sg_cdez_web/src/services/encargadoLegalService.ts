import { apiClient } from "../utils/apiHelper";

import type { EncargadoLegalResponse } from "./interfaces/encargadoLegalInterface";

export async function listarEncargadosPorAdulto(
  adultoId: string,
): Promise<EncargadoLegalResponse[]> {
  const response = await apiClient.get<EncargadoLegalResponse[]>(
    `/adultos-mayores/${adultoId}/encargados`,
  );

  return response.data;
}
