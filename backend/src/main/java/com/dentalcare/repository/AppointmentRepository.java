package com.dentalcare.repository;

import com.dentalcare.model.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByDate(LocalDate date);
    List<Appointment> findByDateBetween(LocalDate startDate, LocalDate endDate);
    List<Appointment> findByPatientId(Long patientId);
    
    @Query("SELECT a FROM Appointment a WHERE " +
           "(:search = '' OR " +
           "LOWER(a.patientName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(a.dentistName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(a.type) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(a.status) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Appointment> findAppointmentsWithSearch(@Param("search") String search, Pageable pageable);
    
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

    // Dashboard specific queries for optimized performance
    @Query("SELECT COUNT(a) FROM Appointment a WHERE a.date = :date")
    long countByDate(@Param("date") LocalDate date);

    @Query("SELECT a FROM Appointment a WHERE a.date >= :date AND a.status IN ('scheduled', 'confirmed') ORDER BY a.date ASC, a.startTime ASC")
    List<Appointment> findUpcomingAppointments(@Param("date") LocalDate date, Pageable pageable);

    @Query("SELECT a.type, COUNT(a) FROM Appointment a GROUP BY a.type")
    List<Object[]> getAppointmentTypeStatistics();

    @Query("SELECT a.status, COUNT(a) FROM Appointment a GROUP BY a.status")
    List<Object[]> getAppointmentStatusStatistics();

    @Query("SELECT a.treatmentType, COUNT(a) FROM Appointment a WHERE a.treatmentType IS NOT NULL GROUP BY a.treatmentType")
    List<Object[]> getTreatmentTypeStatistics();
}
