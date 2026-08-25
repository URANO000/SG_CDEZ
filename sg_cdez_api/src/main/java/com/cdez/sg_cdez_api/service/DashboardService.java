package com.cdez.sg_cdez_api.service;

import com.cdez.sg_cdez_api.dto.response.DashboardResponse;
import com.cdez.sg_cdez_api.dto.response.PersonalDashboardResponse;

import java.util.UUID;

public interface DashboardService {
    DashboardResponse obtenerDashboard();

    PersonalDashboardResponse obtenerDashboardPersonal(
    );
}
