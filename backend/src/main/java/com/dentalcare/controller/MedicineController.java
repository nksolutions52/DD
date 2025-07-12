package com.dentalcare.controller;

import com.dentalcare.model.Medicine;
import com.dentalcare.dto.PageRequest;
import com.dentalcare.dto.PageResponse;
import com.dentalcare.service.MedicineService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/medicines")
public class MedicineController {
    private final MedicineService medicineService;
    
    public MedicineController(MedicineService medicineService) {
        this.medicineService = medicineService;
    }
    
    @GetMapping
    public PageResponse<Medicine> getAllMedicines(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "name") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDirection,
            @RequestParam(defaultValue = "") String search) {
        PageRequest pageRequest = new PageRequest(page, size, sortBy, sortDirection);
        pageRequest.setSearch(search);
        return medicineService.getAllMedicines(pageRequest);
    }
    
    @GetMapping("/search")
    public List<Medicine> searchMedicines(@RequestParam String query) {
        return medicineService.searchMedicines(query);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Medicine> getMedicineById(@PathVariable Long id) {
        return medicineService.getMedicineById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public Medicine createMedicine(@RequestBody Medicine medicine) {
        return medicineService.createMedicine(medicine);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Medicine> updateMedicine(
            @PathVariable Long id, @RequestBody Medicine medicine) {
        return medicineService.updateMedicine(id, medicine)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMedicine(@PathVariable Long id) {
        return medicineService.deleteMedicine(id)
                ? ResponseEntity.ok().build()
                : ResponseEntity.notFound().build();
    }
}