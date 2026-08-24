import { apiClient } from "../utils/apiHelper";
import type { ConsultaCreateRequest, ConsultaNutricionalCreateRequest } from "./interfaces/consultasCreateInterface";
import type { ConsultaDetailResponse } from "./interfaces/consultasDetailsResponse";
import type { ConsultaFiltro, ConsultaPageResponse } from "./interfaces/consultasInterface";
import type { ConsultaNutricionalUpdateRequest, ConsultaUpdateRequest } from "./interfaces/consultasUpdateInterface";
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


export const desactivarConsulta = async (consultaId: string): Promise<ConsultaDetailResponse> => {
    const response = await apiClient.post(`/consulta/desactivarConsulta/${consultaId}`)
    return response.data;
}

export const registrarConsulta = async (
    consulta: ConsultaCreateRequest
) => {
    const response = await apiClient.post(
        `/consulta/crearConsulta`,
        consulta
    );

    return response.data;
};

export const registrarConsultaNutricional = async (consulta: ConsultaNutricionalCreateRequest) => {
    const response = await apiClient.post(`/consulta-nutricional/crearConsulta`, consulta);
    return response.data;
}

export const actualizarConsultaNutricional = async (consultaId: string, consulta: ConsultaNutricionalUpdateRequest) => {
    const response = await apiClient.put(`/consulta-nutricional/actualizarConsulta/${consultaId}`, consulta);
    return response.data;
}

export const actualizarConsulta = async (consultaId: string, consulta: ConsultaUpdateRequest) => {
    const response = await apiClient.put(`/consulta/actualizarConsulta/${consultaId}`, consulta);
    return response.data;
}