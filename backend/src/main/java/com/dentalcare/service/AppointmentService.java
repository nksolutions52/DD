package com.dentalcare.service;

import com.dentalcare.model.Appointment;
import com.dentalcare.repository.AppointmentRepository;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;
import java.util.Optional;

@Service
public class AppointmentService {
    private final AppointmentRepository appointmentRepository;
    
    public AppointmentService(AppointmentRepository appointmentRepository) {
        this.appointmentRepository = appointmentRepository;
    }
    
    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }
    
    public List<Appointment> getAppointmentsByDate(LocalDate date) {
        return appointmentRepository.findByDate(date);
    }
    
    public List<Appointment> getAppointmentsByMonth(int year, int month) {
        YearMonth yearMonth = YearMonth.of(year, month);
        LocalDate startDate = yearMonth.atDay(1);
        LocalDate endDate = yearMonth.atEndOfMonth();
        return appointmentRepository.findByDateBetween(startDate, endDate);
    }
    
    public List<Appointment> getAppointmentsByWeek(LocalDate weekStart) {
        LocalDate weekEnd = weekStart.plusDays(6);
        return appointmentRepository.findByDateBetween(weekStart, weekEnd);
    }
    
    public List<Appointment> getAppointmentsByPatientId(Long patientId) {
        return appointmentRepository.findByPatientId(patientId);
    }
    
    public Optional<Appointment> getAppointmentById(Long id) {
        return appointmentRepository.findById(id);
    }
    
    public Appointment createAppointment(Appointment appointment) {
        return appointmentRepository.save(appointment);
    }
    
    public Optional<Appointment> updateAppointment(Long id, Appointment appointment) {
        if (appointmentRepository.existsById(id)) {
            appointment.setId(id);
            return Optional.of(appointmentRepository.save(appointment));
        }
        return Optional.empty();
    }
    
    public boolean deleteAppointment(Long id) {
        if (appointmentRepository.existsById(id)) {
            appointmentRepository.deleteById(id);
            return true;
        }
        return false;
    }
}