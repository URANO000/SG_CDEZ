import { apiClient } from "../utils/apiHelper";
import type { DocumentoResponse } from "./interfaces/personalResponse";

export const descargarDocumento = async (documentoId: number) => {
  const response = await apiClient.get(`/documentos/${documentoId}/descargar`, {
    responseType: "blob",
  });
  return response.data as Blob;
};

export const registrarDocumentoExpediente = async (
  adultoId: string,
  archivo: File,
): Promise<DocumentoResponse> => {
  const formData = new FormData();

  formData.append("archivo", archivo);

  const response = await apiClient.post<DocumentoResponse>(
    `/adultos-mayores/${adultoId}/documentos`,
    formData,
  );

  return response.data;
};

export const listarDocumentosPorAdulto = async (
  adultoId: string,
): Promise<DocumentoResponse[]> => {
  const response = await apiClient.get<DocumentoResponse[]>(
    `/adultos-mayores/${adultoId}/documentos`,
  );

  return response.data;
};

export const obtenerDocumentoPorId = async (
  documentoId: number,
): Promise<DocumentoResponse> => {
  const response = await apiClient.get<DocumentoResponse>(
    `/documentos/${documentoId}`,
  );

  return response.data;
};

export const desactivarDocumento = async (
  documentoId: number,
): Promise<void> => {
  await apiClient.patch(`/documentos/${documentoId}/desactivar`);
};
