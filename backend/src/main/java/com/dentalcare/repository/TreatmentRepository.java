package com.dentalcare.repository;

import com.dentalcare.model.Treatment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TreatmentRepository extends JpaRepository<Treatment, Long> {
    List<Treatment> findByAppointmentId(Long appointmentId);

    // Custom query to get all treatments for a patient via appointment
    List<Treatment> findByAppointmentIdIn(List<Long> appointmentIds);
}
