import axios from 'axios';

const api = axios.create({
  // baseURL: 'http://localhost:8080/api',
  baseURL: 'https://dd-production-97ad.up.railway.app/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Add request interceptor to handle errors
api.interceptors.request.use(
  (config) => {
    // Add CORS headers to every request
    config.headers['Access-Control-Allow-Origin'] = 'http://localhost:5173';
    config.headers['Access-Control-Allow-Credentials'] = 'true';
    // Add production frontend URL for CORS
    config.headers['Access-Control-Allow-Origin'] = 'https://dd-three-liart.vercel.app';
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const auth = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
};

export const roles = {
  getAll: async () => {
    const response = await api.get('/roles');
    return response.data;
  },
  getById: async (id: number) => {
    const response = await api.get(`/roles/${id}`);
    return response.data;
  },
  create: async (role: any) => {
    const response = await api.post('/roles', role);
    return response.data;
  },
  update: async (id: number, role: any) => {
    const response = await api.put(`/roles/${id}`, role);
    return response.data;
  },
  delete: async (id: number) => {
    await api.delete(`/roles/${id}`);
  },
};

export const users = {
  getAll: async () => {
    const response = await api.get('/users');
    return response.data;
  },
  getDentists: async () => {
    const response = await api.get('/users/dentists');
    return response.data;
  },
  getById: async (id: number) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },
  create: async (user: any) => {
    const response = await api.post('/users', user);
    return response.data;
  },
  update: async (id: number, user: any) => {
    const response = await api.put(`/users/${id}`, user);
    return response.data;
  },
  delete: async (id: number) => {
    await api.delete(`/users/${id}`);
  },
};

export const patients = {
  getAll: async () => {
    const response = await api.get('/patients');
    return response.data;
  },
  getById: async (id: number) => {
    const response = await api.get(`/patients/${id}`);
    return response.data;
  },
  create: async (patient: any) => {
    const response = await api.post('/patients', patient);
    return response.data;
  },
  update: async (id: number, patient: any) => {
    const response = await api.put(`/patients/${id}`, patient);
    return response.data;
  },
  delete: async (id: number) => {
    await api.delete(`/patients/${id}`);
  },
  getByPhone: async (phone: string) => {
    try {
      const response = await api.get(`/patients/phone/${phone}`);
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        return null;
      }
      throw error;
    }
  },
  getBySearch: async (query: string) => {
    const response = await api.get(`/patients/search?query=${encodeURIComponent(query)}`);
    return response.data;
  },
};

export const appointments = {
  getAll: async () => {
    const response = await api.get('/appointments');
    return response.data;
  },
  getByDate: async (date: string) => {
    const response = await api.get(`/appointments/date/${date}`);
    return response.data;
  },
  getByMonth: async (year: number, month: number) => {
    const response = await api.get(`/appointments/month/${year}/${month}`);
    return response.data;
  },
  getByWeek: async (date: string) => {
    const response = await api.get(`/appointments/week/${date}`);
    return response.data;
  },
  getByPatientId: async (patientId: number) => {
    const response = await api.get(`/appointments/patient/${patientId}`);
    return response.data;
  },
  getById: async (id: number) => {
    const response = await api.get(`/appointments/${id}`);
    return response.data;
  },
  create: async (appointment: any) => {
    const response = await api.post('/appointments', appointment);
    return response.data;
  },
  update: async (id: number, appointment: any) => {
    const response = await api.put(`/appointments/${id}`, appointment);
    return response.data;
  },
  delete: async (id: number) => {
    await api.delete(`/appointments/${id}`);
  },
};

export const medicines = {
  getAll: async () => {
    const response = await api.get('/medicines');
    return response.data;
  },
  search: async (query: string) => {
    const response = await api.get(`/medicines/search?query=${encodeURIComponent(query)}`);
    return response.data;
  },
  getById: async (id: number) => {
    const response = await api.get(`/medicines/${id}`);
    return response.data;
  },
  create: async (medicine: any) => {
    const response = await api.post('/medicines', medicine);
    return response.data;
  },
  update: async (id: number, medicine: any) => {
    const response = await api.put(`/medicines/${id}`, medicine);
    return response.data;
  },
  delete: async (id: number) => {
    await api.delete(`/medicines/${id}`);
  },
};

export const manufacturers = {
  getAll: async () => {
    const response = await api.get('/manufacturers');
    return response.data;
  },
  create: async (manufacturer: any) => {
    const response = await api.post('/manufacturers', manufacturer);
    return response.data;
  },
  update: async (id: number, manufacturer: any) => {
    const response = await api.put(`/manufacturers/${id}`, manufacturer);
    return response.data;
  },
  delete: async (id: number) => {
    await api.delete(`/manufacturers/${id}`);
  },
};

export const medicineTypes = {
  getAll: async () => {
    const response = await api.get('/medicine-types');
    return response.data;
  },
  create: async (medicineType: any) => {
    const response = await api.post('/medicine-types', medicineType);
    return response.data;
  },
  update: async (id: number, medicineType: any) => {
    const response = await api.put(`/medicine-types/${id}`, medicineType);
    return response.data;
  },
  delete: async (id: number) => {
    await api.delete(`/medicine-types/${id}`);
  },
};

export const prescriptions = {
  getAll: async () => {
    const response = await api.get('/prescriptions');
    return response.data;
  },
  getByPatientId: async (patientId: number) => {
    const response = await api.get(`/prescriptions/patient/${patientId}`);
    return response.data;
  },
  getById: async (id: number) => {
    const response = await api.get(`/prescriptions/${id}`);
    return response.data;
  },
  create: async (prescription: any) => {
    const response = await api.post('/prescriptions', prescription);
    return response.data;
  },
  update: async (id: number, prescription: any) => {
    const response = await api.put(`/prescriptions/${id}`, prescription);
    return response.data;
  },
  delete: async (id: number) => {
    await api.delete(`/prescriptions/${id}`);
  },
};

export const pharmacySales = {
  getAll: async () => {
    const response = await api.get('/pharmacy-sales');
    return response.data;
  },
  getById: async (id: number) => {
    const response = await api.get(`/pharmacy-sales/${id}`);
    return response.data;
  },
  create: async (sale: any) => {
    const response = await api.post('/pharmacy-sales', sale);
    return response.data;
  },
};

export const pharmacyCustomers = {
  getByPhone: async (phone: string) => {
    try {
      const response = await api.get(`/pharmacy-customers/phone/${phone}`);
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        return null;
      }
      throw error;
    }
  },
  create: async (customer: any) => {
    const response = await api.post('/pharmacy-customers', customer);
    return response.data;
  },
};

