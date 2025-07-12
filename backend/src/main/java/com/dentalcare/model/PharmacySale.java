package com.dentalcare.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Entity
@Table(name = "pharmacy_sales")
public class PharmacySale {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "customer_id", nullable = false)
    private Long customerId;
    
    @Column(name = "customer_name", nullable = false)
    private String customerName;
    
    @Column(name = "customer_phone", nullable = false)
    private String customerPhone;
    
    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "sale_id")
    private List<PharmacySaleItem> items;
    
    @Column(nullable = false)
    private Double subtotal;
    
    @Column(nullable = false)
    private Double sgst;
    
    @Column(nullable = false)
    private Double cgst;
    
    @Column(nullable = false)
    private Double discount;
    
    @Column(nullable = false)
    private Double total;
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }
}