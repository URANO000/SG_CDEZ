import { apiClient } from "../utils/apiHelper";
import type { DashboardResponse } from "./interfaces/dashboardInterface";
import type { PersonalDashboardResponse } from "./interfaces/dashboardInterface";

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