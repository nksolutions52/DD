package com.dentalcare.service;

import com.dentalcare.model.Medicine;
import com.dentalcare.repository.MedicineRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.time.LocalDateTime;

@Service
public class MedicineService {
    private final MedicineRepository medicineRepository;
    
    public MedicineService(MedicineRepository medicineRepository) {
        this.medicineRepository = medicineRepository;
    }
    
    public List<Medicine> getAllMedicines() {
        return medicineRepository.findAll();
    }
    
    public List<Medicine> searchMedicines(String query) {
        if (query == null || query.trim().isEmpty()) {
            return List.of(); // Return empty list for empty queries
        }
        return medicineRepository.findByNameContainingIgnoreCaseAndStockGreaterThan(query.trim());
    }
    
    public Optional<Medicine> getMedicineById(Long id) {
        return medicineRepository.findById(id);
    }
    
    public Medicine createMedicine(Medicine medicine) {
        LocalDateTime now = LocalDateTime.now();
        medicine.setCreatedAt(now);
        medicine.setUpdatedAt(now);
        return medicineRepository.save(medicine);
    }
    
    public Optional<Medicine> updateMedicine(Long id, Medicine medicine) {
        if (medicineRepository.existsById(id)) {
            medicine.setId(id);
            medicine.setUpdatedAt(LocalDateTime.now());
            // Optionally, keep the original createdAt if needed
            return Optional.of(medicineRepository.save(medicine));
        }
        return Optional.empty();
    }
    
    public boolean deleteMedicine(Long id) {
        if (medicineRepository.existsById(id)) {
            medicineRepository.deleteById(id);
            return true;
        }
        return false;
    }
}