import { apiClient } from "../utils/apiHelper";
import type { ConsultaDetailResponse } from "./interfaces/consultasDetailsResponse";
import type { ConsultaFiltro, ConsultaPageResponse } from "./interfaces/consultasInterface";
import type { PageResponse } from "./interfaces/pageResponse";

export const listarConsultasFiltradas = async (filtros: ConsultaFiltro, page = 0,
    size = 10) : Promise<PageResponse<ConsultaPageResponse>> => {

        const response = await apiClient.post(
            `/consulta/listarConsultasFiltradas?page=${page}&size=${size}`, filtros
        );
        return response.data;
    }

export const obtenerConsultaPorId = async (consultaId: string): Promise<ConsultaDetailResponse> => {
    const response = await apiClient.get( `/consulta/obtenerConsulta/${consultaId}`);
    return response.data;
}
