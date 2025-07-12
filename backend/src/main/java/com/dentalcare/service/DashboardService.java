package com.dentalcare.service;

import com.dentalcare.dto.DashboardStatsResponse;
import com.dentalcare.dto.DashboardStatsResponse.UpcomingAppointmentDto;
import com.dentalcare.dto.DashboardStatsResponse.RecentPatientDto;
import com.dentalcare.dto.DashboardStatsResponse.StatisticDto;
import com.dentalcare.model.Appointment;
import com.dentalcare.model.Patient;
import com.dentalcare.repository.AppointmentRepository;
import com.dentalcare.repository.PatientRepository;
import com.dentalcare.repository.UserRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DashboardService {
    private final AppointmentRepository appointmentRepository;
    private final PatientRepository patientRepository;
    private final UserRepository userRepository;

    public DashboardService(AppointmentRepository appointmentRepository, 
                          PatientRepository patientRepository,
                          UserRepository userRepository) {
        this.appointmentRepository = appointmentRepository;
        this.patientRepository = patientRepository;
        this.userRepository = userRepository;
    }

    public DashboardStatsResponse getDashboardStats() {
        DashboardStatsResponse stats = new DashboardStatsResponse();
        LocalDate today = LocalDate.now();

        // Get counts efficiently
        stats.setTodayAppointments(appointmentRepository.countByDate(today));
        stats.setTotalAppointments(appointmentRepository.count());
        stats.setTotalPatients(patientRepository.count());
        stats.setTotalUsers(userRepository.count());

        // Get upcoming appointments (limit to 5)
        List<Appointment> upcomingAppointments = appointmentRepository.findUpcomingAppointments(
            today, PageRequest.of(0, 5)
        );
        stats.setUpcomingAppointments(
            upcomingAppointments.stream()
                .map(this::convertToUpcomingAppointmentDto)
                .collect(Collectors.toList())
        );

        // Get recent patients (limit to 5)
        List<Patient> recentPatients = patientRepository.findRecentPatients(
            PageRequest.of(0, 5)
        );
        stats.setRecentPatients(
            recentPatients.stream()
                .map(this::convertToRecentPatientDto)
                .collect(Collectors.toList())
        );

        // Get appointment statistics
        stats.setAppointmentsByType(getAppointmentTypeStats());
        stats.setAppointmentsByStatus(getAppointmentStatusStats());
        stats.setTreatmentsByType(getTreatmentTypeStats());

        return stats;
    }

    private UpcomingAppointmentDto convertToUpcomingAppointmentDto(Appointment appointment) {
        return new UpcomingAppointmentDto(
            appointment.getId(),
            appointment.getPatientName(),
            appointment.getDentistName(),
            appointment.getDate().toString(),
            appointment.getStartTime().toString(),
            appointment.getEndTime().toString(),
            appointment.getStatus(),
            appointment.getType(),
            appointment.getTreatmentType(),
            appointment.getPatientId()
        );
    }

    private RecentPatientDto convertToRecentPatientDto(Patient patient) {
        return new RecentPatientDto(
            patient.getId(),
            patient.getFirstName(),
            patient.getLastName(),
            patient.getPhone(),
            patient.getLastVisit() != null ? patient.getLastVisit().toString() : null
        );
    }

    private List<StatisticDto> getAppointmentTypeStats() {
        List<Object[]> results = appointmentRepository.getAppointmentTypeStatistics();
        return results.stream()
            .map(row -> new StatisticDto((String) row[0], ((Number) row[1]).longValue()))
            .collect(Collectors.toList());
    }

    private List<StatisticDto> getAppointmentStatusStats() {
        List<Object[]> results = appointmentRepository.getAppointmentStatusStatistics();
        return results.stream()
            .map(row -> new StatisticDto((String) row[0], ((Number) row[1]).longValue()))
            .collect(Collectors.toList());
    }

    private List<StatisticDto> getTreatmentTypeStats() {
        List<Object[]> results = appointmentRepository.getTreatmentTypeStatistics();
        return results.stream()
            .map(row -> new StatisticDto((String) row[0], ((Number) row[1]).longValue()))
            .collect(Collectors.toList());
    }
}