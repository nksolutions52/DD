package com.dentalcare.service;

import com.dentalcare.model.Patient;
import com.dentalcare.repository.PatientRepository;
import org.springframework.stereotype.Service;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.SimpleMailMessage;

import java.util.List;
import java.util.Optional;

@Service
public class PatientService {
    private final PatientRepository patientRepository;
    private final JavaMailSender mailSender;

    public PatientService(PatientRepository patientRepository, JavaMailSender mailSender) {
        this.patientRepository = patientRepository;
        this.mailSender = mailSender;
    }

    public List<Patient> getAllPatients() {
        return patientRepository.findAll();
    }

    public Optional<Patient> getPatientById(Long id) {
        return patientRepository.findById(id);
    }

    public Optional<Patient> getPatientByPhone(String phone) {
        return patientRepository.findByPhone(phone);
    }

    public Patient createPatient(Patient patient) {
        Patient savedPatient = patientRepository.save(patient);
        sendWelcomeEmail(savedPatient);
        return savedPatient;
    }

    private void sendWelcomeEmail(Patient patient) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(patient.getEmail());
        message.setSubject("Welcome to Dental Care");
        message.setText("Welcome to Dental Care! Your Patient ID is " + patient.getId() + ".");
        mailSender.send(message);
    }

    public Optional<Patient> updatePatient(Long id, Patient patient) {
        if (patientRepository.existsById(id)) {
            patient.setId(id);
            return Optional.of(patientRepository.save(patient));
        }
        return Optional.empty();
    }

    public boolean deletePatient(Long id) {
        if (patientRepository.existsById(id)) {
            patientRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public List<Patient> searchPatients(String query) {
        return patientRepository.searchByNameOrId(query);
    }
}