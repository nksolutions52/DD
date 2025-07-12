package com.dentalcare.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "pharmacy_sale_items")
public class PharmacySaleItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "medicine_id", nullable = false)
    private Long medicineId;
    
    @Column(name = "medicine_name", nullable = false)
    private String medicineName;
    
    @Column(nullable = false)
    private Integer quantity;
    
    @Column(name = "unit_price", nullable = false)
    private Double unitPrice;
    
    @Column(name = "total_price", nullable = false)
    private Double totalPrice;
}