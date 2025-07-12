package com.dentalcare.service;

import com.dentalcare.model.Prescription;
import com.dentalcare.repository.PrescriptionRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class PrescriptionService {
    private final PrescriptionRepository prescriptionRepository;
    
    public PrescriptionService(PrescriptionRepository prescriptionRepository) {
        this.prescriptionRepository = prescriptionRepository;
    }
    
    public List<Prescription> getAllPrescriptions() {
        return prescriptionRepository.findAll();
    }
    
    public List<Prescription> getPrescriptionsByPatientId(Long patientId) {
        return prescriptionRepository.findByPatientId(patientId);
    }
    
    public Optional<Prescription> getPrescriptionById(Long id) {
        return prescriptionRepository.findById(id);
    }
    
    public Prescription createPrescription(Prescription prescription) {
        return prescriptionRepository.save(prescription);
    }
    
    public Optional<Prescription> updatePrescription(Long id, Prescription prescription) {
        if (prescriptionRepository.existsById(id)) {
            prescription.setId(id);
            return Optional.of(prescriptionRepository.save(prescription));
        }
        return Optional.empty();
    }
    
    public boolean deletePrescription(Long id) {
        if (prescriptionRepository.existsById(id)) {
            prescriptionRepository.deleteById(id);
            return true;
        }
        return false;
    }
}