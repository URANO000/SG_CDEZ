import {apiClient} from "../utils/helper";


export const descargarDocumento = async (documentoId:number) => {
    const response = await apiClient.get(`/documentos/${documentoId}/descargar`,{
        responseType: 'blob'
    });
    return response.data as Blob;
}