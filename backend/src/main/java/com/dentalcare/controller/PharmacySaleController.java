package com.dentalcare.controller;

import com.dentalcare.model.PharmacySale;
import com.dentalcare.service.PharmacySaleService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/pharmacy-sales")
public class PharmacySaleController {
    private final PharmacySaleService pharmacySaleService;
    
    public PharmacySaleController(PharmacySaleService pharmacySaleService) {
        this.pharmacySaleService = pharmacySaleService;
    }
    
    @GetMapping
    public List<PharmacySale> getAllSales() {
        return pharmacySaleService.getAllSales();
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<PharmacySale> getSaleById(@PathVariable Long id) {
        return pharmacySaleService.getSaleById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public PharmacySale createSale(@RequestBody PharmacySale sale) {
        return pharmacySaleService.createSale(sale);
    }
}