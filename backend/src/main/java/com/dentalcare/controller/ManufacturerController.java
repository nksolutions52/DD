package com.dentalcare.controller;

import com.dentalcare.model.Manufacturer;
import com.dentalcare.service.ManufacturerService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/manufacturers")
public class ManufacturerController {
    private final ManufacturerService manufacturerService;

    public ManufacturerController(ManufacturerService manufacturerService) {
        this.manufacturerService = manufacturerService;
    }

    @GetMapping
    public List<Manufacturer> getAllManufacturers() {
        return manufacturerService.getAllManufacturers();
    }

    @PostMapping
    public Manufacturer createManufacturer(@RequestBody Manufacturer manufacturer) {
        return manufacturerService.createManufacturer(manufacturer);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Manufacturer> updateManufacturer(
            @PathVariable Long id, @RequestBody Manufacturer manufacturer) {
        return manufacturerService.updateManufacturer(id, manufacturer)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteManufacturer(@PathVariable Long id) {
        return manufacturerService.deleteManufacturer(id)
                ? ResponseEntity.ok().build()
                : ResponseEntity.notFound().build();
    }
}