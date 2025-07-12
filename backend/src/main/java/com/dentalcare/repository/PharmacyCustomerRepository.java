
package com.dentalcare.repository;

import com.dentalcare.model.PharmacyCustomer;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface PharmacyCustomerRepository extends JpaRepository<PharmacyCustomer, Long> {
    Optional<PharmacyCustomer> findByPhone(String phone);
}
