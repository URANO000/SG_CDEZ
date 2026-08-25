import { apiClient } from "../utils/apiHelper";
import type { DashboardResponse } from "./interfaces/dashboardInterface";
import type { PersonalDashboardResponse } from "./interfaces/dashboardInterface";
import type{ AyudanteDashboardResponse } from "./interfaces/dashboardInterface";

export async function obtenerDashboard(): Promise<DashboardResponse> {
  const response = await apiClient.get<DashboardResponse>("/dashboard/admin");
  return response.data;
}

export async function obtenerDashboardPersonal():
  Promise<PersonalDashboardResponse> {

  const response =
    await apiClient.get<PersonalDashboardResponse>(
      "/dashboard/personal"
    );

  return response.data;
}

export async function obtenerDashboardAyudante():
  Promise<AyudanteDashboardResponse> {

  const response =
    await apiClient.get<AyudanteDashboardResponse>(
      "/dashboard/ayudante"
    );

  return response.data;
}