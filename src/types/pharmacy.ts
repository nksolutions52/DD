export type MedicineType = 'tablet' | 'injection' | 'syrup' | 'capsule' | 'cream' | 'drops' | 'powder' | 'other';

export interface Medicine {
  id: number;
  name: string;
  type: MedicineType;
  description?: string;
  manufacturer?: string;
  stock: number;
  unit: string;
  price: number;
  createdAt: string;
  updatedAt: string;
   dateOfMfg?: string;    
  dateOfExpiry?: string; 
}

export interface PrescriptionItem {
  medicineId: number;
  medicineName: string;
  medicineType: MedicineType;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
}

export interface Prescription {
  id: number;
  patientId: number;
  patientName: string;
  appointmentId: number;
  dentistId: number;
  dentistName: string;
  items: PrescriptionItem[];
  notes?: string;
  createdAt: string;
}