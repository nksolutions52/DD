package com.dentalcare.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Entity
@Table(name = "prescriptions")
public class Prescription {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "patient_id", nullable = false)
    private Long patientId;
    
    @Column(name = "patient_name", nullable = false)
    private String patientName;
    
    @Column(name = "appointment_id", nullable = false)
    private Long appointmentId;
    
    @Column(name = "dentist_id", nullable = false)
    private Long dentistId;
    
    @Column(name = "dentist_name", nullable = false)
    private String dentistName;
    
    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "prescription_id")
    private List<PrescriptionItem> items;
    
    @Column(columnDefinition = "TEXT")
    private String notes;
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
}