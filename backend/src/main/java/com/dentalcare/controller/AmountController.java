package com.dentalcare.controller;

import com.dentalcare.model.Amount;
import com.dentalcare.service.AmountService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/amounts")
public class AmountController {
    private final AmountService amountService;

    public AmountController(AmountService amountService) {
        this.amountService = amountService;
    }

    @PostMapping
    public Amount createAmount(@RequestBody Amount amount) {
        return amountService.createAmount(amount);
    }

    @GetMapping("/appointment/{appointmentId}")
    public List<Amount> getAmountsByAppointmentId(@PathVariable Long appointmentId) {
        return amountService.getAmountsByAppointmentId(appointmentId);
    }

    @GetMapping("/patient/{patientId}")
    public List<Amount> getAmountsByPatientId(@PathVariable Long patientId) {
        return amountService.getAmountsByPatientId(patientId);
    }
}
