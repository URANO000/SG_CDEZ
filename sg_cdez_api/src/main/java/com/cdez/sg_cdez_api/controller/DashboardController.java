package com.cdez.sg_cdez_api.controller;

import com.cdez.sg_cdez_api.dto.response.AyudanteDashboardResponse;
import com.cdez.sg_cdez_api.dto.response.DashboardResponse;
import com.cdez.sg_cdez_api.dto.response.PersonalDashboardResponse;
import com.cdez.sg_cdez_api.entity.CustomUserDetails;
import com.cdez.sg_cdez_api.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {
    private final DashboardService dashboardService;

    @GetMapping("/admin")
    public ResponseEntity<DashboardResponse> obtenerDashboard() {
        return ResponseEntity.ok(
                dashboardService.obtenerDashboard()
        );
    }
    @GetMapping("/personal")
    public ResponseEntity<PersonalDashboardResponse>
    obtenerDashboardPersonal(
    ) {
        return ResponseEntity.ok(
                dashboardService.obtenerDashboardPersonal(
                )
        );
    }

    @GetMapping("/ayudante")
    public ResponseEntity<AyudanteDashboardResponse>
    obtenerDashboardAyudante() {

        return ResponseEntity.ok(
                dashboardService.obtenerDashboardAyudante()
        );
    }

}
