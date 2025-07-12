package com.dentalcare.repository;

import com.dentalcare.model.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface PatientRepository extends JpaRepository<Patient, Long> {
    List<Patient> findByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);
    Optional<Patient> findByPhone(String phone);

    @Query("SELECT p FROM Patient p WHERE " +
           "(:search = '' OR " +
           "LOWER(p.firstName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(p.lastName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(p.email) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "p.phone LIKE CONCAT('%', :search, '%') OR " +
           "CAST(p.id AS string) LIKE CONCAT('%', :search, '%'))")
    Page<Patient> findPatientsWithSearch(@Param("search") String search, Pageable pageable);

    @Query("SELECT p FROM Patient p WHERE LOWER(p.firstName) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(p.lastName) LIKE LOWER(CONCAT('%', :query, '%')) OR CAST(p.id AS string) LIKE CONCAT('%', :query, '%')")
    List<Patient> searchByNameOrId(@Param("query") String query);

    // Dashboard specific queries for optimized performance
    @Query("SELECT p FROM Patient p ORDER BY p.createdAt DESC")
    List<Patient> findRecentPatients(Pageable pageable);
}