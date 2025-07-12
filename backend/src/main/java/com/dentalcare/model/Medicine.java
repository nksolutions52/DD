package com.dentalcare.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "medicines")
public class Medicine {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(nullable = false)
    private String type;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    private String manufacturer;
    
    @Column(nullable = false)
    private Integer stock;
    
    @Column(nullable = false)
    private String unit;
    
    @Column(nullable = false)
    private Double price;
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @Column(name = "date_of_mfg")
    private LocalDate dateOfMfg;

    @Column(name = "date_of_expiry")
    private LocalDate dateOfExpiry;
}