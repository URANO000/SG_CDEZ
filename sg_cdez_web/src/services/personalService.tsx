import {apiClient} from "../utils/helper";
import type {PersonalFiltro} from './interfaces/personalFiltroInterface';
import type { PageResponse } from "./interfaces/pageResponse";
import type { PersonalResponse } from "./interfaces/personalResponse";

export const listarPersonalFiltrado = async (
    filtros: PersonalFiltro,
    page = 0,
    size = 10
): Promise<PageResponse<PersonalResponse>> => {

    const response = await apiClient.post(
        `/personal/listarPersonalFiltrado?page=${page}&size=${size}`,
        filtros
    );

    return response.data;
};

export const obtenerPersonalPorId = async (personalId:string): Promise<PersonalResponse> => {
    const response = await apiClient.get(`/personal/obtenerPersonalPorId/${personalId}`);
    return response.data;
}

export const desactivarPersonal = async (personalId:string) => {
    const response = await apiClient.post(`/personal/desactivarPersonal/${personalId}`);
    return response.data;
}

export const activarPersonal = async (personalId:string) => {
    const response = await apiClient.post(`/personal/activarPersonal/${personalId}`);
    return response.data;
}