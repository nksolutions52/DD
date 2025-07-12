package com.dentalcare.controller;

import com.dentalcare.model.MedicineType;
import com.dentalcare.service.MedicineTypeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/medicine-types")
public class MedicineTypeController {
    private final MedicineTypeService medicineTypeService;

    public MedicineTypeController(MedicineTypeService medicineTypeService) {
        this.medicineTypeService = medicineTypeService;
    }

    @GetMapping
    public List<MedicineType> getAllMedicineTypes() {
        return medicineTypeService.getAllMedicineTypes();
    }

    @PostMapping
    public MedicineType createMedicineType(@RequestBody MedicineType medicineType) {
        return medicineTypeService.createMedicineType(medicineType);
    }

    @PutMapping("/{id}")
    public ResponseEntity<MedicineType> updateMedicineType(
            @PathVariable Long id, @RequestBody MedicineType medicineType) {
        return medicineTypeService.updateMedicineType(id, medicineType)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMedicineType(@PathVariable Long id) {
        return medicineTypeService.deleteMedicineType(id)
                ? ResponseEntity.ok().build()
                : ResponseEntity.notFound().build();
    }
}