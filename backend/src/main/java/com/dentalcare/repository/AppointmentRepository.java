package com.dentalcare.repository;

import com.dentalcare.model.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByDate(LocalDate date);
    List<Appointment> findByDateBetween(LocalDate startDate, LocalDate endDate);
    List<Appointment> findByPatientId(Long patientId);
    
    @Query("SELECT COALESCE(COUNT(DISTINCT a.patientId), 0) FROM Appointment a " +
           "WHERE a.date BETWEEN ?1 AND ?2 " +
           "GROUP BY a.patientId HAVING COUNT(a) > 1")
    Long countPatientsWithMultipleAppointments(LocalDate startDate, LocalDate endDate);
    
    @Query(value = """
    SELECT a.type, COUNT(DISTINCT a.id) as count, COALESCE(SUM(am.amount),0) as revenue
    FROM appointments a
    LEFT JOIN amounts am ON am.appointment_id = a.id
    WHERE a.date BETWEEN :startDate AND :endDate
    GROUP BY a.type
    """, nativeQuery = true)
    List<Object[]> getAppointmentTypeStats(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
}
