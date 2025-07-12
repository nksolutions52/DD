package com.dentalcare.service;

import com.dentalcare.model.Treatment;
import com.dentalcare.repository.TreatmentRepository;
import com.dentalcare.repository.AppointmentRepository;
import com.dentalcare.model.Appointment;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TreatmentService {
    private final TreatmentRepository treatmentRepository;
    private final AppointmentRepository appointmentRepository;

    public TreatmentService(TreatmentRepository treatmentRepository, AppointmentRepository appointmentRepository) {
        this.treatmentRepository = treatmentRepository;
        this.appointmentRepository = appointmentRepository;
    }

    public Treatment createTreatment(Treatment treatment) {
        return treatmentRepository.save(treatment);
    }

    public List<Treatment> getTreatmentsByPatientId(Long patientId) {
        List<Appointment> appointments = appointmentRepository.findByPatientId(patientId);
        List<Long> appointmentIds = appointments.stream().map(Appointment::getId).collect(Collectors.toList());
        if (appointmentIds.isEmpty()) return List.of();
        return treatmentRepository.findByAppointmentIdIn(appointmentIds);
    }

    public Optional<Treatment> getTreatmentById(Long id) {
        return treatmentRepository.findById(id);
    }

    public List<Treatment> getAllTreatments() {
        return treatmentRepository.findAll();
    }
}
