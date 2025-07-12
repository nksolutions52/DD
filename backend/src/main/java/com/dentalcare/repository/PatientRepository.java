package com.dentalcare.repository;

import com.dentalcare.model.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface PatientRepository extends JpaRepository<Patient, Long> {
    List<Patient> findByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);
    Optional<Patient> findByPhone(String phone);

    @Query("SELECT p FROM Patient p WHERE LOWER(p.firstName) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(p.lastName) LIKE LOWER(CONCAT('%', :query, '%')) OR CAST(p.id AS string) LIKE CONCAT('%', :query, '%')")
    List<Patient> searchByNameOrId(@Param("query") String query);
}