package com.dentalcare.service;

import com.dentalcare.model.*;
import com.dentalcare.repository.*;
import org.springframework.stereotype.Service;
import java.time.*;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ReportService {
    private final PatientRepository patientRepository;
    private final AppointmentRepository appointmentRepository;
    private final PharmacySaleRepository pharmacySaleRepository;
    private final MedicineRepository medicineRepository;
    private final AmountRepository amountRepository; // Add this

    public ReportService(
        PatientRepository patientRepository,
        AppointmentRepository appointmentRepository,
        PharmacySaleRepository pharmacySaleRepository,
        MedicineRepository medicineRepository,
        AmountRepository amountRepository // Add this
    ) {
        this.patientRepository = patientRepository;
        this.appointmentRepository = appointmentRepository;
        this.pharmacySaleRepository = pharmacySaleRepository;
        this.medicineRepository = medicineRepository;
        this.amountRepository = amountRepository; // Add this
    }
    
    public Map<String, Object> getPatientStatistics(String period, LocalDate startDate, LocalDate endDate) {
        Map<String, Object> stats = new HashMap<>();

        List<Patient> patients = patientRepository.findByCreatedAtBetween(startDate.atStartOfDay(),
                endDate.atTime(23, 59, 59));
        if (patients == null) patients = new ArrayList<>();

        stats.put("totalPatients", patientRepository.count());
        stats.put("newPatients", patients.size());

        long returningPatients = 0;
        try {
            returningPatients = appointmentRepository.countPatientsWithMultipleAppointments(startDate, endDate);
        } catch (Exception e) {
            returningPatients = 0;
        }
        stats.put("returningPatients", returningPatients);

        double averageAge = 0;
        if (!patients.isEmpty()) {
            averageAge = patients.stream()
                .filter(p -> p.getDateOfBirth() != null)
                .mapToLong(p -> ChronoUnit.YEARS.between(p.getDateOfBirth(), LocalDate.now()))
                .average()
                .orElse(0);
        }
        stats.put("averageAge", averageAge);

        // Calculate gender distribution
        Map<String, Long> genderDistribution = new HashMap<>();
        genderDistribution.put("male", 0L);
        genderDistribution.put("female", 0L);
        genderDistribution.put("other", 0L);

        if (!patients.isEmpty()) {
            Map<String, Long> actual = patients.stream()
                .filter(p -> p.getGender() != null)
                .collect(Collectors.groupingBy(Patient::getGender, Collectors.counting()));
            actual.forEach(genderDistribution::put);
        }
        stats.put("genderDistribution", genderDistribution);

        List<Map<String, Object>> monthlyTrends = calculateMonthlyTrends(startDate, endDate);
        stats.put("monthlyTrends", monthlyTrends != null ? monthlyTrends : new ArrayList<>());

        return stats;
    }
    
    public Map<String, Object> getAppointmentStatistics(String period, LocalDate startDate, LocalDate endDate) {
        Map<String, Object> stats = new HashMap<>();
        
        // Get all appointments within the date range
        List<Appointment> appointments = appointmentRepository.findByDateBetween(startDate, endDate);
        
        // Calculate basic stats
        stats.put("totalAppointments", appointments.size());
        
        // Calculate status distribution
        Map<String, Long> statusCounts = appointments.stream()
                .collect(Collectors.groupingBy(Appointment::getStatus, Collectors.counting()));
        
        stats.put("completedAppointments", statusCounts.getOrDefault("completed", 0L));
        stats.put("cancelledAppointments", statusCounts.getOrDefault("cancelled", 0L));
        stats.put("noShowAppointments", statusCounts.getOrDefault("no-show", 0L));
        
        // Calculate type distribution (appointment type)
        Map<String, Long> typeDistribution = appointments.stream()
                .collect(Collectors.groupingBy(Appointment::getType, Collectors.counting()));
        stats.put("typeDistribution", typeDistribution != null ? typeDistribution : new HashMap<>());
        
        // Calculate treatment type distribution
        Map<String, Long> treatmentTypeDistribution = appointments.stream()
                .filter(a -> a.getTreatmentType() != null)
                .collect(Collectors.groupingBy(Appointment::getTreatmentType, Collectors.counting()));
        stats.put("treatmentTypeDistribution", treatmentTypeDistribution != null ? treatmentTypeDistribution : new HashMap<>());
        
        // Calculate monthly trends
        List<Map<String, Object>> monthlyTrends = calculateAppointmentTrends(startDate, endDate);
        stats.put("monthlyTrends", monthlyTrends);
        
        return stats;
    }
    
    public Map<String, Object> getFinancialStatistics(String period, LocalDate startDate, LocalDate endDate) {
        Map<String, Object> stats = new HashMap<>();

        // Fetch all amounts by their createdAt (payment date)
        List<Amount> amounts = amountRepository.findByCreatedAtBetween(
            startDate.atStartOfDay(), endDate.atTime(23, 59, 59)
        );

        double appointmentRevenue = amounts.stream()
            .mapToDouble(Amount::getAmount)
            .sum();

        List<PharmacySale> pharmacySales = pharmacySaleRepository.findByCreatedAtBetween(
                startDate.atStartOfDay(), endDate.atTime(23, 59, 59));

        double pharmacyRevenue = pharmacySales.stream()
                .mapToDouble(PharmacySale::getTotal)
                .sum();

        stats.put("totalRevenue", appointmentRevenue + pharmacyRevenue);
        stats.put("appointmentRevenue", appointmentRevenue);
        stats.put("pharmacyRevenue", pharmacyRevenue);

        // Calculate average values
        stats.put("averageAppointmentValue", amounts.isEmpty() ? 0 : appointmentRevenue / amounts.size());
        stats.put("averagePharmacySale", pharmacySales.isEmpty() ? 0 : pharmacyRevenue / pharmacySales.size());

        // Calculate monthly trends
        List<Map<String, Object>> monthlyTrends = calculateFinancialTrends(startDate, endDate);
        stats.put("monthlyTrends", monthlyTrends);

        // Calculate top procedures
        // If you want to keep this, you need to fetch appointments for the period as before:
        List<Appointment> appointments = appointmentRepository.findByDateBetween(startDate, endDate);
        stats.put("topProcedures", calculateTopProcedures(appointments, amounts));

        // Calculate online and cash amounts
        double onlineAmount = amounts.stream()
            .filter(a -> "online".equalsIgnoreCase(a.getPaymentType()))
            .mapToDouble(Amount::getAmount)
            .sum();

        double cashAmount = amounts.stream()
            .filter(a -> "cash".equalsIgnoreCase(a.getPaymentType()))
            .mapToDouble(Amount::getAmount)
            .sum();

        stats.put("onlineAmount", onlineAmount);
        stats.put("cashAmount", cashAmount);

        return stats;
    }
    
    public Map<String, Object> getPharmacyStatistics(String period, LocalDate startDate, LocalDate endDate) {
        Map<String, Object> stats = new HashMap<>();
        
        // Get all pharmacy sales within the date range
        List<PharmacySale> sales = pharmacySaleRepository.findByCreatedAtBetween(
                startDate.atStartOfDay(), endDate.atTime(23, 59, 59));
        
        // Calculate basic stats
        stats.put("totalSales", sales.size());
        double totalRevenue = sales.stream().mapToDouble(PharmacySale::getTotal).sum();
        stats.put("totalRevenue", totalRevenue);
        stats.put("averageSaleValue", sales.isEmpty() ? 0 : totalRevenue / sales.size());
        
        // Calculate top selling medicines
        List<Object[]> topMedicines = pharmacySaleRepository.getTopSellingMedicines(
                startDate.atStartOfDay(), endDate.atTime(23, 59, 59));
        
        List<Map<String, Object>> topSellingMedicines = topMedicines.stream()
                .map(row -> {
                    Map<String, Object> medicine = new HashMap<>();
                    medicine.put("medicineId", row[0]);
                    medicine.put("medicineName", row[1]);
                    medicine.put("quantity", row[2]);
                    medicine.put("revenue", row[3]);
                    return medicine;
                })
                .collect(Collectors.toList());
        
        stats.put("topSellingMedicines", topSellingMedicines);
        
        // Calculate monthly trends
        List<Map<String, Object>> monthlyTrends = new ArrayList<>();
        YearMonth start = YearMonth.from(startDate);
        YearMonth end = YearMonth.from(endDate);
        
        while (!start.isAfter(end)) {
            LocalDateTime monthStart = start.atDay(1).atStartOfDay();
            LocalDateTime monthEnd = start.atEndOfMonth().atTime(23, 59, 59);
            
            List<PharmacySale> monthlySales = sales.stream()
                    .filter(sale -> !sale.getCreatedAt().isBefore(monthStart) && !sale.getCreatedAt().isAfter(monthEnd))
                    .collect(Collectors.toList());
            
            Map<String, Object> monthData = new HashMap<>();
            monthData.put("date", start.toString());
            monthData.put("sales", monthlySales.size());
            monthData.put("revenue", monthlySales.stream().mapToDouble(PharmacySale::getTotal).sum());
            monthlyTrends.add(monthData);
            
            start = start.plusMonths(1);
        }
        stats.put("monthlyTrends", monthlyTrends);
        
        // Get stock alerts
        List<Medicine> medicines = medicineRepository.findAll();
        List<Map<String, Object>> stockAlerts = medicines.stream()
                .filter(m -> m.getStock() <= 20) // Alert threshold
                .map(m -> {
                    Map<String, Object> alert = new HashMap<>();
                    alert.put("medicineId", m.getId());
                    alert.put("medicineName", m.getName());
                    alert.put("currentStock", m.getStock());
                    alert.put("reorderPoint", 20); // Reorder threshold
                    return alert;
                })
                .collect(Collectors.toList());

                stats.put("stockAlerts", stockAlerts != null ? stockAlerts : new ArrayList<>());

        // --- Add expiry alerts ---
        LocalDate today = LocalDate.now();
        LocalDate expiryThreshold = today.plusMonths(3); // e.g., alert for expiry within 3 months
        List<Map<String, Object>> expiryAlerts = medicines.stream()
    .filter(m -> m.getDateOfExpiry() != null && !m.getDateOfExpiry().isAfter(expiryThreshold))
    .map(m -> {
        Map<String, Object> alert = new HashMap<>();
        alert.put("medicineId", m.getId());
        alert.put("medicineName", m.getName());
        alert.put("expiryDate", m.getDateOfExpiry());
        return alert;
    })
    .collect(Collectors.toList());
        stats.put("expiryAlerts", expiryAlerts);

        return stats;
    }
    
    public List<Map<String, Object>> calculateMonthlyTrends(LocalDate startDate, LocalDate endDate) {
        List<Map<String, Object>> trends = new ArrayList<>();
        LocalDate current = startDate.withDayOfMonth(1);
        LocalDate end = endDate.withDayOfMonth(1);

        while (!current.isAfter(end)) {
            LocalDate monthStart = current.withDayOfMonth(1);
            LocalDate monthEnd = current.withDayOfMonth(current.lengthOfMonth());

            // Query patients created in this month
            List<Patient> patients = patientRepository.findByCreatedAtBetween(
                monthStart.atStartOfDay(), monthEnd.atTime(23, 59, 59)
            );

            Map<String, Object> monthData = new HashMap<>();
            monthData.put("date", monthStart.format(DateTimeFormatter.ofPattern("yyyy-MM")));
            monthData.put("newPatients", patients.size());

            // Query returning patients for this month (implement as needed)
            Long returningPatients = appointmentRepository.countPatientsWithMultipleAppointments(monthStart, monthEnd);
            if (returningPatients == null) returningPatients = 0L;
            monthData.put("returningPatients", returningPatients);

            trends.add(monthData);

            current = current.plusMonths(1);
        }
        return trends;
    }
    
    private List<Map<String, Object>> calculateAppointmentTrends(LocalDate startDate, LocalDate endDate) {
        List<Map<String, Object>> trends = new ArrayList<>();
        YearMonth start = YearMonth.from(startDate);
        YearMonth end = YearMonth.from(endDate);
        
        while (!start.isAfter(end)) {
            LocalDate monthStart = start.atDay(1);
            LocalDate monthEnd = start.atEndOfMonth();
            
            List<Appointment> monthlyAppointments = appointmentRepository.findByDateBetween(monthStart, monthEnd);
            
            Map<String, Object> monthData = new HashMap<>();
            monthData.put("date", start.toString());
            monthData.put("total", monthlyAppointments.size());
            monthData.put("completed", monthlyAppointments.stream()
                    .filter(a -> "completed".equals(a.getStatus()))
                    .count());
            monthData.put("cancelled", monthlyAppointments.stream()
                    .filter(a -> "cancelled".equals(a.getStatus()))
                    .count());
            monthData.put("noShow", monthlyAppointments.stream()
                    .filter(a -> "no-show".equals(a.getStatus()))
                    .count());
            
            trends.add(monthData);
            start = start.plusMonths(1);
        }
        
        return trends;
    }
    
    private List<Map<String, Object>> calculateFinancialTrends(LocalDate startDate, LocalDate endDate) {
        List<Map<String, Object>> trends = new ArrayList<>();
        YearMonth start = YearMonth.from(startDate);
        YearMonth end = YearMonth.from(endDate);
        
        while (!start.isAfter(end)) {
            LocalDate monthStart = start.atDay(1);
            LocalDate monthEnd = start.atEndOfMonth();
            LocalDateTime monthStartTime = monthStart.atStartOfDay();
            LocalDateTime monthEndTime = monthEnd.atTime(23, 59, 59);

            List<Appointment> appointments = appointmentRepository.findByDateBetween(monthStart, monthEnd);
            List<Long> appointmentIds = appointments.stream().map(Appointment::getId).toList();
            List<Amount> amounts = appointmentIds.isEmpty() ? List.of() : amountRepository.findByAppointmentIdIn(appointmentIds);

            double appointmentRevenue = amounts.stream()
                    .mapToDouble(Amount::getAmount)
                    .sum();

            List<PharmacySale> sales = pharmacySaleRepository.findByCreatedAtBetween(monthStartTime, monthEndTime);
            double pharmacyRevenue = sales.stream()
                    .mapToDouble(PharmacySale::getTotal)
                    .sum();

            Map<String, Object> monthData = new HashMap<>();
            monthData.put("date", start.toString());
            monthData.put("totalRevenue", appointmentRevenue + pharmacyRevenue);
            monthData.put("appointmentRevenue", appointmentRevenue);
            monthData.put("pharmacyRevenue", pharmacyRevenue);

            trends.add(monthData);
            start = start.plusMonths(1);
        }
        
        return trends;
    }
    
    private List<Map<String, Object>> calculateTopProcedures(List<Appointment> appointments, List<Amount> amounts) {
        // Map appointmentId to total amount (sum of all payments for that appointment)
        Map<Long, Double> appointmentAmountMap = amounts.stream()
            .collect(Collectors.groupingBy(
                Amount::getAppointmentId,
                Collectors.summingDouble(Amount::getAmount)
            ));

        return appointments.stream()
                .collect(Collectors.groupingBy(
                        Appointment::getType,
                        Collectors.collectingAndThen(
                                Collectors.toList(),
                                list -> {
                                    Map<String, Object> stats = new HashMap<>();
                                    stats.put("type", list.get(0).getType());
                                    stats.put("count", list.size());
                                    double revenue = list.stream()
                                            .mapToDouble(a -> appointmentAmountMap.getOrDefault(a.getId(), 0.0))
                                            .sum();
                                    stats.put("revenue", revenue);
                                    return stats;
                                }
                        )
                ))
                .values()
                .stream()
                .sorted((a, b) -> Double.compare((Double) b.get("revenue"), (Double) a.get("revenue")))
                .collect(Collectors.toList());
    }
}
