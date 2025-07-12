// Auth types
export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

// Role types
export interface Role {
  id: number;
  name: string;
  description?: string;
  permissions: Record<string, boolean>;
  createdAt: string;
}

// User types
export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  roleEntity?: Role;
  avatar?: string;
}

// Patient types
export interface Patient {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  medicalHistory?: string;
  insuranceInfo?: string;
  createdAt: string;
  lastVisit?: string;
}

// Appointment types
export interface Appointment {
  id: number;
  patientId: number;
  patientName: string;
  dentistId: number;
  dentistName: string;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
  type: string;
  treatmentType: string; 
  notes?: string;
  amount?: number;
  createdAt: string;
}

// Calendar types
export type CalendarViewType = 'month' | 'week' | 'day';

// Report types
export type ReportPeriod = 'monthly' | 'quarterly' | 'yearly';

export interface ReportFilter {
  period: ReportPeriod;
  startDate: string;
  endDate: string;
}

// Report types
export interface Report {
  id: number;
  title: string;
  type: 'patient' | 'appointment' | 'financial' | 'performance';
  period: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom';
  startDate?: string;
  endDate?: string;
  createdAt: string;
  data: any;
}

export interface DashboardStats {
  todayAppointments: number;
  totalAppointments: number;
  totalPatients: number;
  totalUsers: number;
  upcomingAppointments: Appointment[];
  recentPatients: Patient[];
  appointmentsByType: Array<{ name: string; value: number }>;
  appointmentsByStatus: Array<{ name: string; value: number }>;
  treatmentsByTypeData: Array<{ name: string; value: number }>;
}

// Pharmacy types
export interface PharmacyCustomer {
  id: number;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  createdAt: string;
}

export interface PharmacySale {
  id: number;
  customerId: number;
  customerName: string;
  customerPhone: string;
  items: PharmacySaleItem[];
  subtotal: number;
  sgst: number;
  cgst: number;
  discount: number;
  total: number;
  createdAt: string;
}

export interface PharmacySaleItem {
  medicineId: number;
  medicineName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Sale {
  id: number;
  prescriptionId?: number;
  patientId?: number;
  patientName?: string;
  appointmentId?: number;
  items: SaleItem[];
  totalAmount: number;
  createdAt: string;
}

export interface SaleItem {
  medicineId: number;
  medicineName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

// Report Statistics Types
export interface PatientStatistics {
  totalPatients: number;
  newPatients: number;
  returningPatients: number;
  averageAge: number;
  genderDistribution: {
    male: number;
    female: number;
    other: number;
  };
  monthlyTrends: Array<{
    date: string;
    newPatients: number;
    returningPatients: number;
  }>;
}

export interface AppointmentStatistics {
  totalAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
  noShowAppointments: number;
  typeDistribution: {
    [key: string]: number;
  };
  monthlyTrends: Array<{
    date: string;
    total: number;
    completed: number;
  }>;
}

export interface FinancialStatistics {
  totalRevenue: number;
  appointmentRevenue: number;
  pharmacyRevenue: number;
  averageAppointmentValue: number;
  monthlyTrends: Array<{
    date: string;
    totalRevenue: number;
    appointmentRevenue: number;
    pharmacyRevenue: number;
  }>;
  topProcedures: Array<{
    type: string;
    revenue: number;
  }>;
}

export interface PharmacyStatistics {
  totalSales: number;
  totalRevenue: number;
  averageSaleValue: number;
  topSellingMedicines: Array<{
    medicineId: number;
    medicineName: string;
    quantity: number;
    revenue: number;
  }>;
  monthlyTrends: Array<{
    date: string;
    sales: number;
    revenue: number;
  }>;
  stockAlerts: Array<{
    medicineId: number;
    medicineName: string;
    currentStock: number;
    reorderPoint: number;
  }>;
}