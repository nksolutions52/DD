package com.dentalcare.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "prescription_items")
public class PrescriptionItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "medicine_id", nullable = false)
    private Long medicineId;
    
    @Column(name = "medicine_name", nullable = false)
    private String medicineName;
    
    @Column(name = "medicine_type", nullable = false)
    private String medicineType;
    
    @Column(nullable = false)
    private String dosage;
    
    @Column(nullable = false)
    private String frequency;
    
    @Column(nullable = false)
    private String duration;
    
    private String instructions;
}