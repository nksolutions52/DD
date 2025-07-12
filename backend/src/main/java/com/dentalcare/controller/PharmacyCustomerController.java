
package com.dentalcare.controller;

import com.dentalcare.model.PharmacyCustomer;
import com.dentalcare.service.PharmacyCustomerService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/pharmacy-customers")
public class PharmacyCustomerController {
    private final PharmacyCustomerService pharmacyCustomerService;
    
    public PharmacyCustomerController(PharmacyCustomerService pharmacyCustomerService) {
        this.pharmacyCustomerService = pharmacyCustomerService;
    }
    
    @GetMapping("/phone/{phone}")
    public ResponseEntity<PharmacyCustomer> getByPhone(@PathVariable String phone) {
        return pharmacyCustomerService.getByPhone(phone)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public PharmacyCustomer createCustomer(@RequestBody PharmacyCustomer customer) {
        return pharmacyCustomerService.createCustomer(customer);
    }
}