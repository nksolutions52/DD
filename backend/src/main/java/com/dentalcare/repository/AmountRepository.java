package com.dentalcare.repository;

import com.dentalcare.model.Amount;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface AmountRepository extends JpaRepository<Amount, Long> {
    List<Amount> findByAppointmentId(Long appointmentId);
    List<Amount> findByPatientId(Long patientId);
    List<Amount> findByAppointmentIdIn(List<Long> appointmentIds);
    List<Amount> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end);
}
