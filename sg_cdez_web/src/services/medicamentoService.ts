import { apiClient } from "../utils/apiHelper";

import type {
  MedicamentoCreateRequest,
  MedicamentoResponse,
} from "./interfaces/medicamentoInterface";

export async function listarMedicamentosPorAdulto(
  adultoId: string,
): Promise<MedicamentoResponse[]> {
  const response = await apiClient.post<MedicamentoResponse[]>(
    `/medicamentos/listarMedicamentos/${adultoId}`,
  );

  return response.data;
}

export async function registrarMedicamento(
  adultoId: string,
  request: MedicamentoCreateRequest,
): Promise<MedicamentoResponse> {
  const response = await apiClient.post<MedicamentoResponse>(
    `/medicamentos/crearMedicamentos/${adultoId}`,
    request,
  );

  return response.data;
}
