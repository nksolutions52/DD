package com.dentalcare.repository;

import com.dentalcare.model.MedicineType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MedicineTypeRepository extends JpaRepository<MedicineType, Long> {
}