package com.dentalcare.controller;

import com.dentalcare.dto.DashboardStatsResponse;
import com.dentalcare.service.DashboardService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/dashboard")
public class DashboardController {
    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/stats")
    public DashboardStatsResponse getDashboardStats() {
        return dashboardService.getDashboardStats();
    }
}