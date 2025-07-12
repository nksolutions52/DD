package com.dentalcare.service;

import com.dentalcare.model.PharmacySale;
import com.dentalcare.model.Medicine;
import com.dentalcare.repository.PharmacySaleRepository;
import com.dentalcare.repository.MedicineRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Service
public class PharmacySaleService {
    private final PharmacySaleRepository pharmacySaleRepository;
    private final MedicineRepository medicineRepository;
    private final PharmacyCustomerService pharmacyCustomerService;
    
    public PharmacySaleService(
        PharmacySaleRepository pharmacySaleRepository, 
        MedicineRepository medicineRepository,
        PharmacyCustomerService pharmacyCustomerService
    ) {
        this.pharmacySaleRepository = pharmacySaleRepository;
        this.medicineRepository = medicineRepository;
        this.pharmacyCustomerService = pharmacyCustomerService;
    }
    
    public List<PharmacySale> getAllSales() {
        return pharmacySaleRepository.findAll();
    }
    
    public Optional<PharmacySale> getSaleById(Long id) {
        return pharmacySaleRepository.findById(id);
    }
    
    @Transactional
    public PharmacySale createSale(PharmacySale sale) {
        // Verify customer exists
        pharmacyCustomerService.getByPhone(sale.getCustomerPhone())
            .orElseThrow(() -> new RuntimeException("Customer not found"));
        
        // Update medicine stock
        sale.getItems().forEach(item -> {
            Medicine medicine = medicineRepository.findById(item.getMedicineId())
                .orElseThrow(() -> new RuntimeException("Medicine not found"));
            
            if (medicine.getStock() < item.getQuantity()) {
                throw new RuntimeException("Insufficient stock for " + medicine.getName());
            }
            
            medicine.setStock(medicine.getStock() - item.getQuantity());
            medicineRepository.save(medicine);
        });
        
        // Round sale-level fields
        sale.setSubtotal(roundTo2Decimals(sale.getSubtotal()));
        sale.setSgst(roundTo2Decimals(sale.getSgst()));
        sale.setCgst(roundTo2Decimals(sale.getCgst()));
        sale.setDiscount(roundTo2Decimals(sale.getDiscount()));
        sale.setTotal(roundTo2Decimals(sale.getTotal()));

        // Round each item price fields
        if (sale.getItems() != null) {
            sale.getItems().forEach(item -> {
                item.setUnitPrice(roundTo2Decimals(item.getUnitPrice()));
                item.setTotalPrice(roundTo2Decimals(item.getTotalPrice()));
            });
        }

        return pharmacySaleRepository.save(sale);
    }
    
    private double roundTo2Decimals(double value) {
        return Math.round(value * 100.0) / 100.0;
    }
}