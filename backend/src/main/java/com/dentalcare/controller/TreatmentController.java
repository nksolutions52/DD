package com.dentalcare.controller;

import com.dentalcare.model.Treatment;
import com.dentalcare.service.TreatmentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/treatments")
public class TreatmentController {
    private final TreatmentService treatmentService;

    public TreatmentController(TreatmentService treatmentService) {
        this.treatmentService = treatmentService;
    }

    @PostMapping
    public Treatment createTreatment(@RequestBody Treatment treatment) {
        return treatmentService.createTreatment(treatment);
    }

    @GetMapping("/patient/{patientId}")
    public List<Treatment> getTreatmentsByPatientId(@PathVariable Long patientId) {
        return treatmentService.getTreatmentsByPatientId(patientId);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Treatment> getTreatmentById(@PathVariable Long id) {
        return treatmentService.getTreatmentById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public List<Treatment> getAllTreatments() {
        return treatmentService.getAllTreatments();
    }
}
