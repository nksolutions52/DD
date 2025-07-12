package com.dentalcare.repository;

import com.dentalcare.model.Medicine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface MedicineRepository extends JpaRepository<Medicine, Long> {
    
    @Query("SELECT m FROM Medicine m WHERE LOWER(m.name) LIKE LOWER(CONCAT('%', :query, '%')) AND m.stock > 0 ORDER BY m.name")
    List<Medicine> findByNameContainingIgnoreCaseAndStockGreaterThan(@Param("query") String query);
}