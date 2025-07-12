package com.dentalcare.service;

import com.dentalcare.model.MedicineType;
import com.dentalcare.repository.MedicineTypeRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MedicineTypeService {
    private final MedicineTypeRepository medicineTypeRepository;

    public MedicineTypeService(MedicineTypeRepository medicineTypeRepository) {
        this.medicineTypeRepository = medicineTypeRepository;
    }

    public List<MedicineType> getAllMedicineTypes() {
        return medicineTypeRepository.findAll();
    }

    public MedicineType createMedicineType(MedicineType medicineType) {
        return medicineTypeRepository.save(medicineType);
    }

    public Optional<MedicineType> updateMedicineType(Long id, MedicineType medicineType) {
        return medicineTypeRepository.findById(id).map(existing -> {
            existing.setName(medicineType.getName());
            return medicineTypeRepository.save(existing);
        });
    }

    public boolean deleteMedicineType(Long id) {
        if (medicineTypeRepository.existsById(id)) {
            medicineTypeRepository.deleteById(id);
            return true;
        }
        return false;
    }
}