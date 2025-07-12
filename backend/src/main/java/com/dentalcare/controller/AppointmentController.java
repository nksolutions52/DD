package com.dentalcare.controller;

import com.dentalcare.model.Appointment;
import com.dentalcare.service.AppointmentService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/appointments")
public class AppointmentController {
    private final AppointmentService appointmentService;
    
    public AppointmentController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }
    
    @GetMapping
    public List<Appointment> getAllAppointments() {
        return appointmentService.getAllAppointments();
    }
    
    @GetMapping("/date/{date}")
    public List<Appointment> getAppointmentsByDate(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return appointmentService.getAppointmentsByDate(date);
    }
    
    @GetMapping("/month/{year}/{month}")
    public List<Appointment> getAppointmentsByMonth(
            @PathVariable int year,
            @PathVariable int month) {
        return appointmentService.getAppointmentsByMonth(year, month);
    }
    
    @GetMapping("/week/{date}")
    public List<Appointment> getAppointmentsByWeek(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return appointmentService.getAppointmentsByWeek(date);
    }
    
    @GetMapping("/patient/{patientId}")
    public List<Appointment> getAppointmentsByPatientId(@PathVariable Long patientId) {
        return appointmentService.getAppointmentsByPatientId(patientId);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Appointment> getAppointmentById(@PathVariable Long id) {
        return appointmentService.getAppointmentById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public Appointment createAppointment(@RequestBody Appointment appointment) {
        appointment.setCreatedAt(LocalDateTime.now());
        return appointmentService.createAppointment(appointment);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Appointment> updateAppointment(
            @PathVariable Long id, @RequestBody Appointment appointment) {
        return appointmentService.updateAppointment(id, appointment)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAppointment(@PathVariable Long id) {
        return appointmentService.deleteAppointment(id)
                ? ResponseEntity.ok().build()
                : ResponseEntity.notFound().build();
    }
}