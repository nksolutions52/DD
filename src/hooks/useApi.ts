import { useState, useEffect, useRef, useCallback } from 'react';
import api from '../services/api';

// Simple cache for non-paginated API calls
const apiCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 2 * 60 * 1000; // 2 minutes for regular API calls

interface UseApiOptions<T> {
  initialData?: T;
  onError?: (error: Error) => void;
  enableCache?: boolean;
  cacheKey?: string;
}

export function useApi<T>(
  apiFunction: () => Promise<T>,
  options: UseApiOptions<T> = {}
) {
  const [data, setData] = useState<T | undefined>(options.initialData);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Use refs to prevent duplicate calls
  const isMountedRef = useRef(true);
  const currentRequestRef = useRef<string | null>(null);
  const isInitializedRef = useRef(false);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const fetchData = useCallback(async (force = false) => {
    const requestId = `${Date.now()}-${Math.random()}`;
    
    // Prevent duplicate requests
    if (currentRequestRef.current === requestId && !force) {
      return;
    }
    
    currentRequestRef.current = requestId;

    const cacheKey = options.cacheKey || apiFunction.toString();
    const now = Date.now();
    
    try {
      // Check cache first if enabled and not forced
      if (options.enableCache !== false && !force) {
        const cachedEntry = apiCache.get(cacheKey);
        if (cachedEntry && (now - cachedEntry.timestamp) < CACHE_DURATION) {
          if (isMountedRef.current) {
            setData(cachedEntry.data);
            setError(null);
            setIsLoading(false);
          }
          return;
        }
      }

      if (isMountedRef.current) {
        setIsLoading(true);
        setError(null);
      }

      console.log('Making API call for:', cacheKey);
      const result = await apiFunction();
      console.log('API response received:', result);
      
      if (isMountedRef.current && currentRequestRef.current === requestId) {
        setData(result);
        setError(null);
        setIsLoading(false);
        
        // Cache the result if enabled
        if (options.enableCache !== false) {
          apiCache.set(cacheKey, {
            data: result,
            timestamp: now,
          });
        }
      }
    } catch (err) {
      console.error('API call failed:', err);
      if (isMountedRef.current && currentRequestRef.current === requestId) {
        const error = err instanceof Error ? err : new Error('An error occurred');
        setError(error);
        setIsLoading(false);
        if (options.onError) {
          options.onError(error);
        }
      }
    } finally {
      if (currentRequestRef.current === requestId) {
        currentRequestRef.current = null;
      }
    }
  }, [apiFunction, options]);

  useEffect(() => {
    if (!isInitializedRef.current) {
      isInitializedRef.current = true;
      fetchData();
    }
  }, [fetchData]);

  return { data, error, isLoading, refetch: fetchData };
}

export function useUsers() {
  return useApi(() => api.users.getAll() as Promise<any[]>, {
    enableCache: true,
    cacheKey: 'users-all',
  });
}

export function useDentists() {
  return useApi(() => api.users.getDentists(), {
    enableCache: true,
    cacheKey: 'dentists',
  });
}

export function useUser(id: number) {
  return useApi(() => api.users.getById(id), {
    enableCache: true,
    cacheKey: `user-${id}`,
  });
}

export function useRoles() {
  return useApi(() => api.roles.getAll(), {
    enableCache: true,
    cacheKey: 'roles',
  });
}

export function useRole(id: number) {
  return useApi(() => api.roles.getById(id), {
    enableCache: true,
    cacheKey: `role-${id}`,
  });
}

export function usePatients() {
  return useApi(() => api.patients.getAll() as Promise<any[]>, {
    enableCache: true,
    cacheKey: 'patients-all',
  });
}

export function usePatient(id: number) {
  return useApi(() => api.patients.getById(id), {
    enableCache: true,
    cacheKey: `patient-${id}`,
  });
}

export function useAppointments() {
  return useApi(() => api.appointments.getAll() as Promise<any[]>, {
    enableCache: true,
    cacheKey: 'appointments-all',
  });
}

export function useAppointmentsByDate(date: string) {
  return useApi(() => api.appointments.getByDate(date), {
    enableCache: true,
    cacheKey: `appointments-date-${date}`,
  });
}

export function useAppointmentsByMonth(year: number, month: number) {
  return useApi(() => api.appointments.getByMonth(year, month), {
    enableCache: true,
    cacheKey: `appointments-month-${year}-${month}`,
  });
}

export function useAppointmentsByWeek(date: string) {
  return useApi(() => api.appointments.getByWeek(date), {
    enableCache: true,
    cacheKey: `appointments-week-${date}`,
  });
}

export function useAppointmentsByPatient(patientId: number) {
  return useApi(() => api.appointments.getByPatientId(patientId), {
    enableCache: true,
    cacheKey: `appointments-patient-${patientId}`,
  });
}

export function useMedicines() {
  return useApi(() => api.medicines.getAll() as Promise<any[]>, {
    enableCache: true,
    cacheKey: 'medicines-all',
  });
}

export function useMedicine(id: number) {
  return useApi(() => api.medicines.getById(id), {
    enableCache: true,
    cacheKey: `medicine-${id}`,
  });
}

export function usePrescriptions() {
  return useApi(() => api.prescriptions.getAll(), {
    enableCache: true,
    cacheKey: 'prescriptions-all',
  });
}

export function usePrescriptionsByPatient(patientId: number) {
  return useApi(() => api.prescriptions.getByPatientId(patientId), {
    enableCache: true,
    cacheKey: `prescriptions-patient-${patientId}`,
  });
}

export function usePrescription(id: number) {
  return useApi(() => api.prescriptions.getById(id), {
    enableCache: true,
    cacheKey: `prescription-${id}`,
  });
}

export function useTreatments() {
  return useApi(() => api.treatments.getAll(), {
    enableCache: true,
    cacheKey: 'treatments-all',
  });
}

export function useTreatment(id: number) {
  return useApi(() => api.treatments.getById(id), {
    enableCache: true,
    cacheKey: `treatment-${id}`,
  });
}

export function useTreatmentsByPatient(patientId: number) {
  return useApi(() => api.treatments.getByPatientId(patientId), {
    enableCache: true,
    cacheKey: `treatments-patient-${patientId}`,
  });
}

export function useAmounts() {
  return useApi(() => api.amounts.getAll(), {
    enableCache: true,
    cacheKey: 'amounts-all',
  });
}

export function useAmount(id: number) {
  return useApi(() => api.amounts.getById(id), {
    enableCache: true,
    cacheKey: `amount-${id}`,
  });
}

export function useAmountsByPatient(patientId: number) {
  return useApi(() => api.amounts.getByPatientId(patientId), {
    enableCache: true,
    cacheKey: `amounts-patient-${patientId}`,
  });
}