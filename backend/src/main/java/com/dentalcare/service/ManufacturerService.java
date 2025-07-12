package com.dentalcare.service;

import com.dentalcare.model.Manufacturer;
import com.dentalcare.repository.ManufacturerRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ManufacturerService {
    private final ManufacturerRepository manufacturerRepository;

    public ManufacturerService(ManufacturerRepository manufacturerRepository) {
        this.manufacturerRepository = manufacturerRepository;
    }

    public List<Manufacturer> getAllManufacturers() {
        return manufacturerRepository.findAll();
    }

    public Manufacturer createManufacturer(Manufacturer manufacturer) {
        // createdAt will be set by @PrePersist
        return manufacturerRepository.save(manufacturer);
    }

    public Optional<Manufacturer> updateManufacturer(Long id, Manufacturer manufacturer) {
        return manufacturerRepository.findById(id).map(existing -> {
            existing.setName(manufacturer.getName());
            return manufacturerRepository.save(existing);
        });
    }

    public boolean deleteManufacturer(Long id) {
        if (manufacturerRepository.existsById(id)) {
            manufacturerRepository.deleteById(id);
            return true;
        }
        return false;
    }
}