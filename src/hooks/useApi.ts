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
  const [data, setData] = useState<T | null>(options.initialData ?? null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Track component mount state
  const isMountedRef = useRef(true);
  const abortControllerRef = useRef<AbortController | null>(null);
  const lastRequestRef = useRef<string>('');
  const hasInitializedRef = useRef(false);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const fetchData = useCallback(async (force = false) => {
    const cacheKey = options.cacheKey || apiFunction.toString();
    const requestKey = `${cacheKey}-${force}`;
    
    // Prevent duplicate requests only if we've already initialized and not forcing
    if (lastRequestRef.current === requestKey && !force && hasInitializedRef.current) {
      console.log('Preventing duplicate request:', requestKey);
      return;
    }
    
    lastRequestRef.current = requestKey;

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    abortControllerRef.current = new AbortController();

    const now = Date.now();
    
    try {
      // Check cache first if enabled and not forced and not first load
      if (options.enableCache !== false && !force && hasInitializedRef.current) {
        const cachedEntry = apiCache.get(cacheKey);
        if (cachedEntry && (now - cachedEntry.timestamp) < CACHE_DURATION) {
          console.log('Using cached data for:', cacheKey);
          if (isMountedRef.current) {
            setData(cachedEntry.data);
            setError(null);
            setIsLoading(false);
          }
          return;
        }
      }

      // Clear cache when forcing refresh
      if (force && options.enableCache !== false) {
        apiCache.delete(cacheKey);
        console.log('Cache cleared for forced refresh:', cacheKey);
      }

      console.log('Making API call for:', cacheKey);
      if (isMountedRef.current) {
        setIsLoading(true);
        setError(null);
      }

      const result = await apiFunction();
      console.log('API response received:', result);
      
      if (isMountedRef.current) {
        // Set data first, then update loading state
        setData(result);
        setError(null);
        hasInitializedRef.current = true;
        
        // Cache the result if enabled
        if (options.enableCache !== false) {
          apiCache.set(cacheKey, {
            data: result,
            timestamp: now,
          });
          console.log('Data cached with timestamp:', now);
        }
        
        // Set loading to false after data is set
        setIsLoading(false);
      }
    } catch (err: any) {
      // Don't handle aborted requests as errors
      if (err.name === 'AbortError') {
        return;
      }
      console.error('API call failed:', err);
      if (isMountedRef.current) {
        const error = err instanceof Error ? err : new Error('An error occurred');
        setError(error);
        hasInitializedRef.current = true;
        setIsLoading(false);
        if (options.onError) {
          options.onError(error);
        }
      }
    }
  }, [apiFunction, options]);

  useEffect(() => {
    fetchData();
  }, []);

  const refetch = useCallback((force = false) => {
    console.log('Refetch called with force:', force);
    // Clear the last request ID to allow refetch
    lastRequestRef.current = '';
    return fetchData(force);
  }, [fetchData]);

  return { data, error, isLoading, refetch };
}

export function useUsers() {
  return useApi(() => api.users.getAll() as Promise<any[]>, {
    enableCache: true,
    cacheKey: 'users-all',
    initialData: [],
  });
}

export function useDentists() {
  return useApi(() => api.users.getDentists(), {
    enableCache: true,
    cacheKey: 'dentists',
    initialData: [],
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
    initialData: [],
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
    initialData: [],
  });
}

export function usePatient(id: number) {
  return useApi(async () => {
    console.log('usePatient: Called with ID:', id);
    try {
      const response = await api.patients.getById(id);
      console.log('usePatient: API response for id', id, ':', response);
      return response;
    } catch (error) {
      console.error('usePatient: Error fetching patient', id, ':', error);
      throw error;
    }
  }, {
    enableCache: false, // Disable cache for debugging
    cacheKey: `patient-${id}`,
  });
}

export function useAppointments() {
  return useApi(() => api.appointments.getAll() as Promise<any[]>, {
    enableCache: true,
    cacheKey: 'appointments-all',
    initialData: [],
  });
}

export function useAppointmentsByDate(date: string) {
  return useApi(() => api.appointments.getByDate(date), {
    enableCache: true,
    cacheKey: `appointments-date-${date}`,
    initialData: [],
  });
}

export function useAppointmentsByMonth(year: number, month: number) {
  return useApi(() => api.appointments.getByMonth(year, month), {
    enableCache: true,
    cacheKey: `appointments-month-${year}-${month}`,
    initialData: [],
  });
}

export function useAppointmentsByWeek(date: string) {
  return useApi(() => api.appointments.getByWeek(date), {
    enableCache: true,
    cacheKey: `appointments-week-${date}`,
    initialData: [],
  });
}

export function useAppointmentsByPatient(patientId: number) {
  return useApi(() => api.appointments.getByPatientId(patientId), {
    enableCache: true,
    cacheKey: `appointments-patient-${patientId}`,
    initialData: [],
  });
}

export function useMedicines() {
  return useApi(() => api.medicines.getAll() as Promise<any[]>, {
    enableCache: true,
    cacheKey: 'medicines-all',
    initialData: [],
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
    initialData: [],
  });
}

export function usePrescriptionsByPatient(patientId: number) {
  return useApi(() => api.prescriptions.getByPatientId(patientId), {
    enableCache: true,
    cacheKey: `prescriptions-patient-${patientId}`,
    initialData: [],
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
    initialData: [],
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
    initialData: [],
  });
}

export function useAmounts() {
  return useApi(() => api.amounts.getAll(), {
    enableCache: true,
    cacheKey: 'amounts-all',
    initialData: [],
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
    initialData: [],
  });
}