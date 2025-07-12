package com.dentalcare.service;

import com.dentalcare.model.*;
import org.springframework.stereotype.Component;
import jakarta.annotation.PostConstruct;
import java.time.*;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

@Component
public class DataStore {
    private final Map<Long, User> users = new ConcurrentHashMap<>();
    private final Map<Long, Patient> patients = new ConcurrentHashMap<>();
    private final Map<Long, Appointment> appointments = new ConcurrentHashMap<>();
    private final Map<Long, Medicine> medicines = new ConcurrentHashMap<>();
    private final Map<Long, Prescription> prescriptions = new ConcurrentHashMap<>();
    
    private final AtomicLong userIdSequence = new AtomicLong(1);
    private final AtomicLong patientIdSequence = new AtomicLong(1);
    private final AtomicLong appointmentIdSequence = new AtomicLong(1);
    private final AtomicLong medicineIdSequence = new AtomicLong(1);
    private final AtomicLong prescriptionIdSequence = new AtomicLong(1);
    
    @PostConstruct
    public void initializeData() {
        // Initialize Users
        User admin = new User();
        admin.setId(userIdSequence.getAndIncrement());
        admin.setName("Dr. John Smith");
        admin.setEmail("admin@example.com");
        admin.setPassword("password123");
        admin.setRole("admin");
        admin.setAvatar("https://randomuser.me/api/portraits/men/32.jpg");
        users.put(admin.getId(), admin);

        User dentist = new User();
        dentist.setId(userIdSequence.getAndIncrement());
        dentist.setName("Dr. Sarah Johnson");
        dentist.setEmail("dentist@example.com");
        dentist.setPassword("password123");
        dentist.setRole("dentist");
        dentist.setAvatar("https://randomuser.me/api/portraits/women/44.jpg");
        users.put(dentist.getId(), dentist);

        User receptionist = new User();
        receptionist.setId(userIdSequence.getAndIncrement());
        receptionist.setName("Emma Davis");
        receptionist.setEmail("receptionist@example.com");
        receptionist.setPassword("password123");
        receptionist.setRole("receptionist");
        receptionist.setAvatar("https://randomuser.me/api/portraits/women/68.jpg");
        users.put(receptionist.getId(), receptionist);

        // Initialize Patients
        Patient[] samplePatients = {
            createPatient("Michael", "Brown", "michael.brown@example.com", "(555) 123-4567", 
                LocalDate.of(1985, 6, 15), "male", "123 Main St, Anytown, CA 12345"),
            createPatient("Jessica", "Miller", "jessica.miller@example.com", "(555) 987-6543",
                LocalDate.of(1990, 3, 22), "female", "456 Oak Ave, Somewhere, NY 67890"),
            createPatient("David", "Wilson", "david.wilson@example.com", "(555) 456-7890",
                LocalDate.of(1978, 11, 30), "male", "789 Pine St, Elsewhere, TX 54321"),
            createPatient("Emily", "Taylor", "emily.taylor@example.com", "(555) 789-0123",
                LocalDate.of(1995, 9, 8), "female", "101 Maple Dr, Nowhere, FL 98765"),
            createPatient("Robert", "Anderson", "robert.anderson@example.com", "(555) 234-5678",
                LocalDate.of(1982, 7, 17), "male", "202 Cedar Ln, Anyplace, WA 13579")
        };

        // Initialize Medicines
        Medicine[] sampleMedicines = {
            createMedicine("Amoxicillin", "tablet", "Antibiotic for bacterial infections", 
                "PharmaCorp", 500, "tablets", 0.5),
            createMedicine("Ibuprofen", "tablet", "Pain reliever and anti-inflammatory", 
                "MediCo", 1000, "tablets", 0.3),
            createMedicine("Lidocaine", "injection", "Local anesthetic", 
                "AnestheCare", 200, "vials", 5.0),
            createMedicine("Chlorhexidine", "solution", "Oral antiseptic", 
                "DentalPharma", 150, "bottles", 8.0),
            createMedicine("Fluoride Gel", "gel", "Cavity prevention", 
                "OralCare", 100, "tubes", 12.0)
        };
    }

    private Patient createPatient(String firstName, String lastName, String email, String phone,
            LocalDate dateOfBirth, String gender, String address) {
        Patient patient = new Patient();
        patient.setId(patientIdSequence.getAndIncrement());
        patient.setFirstName(firstName);
        patient.setLastName(lastName);
        patient.setEmail(email);
        patient.setPhone(phone);
        patient.setDateOfBirth(dateOfBirth);
        patient.setGender(gender);
        patient.setAddress(address);
        patient.setCreatedAt(LocalDateTime.now().minusMonths((long) (Math.random() * 6)));
        patients.put(patient.getId(), patient);
        return patient;
    }

    private Medicine createMedicine(String name, String type, String description,
            String manufacturer, int stock, String unit, double price) {
        Medicine medicine = new Medicine();
        medicine.setId(medicineIdSequence.getAndIncrement());
        medicine.setName(name);
        medicine.setType(type);
        medicine.setDescription(description);
        medicine.setManufacturer(manufacturer);
        medicine.setStock(stock);
        medicine.setUnit(unit);
        medicine.setPrice(price);
        medicine.setCreatedAt(LocalDateTime.now().minusMonths(1));
        medicine.setUpdatedAt(LocalDateTime.now());
        medicines.put(medicine.getId(), medicine);
        return medicine;
    }
    
    public Map<Long, User> getUsers() {
        return users;
    }
    
    public Map<Long, Patient> getPatients() {
        return patients;
    }
    
    public Map<Long, Appointment> getAppointments() {
        return appointments;
    }
    
    public Map<Long, Medicine> getMedicines() {
        return medicines;
    }
    
    public Map<Long, Prescription> getPrescriptions() {
        return prescriptions;
    }
    
    public long nextUserId() {
        return userIdSequence.getAndIncrement();
    }
    
    public long nextPatientId() {
        return patientIdSequence.getAndIncrement();
    }
    
    public long nextAppointmentId() {
        return appointmentIdSequence.getAndIncrement();
    }
    
    public long nextMedicineId() {
        return medicineIdSequence.getAndIncrement();
    }
    
    public long nextPrescriptionId() {
        return prescriptionIdSequence.getAndIncrement();
    }
}