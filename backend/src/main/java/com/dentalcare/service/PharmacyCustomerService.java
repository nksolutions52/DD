
package com.dentalcare.service;

import com.dentalcare.model.PharmacyCustomer;
import com.dentalcare.repository.PharmacyCustomerRepository;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class PharmacyCustomerService {
    private final PharmacyCustomerRepository pharmacyCustomerRepository;
    
    public PharmacyCustomerService(PharmacyCustomerRepository pharmacyCustomerRepository) {
        this.pharmacyCustomerRepository = pharmacyCustomerRepository;
    }
    
    public Optional<PharmacyCustomer> getByPhone(String phone) {
        return pharmacyCustomerRepository.findByPhone(phone);
    }
    
    public PharmacyCustomer createCustomer(PharmacyCustomer customer) {
        return pharmacyCustomerRepository.save(customer);
    }
}
