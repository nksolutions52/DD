
package com.dentalcare.controller;

import com.dentalcare.service.ReportService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.Map;

@RestController
@RequestMapping("/reports")
public class ReportController {
    private final ReportService reportService;
    
    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }
    
    @GetMapping("/patients")
    public Map<String, Object> getPatientStatistics(
            @RequestParam String period,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return reportService.getPatientStatistics(period, startDate, endDate);
    }
    
    @GetMapping("/appointments")
    public Map<String, Object> getAppointmentStatistics(
            @RequestParam String period,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return reportService.getAppointmentStatistics(period, startDate, endDate);
    }
    
    @GetMapping("/financial")
    public Map<String, Object> getFinancialStatistics(
            @RequestParam String period,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return reportService.getFinancialStatistics(period, startDate, endDate);
    }
    
    @GetMapping("/pharmacy")
    public Map<String, Object> getPharmacyStatistics(
            @RequestParam String period,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return reportService.getPharmacyStatistics(period, startDate, endDate);
    }
}
