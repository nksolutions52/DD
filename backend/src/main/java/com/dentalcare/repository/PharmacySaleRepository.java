
package com.dentalcare.repository;

import com.dentalcare.model.PharmacySale;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.time.LocalDateTime;
import java.util.List;

public interface PharmacySaleRepository extends JpaRepository<PharmacySale, Long> {
    List<PharmacySale> findByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    @Query("SELECT i.medicineId, i.medicineName, SUM(i.quantity) as totalQuantity, SUM(i.totalPrice) as totalRevenue " +
           "FROM PharmacySale s JOIN s.items i " +
           "WHERE s.createdAt BETWEEN ?1 AND ?2 " +
           "GROUP BY i.medicineId, i.medicineName " +
           "ORDER BY totalQuantity DESC")
    List<Object[]> getTopSellingMedicines(LocalDateTime startDate, LocalDateTime endDate);
}