export const reports = {
  getPatientStatistics: async (filter: any) => {
    const response = await api.get('/reports/patients', { params: filter });
    return response.data;
  },
  getAppointmentStatistics: async (filter: any) => {
    const response = await api.get('/reports/appointments', { params: filter });
    return response.data;
  },
  getFinancialStatistics: async (filter: any) => {
    const response = await api.get('/reports/financial', { params: filter });
    return response.data;
  },
  getPharmacyStatistics: async (filter: any) => {
    const response = await api.get('/reports/pharmacy', { params: filter });
    return response.data;
  },
};

export const treatments = {
  getAll: async () => {
    const response = await api.get('/treatments');
    return response.data;
  },
  getByPatientId: async (patientId: number) => {
    const response = await api.get(`/treatments/patient/${patientId}`);
    return response.data;
  },
  getById: async (id: number) => {
    const response = await api.get(`/treatments/${id}`);
    return response.data;
  },
  create: async (treatment: any) => {
    const response = await api.post('/treatments', treatment);
    return response.data;
  },
  update: async (id: number, treatment: any) => {
    const response = await api.put(`/treatments/${id}`, treatment);
    return response.data;
  },
  delete: async (id: number) => {
    await api.delete(`/treatments/${id}`);
  },
};

export const amounts = {
  getByAppointmentId: async (appointmentId: number) => {
    const response = await api.get(`/amounts/appointment/${appointmentId}`);
    return response.data;
  },
  getByPatientId: async (patientId: number) => {
    const response = await api.get(`/amounts/patient/${patientId}`);
    return response.data;
  },
  create: async (amount: any) => {
    const response = await api.post('/amounts', amount);
    return response.data;
  },
};

const apiService = {
  auth,
  roles,
  users,
  patients,
  appointments,
  medicines,
  manufacturers,
  medicineTypes,
  prescriptions,
  pharmacySales,
  pharmacyCustomers,
  reports,
  treatments,
  amounts,
};

export default apiService;