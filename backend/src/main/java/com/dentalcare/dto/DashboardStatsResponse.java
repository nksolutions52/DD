package com.dentalcare.dto;

import java.util.List;
import java.util.Map;

public class DashboardStatsResponse {
    private long todayAppointments;
    private long totalAppointments;
    private long totalPatients;
    private long totalUsers;
    private List<UpcomingAppointmentDto> upcomingAppointments;
    private List<RecentPatientDto> recentPatients;
    private List<StatisticDto> appointmentsByType;
    private List<StatisticDto> appointmentsByStatus;
    private List<StatisticDto> treatmentsByType;

    // Constructors
    public DashboardStatsResponse() {}

    // Getters and setters
    public long getTodayAppointments() {
        return todayAppointments;
    }

    public void setTodayAppointments(long todayAppointments) {
        this.todayAppointments = todayAppointments;
    }

    public long getTotalAppointments() {
        return totalAppointments;
    }

    public void setTotalAppointments(long totalAppointments) {
        this.totalAppointments = totalAppointments;
    }

    public long getTotalPatients() {
        return totalPatients;
    }

    public void setTotalPatients(long totalPatients) {
        this.totalPatients = totalPatients;
    }

    public long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public List<UpcomingAppointmentDto> getUpcomingAppointments() {
        return upcomingAppointments;
    }

    public void setUpcomingAppointments(List<UpcomingAppointmentDto> upcomingAppointments) {
        this.upcomingAppointments = upcomingAppointments;
    }

    public List<RecentPatientDto> getRecentPatients() {
        return recentPatients;
    }

    public void setRecentPatients(List<RecentPatientDto> recentPatients) {
        this.recentPatients = recentPatients;
    }

    public List<StatisticDto> getAppointmentsByType() {
        return appointmentsByType;
    }

    public void setAppointmentsByType(List<StatisticDto> appointmentsByType) {
        this.appointmentsByType = appointmentsByType;
    }

    public List<StatisticDto> getAppointmentsByStatus() {
        return appointmentsByStatus;
    }

    public void setAppointmentsByStatus(List<StatisticDto> appointmentsByStatus) {
        this.appointmentsByStatus = appointmentsByStatus;
    }

    public List<StatisticDto> getTreatmentsByType() {
        return treatmentsByType;
    }

    public void setTreatmentsByType(List<StatisticDto> treatmentsByType) {
        this.treatmentsByType = treatmentsByType;
    }

    // Inner classes for nested data
    public static class UpcomingAppointmentDto {
        private Long id;
        private String patientName;
        private String dentistName;
        private String date;
        private String startTime;
        private String endTime;
        private String status;
        private String type;
        private String treatmentType;
        private Long patientId;

        // Constructors
        public UpcomingAppointmentDto() {}

        public UpcomingAppointmentDto(Long id, String patientName, String dentistName, 
                                    String date, String startTime, String endTime, 
                                    String status, String type, String treatmentType, Long patientId) {
            this.id = id;
            this.patientName = patientName;
            this.dentistName = dentistName;
            this.date = date;
            this.startTime = startTime;
            this.endTime = endTime;
            this.status = status;
            this.type = type;
            this.treatmentType = treatmentType;
            this.patientId = patientId;
        }

        // Getters and setters
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getPatientName() { return patientName; }
        public void setPatientName(String patientName) { this.patientName = patientName; }
        public String getDentistName() { return dentistName; }
        public void setDentistName(String dentistName) { this.dentistName = dentistName; }
        public String getDate() { return date; }
        public void setDate(String date) { this.date = date; }
        public String getStartTime() { return startTime; }
        public void setStartTime(String startTime) { this.startTime = startTime; }
        public String getEndTime() { return endTime; }
        public void setEndTime(String endTime) { this.endTime = endTime; }
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
        public String getType() { return type; }
        public void setType(String type) { this.type = type; }
        public String getTreatmentType() { return treatmentType; }
        public void setTreatmentType(String treatmentType) { this.treatmentType = treatmentType; }
        public Long getPatientId() { return patientId; }
        public void setPatientId(Long patientId) { this.patientId = patientId; }
    }

    public static class RecentPatientDto {
        private Long id;
        private String firstName;
        private String lastName;
        private String phone;
        private String lastVisit;

        // Constructors
        public RecentPatientDto() {}

        public RecentPatientDto(Long id, String firstName, String lastName, String phone, String lastVisit) {
            this.id = id;
            this.firstName = firstName;
            this.lastName = lastName;
            this.phone = phone;
            this.lastVisit = lastVisit;
        }

        // Getters and setters
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getFirstName() { return firstName; }
        public void setFirstName(String firstName) { this.firstName = firstName; }
        public String getLastName() { return lastName; }
        public void setLastName(String lastName) { this.lastName = lastName; }
        public String getPhone() { return phone; }
        public void setPhone(String phone) { this.phone = phone; }
        public String getLastVisit() { return lastVisit; }
        public void setLastVisit(String lastVisit) { this.lastVisit = lastVisit; }
    }

    public static class StatisticDto {
        private String name;
        private long value;

        // Constructors
        public StatisticDto() {}

        public StatisticDto(String name, long value) {
            this.name = name;
            this.value = value;
        }

        // Getters and setters
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public long getValue() { return value; }
        public void setValue(long value) { this.value = value; }
    }
}