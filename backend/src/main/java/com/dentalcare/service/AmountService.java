package com.dentalcare.service;

import com.dentalcare.model.Amount;
import com.dentalcare.repository.AmountRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AmountService {
    private final AmountRepository amountRepository;

    public AmountService(AmountRepository amountRepository) {
        this.amountRepository = amountRepository;
    }

    public Amount createAmount(Amount amount) {
        return amountRepository.save(amount);
    }

    public List<Amount> getAmountsByAppointmentId(Long appointmentId) {
        return amountRepository.findByAppointmentId(appointmentId);
    }

    public List<Amount> getAmountsByPatientId(Long patientId) {
        return amountRepository.findByPatientId(patientId);
    }
}
