package com.dentalcare.controller;

import com.dentalcare.model.Prescription;
import com.dentalcare.service.PrescriptionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/prescriptions")
public class PrescriptionController {
    private final PrescriptionService prescriptionService;
    
    public PrescriptionController(PrescriptionService prescriptionService) {
        this.prescriptionService = prescriptionService;
    }
    
    @GetMapping
    public List<Prescription> getAllPrescriptions() {
        return prescriptionService.getAllPrescriptions();
    }
    
    @GetMapping("/patient/{patientId}")
    public List<Prescription> getPrescriptionsByPatientId(@PathVariable Long patientId) {
        return prescriptionService.getPrescriptionsByPatientId(patientId);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Prescription> getPrescriptionById(@PathVariable Long id) {
        return prescriptionService.getPrescriptionById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public Prescription createPrescription(@RequestBody Prescription prescription) {
        return prescriptionService.createPrescription(prescription);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Prescription> updatePrescription(
            @PathVariable Long id, @RequestBody Prescription prescription) {
        return prescriptionService.updatePrescription(id, prescription)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePrescription(@PathVariable Long id) {
        return prescriptionService.deletePrescription(id)
                ? ResponseEntity.ok().build()
                : ResponseEntity.notFound().build();
    }
}