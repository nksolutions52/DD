import { useState, useEffect } from 'react';
import { Appointment } from '../../types';
import { usePatients, useDentists } from '../../hooks/useApi';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api'; // Make sure you import your api

interface AppointmentFormProps {
  appointment?: Partial<Appointment>;
  onSubmit: (appointment: Appointment) => void;
  onCancel: () => void;
}

const AppointmentForm = ({ appointment, onSubmit, onCancel }: AppointmentFormProps) => {
  const { data: patients = [], isLoading: isLoadingPatients } = usePatients();
  const { data: dentists = [], isLoading: isLoadingDentists } = useDentists();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState<Partial<Appointment>>({
    patientId: appointment?.patientId || 0,
    patientName: appointment?.patientName || '',
    dentistId: appointment?.dentistId || user?.id || 0,
    dentistName: appointment?.dentistName || user?.name || '',
    date: appointment?.date || new Date().toISOString().split('T')[0],
    startTime: appointment?.startTime || '09:00',
    endTime: appointment?.endTime || '09:30',
    status: appointment?.status || '',
    type: appointment?.type || '',
    notes: appointment?.notes || '',
    treatmentType: appointment?.treatmentType || '',
  });

  // Update form data when appointment prop changes
  useEffect(() => {
    if (appointment) {
      setFormData({
        ...appointment,
        date: appointment.date || new Date().toISOString().split('T')[0],
      });
    }
  }, [appointment]);

  const [errors, setErrors] = useState<Partial<Record<keyof Appointment, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [patientIdInput, setPatientIdInput] = useState('');
  const [patientNameInput, setPatientNameInput] = useState('');
  const [patientOptions, setPatientOptions] = useState<any[]>([]);
  const [showPatientDropdown, setShowPatientDropdown] = useState(false);

  // When user types ID, fetch patient by ID and auto-fill name
  useEffect(() => {
    if (patientIdInput.trim() === '') {
      setShowPatientDropdown(false);
      return;
    }
    const timeout = setTimeout(async () => {
      try {
        const patient = await api.patients.getById(Number(patientIdInput));
        if (patient) {
          setFormData((prev) => ({
            ...prev,
            patientId: patient.id,
            patientName: `${patient.firstName} ${patient.lastName}`,
          }));
          setPatientNameInput(`${patient.firstName} ${patient.lastName}`);
        } else {
          setFormData((prev) => ({
            ...prev,
            patientId: 0,
            patientName: '',
          }));
          setPatientNameInput('');
        }
      } catch {
        setFormData((prev) => ({
          ...prev,
          patientId: 0,
          patientName: '',
        }));
        setPatientNameInput('');
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, [patientIdInput]);

  // When user types name, fetch matching patients and show dropdown
  useEffect(() => {
    if (patientNameInput.trim() === '') {
      setPatientOptions([]);
      setShowPatientDropdown(false);
      return;
    }
    const timeout = setTimeout(async () => {
      const results = await api.patients.getBySearch(patientNameInput);
      setPatientOptions(results);
      setShowPatientDropdown(results.length > 0);
    }, 300);
    return () => clearTimeout(timeout);
  }, [patientNameInput]);

  // When user selects a patient from name dropdown
  const handlePatientSelect = (patient: any) => {
    setFormData((prev) => ({
      ...prev,
      patientId: patient.id,
      patientName: `${patient.firstName} ${patient.lastName}`,
    }));
    setPatientIdInput(patient.id.toString());
    setPatientNameInput(`${patient.firstName} ${patient.lastName}`);
    setPatientOptions([]);
    setShowPatientDropdown(false);
  };

  const getAppointmentTypes = () => {
    switch (formData.treatmentType) {
      case 'hair':
        return [
          { value: 'PRP', label: 'PRP' },
          { value: 'HT', label: 'HT' },
          { value: 'consultation', label: 'Consultation' },
          { value: 'check-up', label: 'Check-up' },
        ];
      case 'skin':
        return [
          { value: 'hydrofacial', label: 'Hydrofacial' },
          { value: 'IV', label: 'IV' },
          { value: 'consultation', label: 'Consultation' },
          { value: 'check-up', label: 'Check-up' },
        ];
      case 'dental':
      default:
        return [
          { value: 'check-up', label: 'Check-up' },
          { value: 'cleaning', label: 'Cleaning' },
          { value: 'filling', label: 'Filling' },
          { value: 'extraction', label: 'Extraction' },
          { value: 'root-canal', label: 'Root Canal' },
          { value: 'consultation', label: 'Consultation' },
          { value: 'other', label: 'Other' }
        ];
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    
    if (name === 'patientId') {
      const patientId = parseInt(value);
      const patient = patients.find((p:any) => p.id === patientId);
      
      setFormData((prev) => ({
        ...prev,
        patientId,
        patientName: patient ? `${patient.firstName} ${patient.lastName}` : '',
      }));
    } else if (name === 'dentistId') {
      const dentistId = parseInt(value);
      const dentist = dentists.find((d:any) => d.id === dentistId);
      
      setFormData((prev) => ({
        ...prev,
        dentistId,
        dentistName: dentist ? dentist.name : '',
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    
    // Clear error when field is changed
    if (errors[name as keyof Appointment]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // Auto-calculate end time based on start time and appointment type
  const handleStartTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const startTime = e.target.value;
    let duration = 30; // Default duration in minutes
    
    // Adjust duration based on appointment type
    if (formData.type === 'filling' || formData.type === 'root-canal' || formData.type === 'extraction') {
      duration = 60;
    } else if (formData.type === 'consultation') {
      duration = 45;
    }
    
    // Calculate end time
    const [hours, minutes] = startTime.split(':').map(Number);
    const endDate = new Date();
    endDate.setHours(hours, minutes + duration, 0, 0);
    
    const endHours = endDate.getHours().toString().padStart(2, '0');
    const endMinutes = endDate.getMinutes().toString().padStart(2, '0');
    const endTime = `${endHours}:${endMinutes}`;
    
    setFormData((prev) => ({ ...prev, startTime, endTime }));
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof Appointment, string>> = {};
    
    if (!formData.patientId) {
      newErrors.patientId = 'Patient is required';
    }
    
    if (!formData.dentistId) {
      newErrors.dentistId = 'Dentist is required';
    }
    
    if (!formData.date) {
      newErrors.date = 'Date is required';
    }
    
    if (!formData.startTime) {
      newErrors.startTime = 'Start time is required';
    }
    
    if (!formData.endTime) {
      newErrors.endTime = 'End time is required';
    }
    
    if (!formData.type) {
      newErrors.type = 'Appointment type is required';
    }
     if (!formData.treatmentType) {
      newErrors.treatmentType = 'Treatment type is required';
    }
     if (!formData.status) {
      newErrors.status = 'Status type is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate() || isSubmitting) {
      return;
    }

    try {
      setIsSubmitting(true);

      // Ensure all required fields are present
      const appointmentData: Appointment = {
        id: appointment?.id || 0,
        patientId: formData.patientId!,
        patientName: formData.patientName!,
        dentistId: formData.dentistId!,
        dentistName: formData.dentistName!,
        date: formData.date!,
        startTime: formData.startTime!,
        endTime: formData.endTime!,
        status: formData.status!,
        type: formData.type!,
        notes: formData.notes,
        treatmentType: formData.treatmentType!, // <-- Add this line
        createdAt: appointment?.createdAt || new Date().toISOString()
      };
      
      onSubmit(appointmentData);
    } catch (error) {
      console.error('Failed to submit appointment:', error);
      setErrors((prev) => ({
        ...prev,
        submit: 'Failed to submit appointment. Please try again.',
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingPatients || isLoadingDentists) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-neutral-500">Loading...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          {/* <label htmlFor="patientId" className="block text-sm font-medium text-neutral-700">
            Patient*
          </label> */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="patientIdInput" className="block text-sm font-medium text-neutral-700">
                ID*
              </label>
              <input
                id="patientIdInput"
                name="patientIdInput"
                type="number"
                value={patientIdInput}
                onChange={e => setPatientIdInput(e.target.value)}
                className={`input mt-1 block w-full ${errors.patientId ? 'border-error-500 ring-error-500' : ''}`}
                disabled={isSubmitting}
                placeholder="Enter Patient ID"
              />
            </div>
            <div className="relative">
              <label htmlFor="patientNameInput" className="block text-sm font-medium text-neutral-700">
                Patient Name*
              </label>
              <input
                id="patientNameInput"
                name="patientNameInput"
                type="text"
                autoComplete="off"
                value={patientNameInput}
                onChange={e => {
                  setPatientNameInput(e.target.value);
                  setFormData((prev) => ({
                    ...prev,
                    patientId: 0,
                    patientName: '',
                  }));
                }}
                className={`input mt-1 block w-full ${errors.patientId ? 'border-error-500 ring-error-500' : ''}`}
                disabled={isSubmitting}
                placeholder="Search by name"
                onFocus={() => setShowPatientDropdown(patientOptions.length > 0)}
              />
              {showPatientDropdown && (
                <ul className="absolute z-10 mt-1 w-full bg-white border border-neutral-200 rounded shadow max-h-48 overflow-auto">
                  {patientOptions.map((patient) => (
                    <li
                      key={patient.id}
                      className="px-4 py-2 cursor-pointer hover:bg-primary-50"
                      onClick={() => handlePatientSelect(patient)}
                    >
                      {patient.firstName} {patient.lastName} (ID: {patient.id})
                    </li>
                  ))}
                  {patientOptions.length === 0 && (
                    <li className="px-4 py-2 text-neutral-500">No matches found</li>
                  )}
                </ul>
              )}
            </div>
          </div>
          {errors.patientId && <p className="mt-1 text-sm text-error-500">{errors.patientId}</p>}
        </div>
        
        <div>
          <label htmlFor="dentistId" className="block text-sm font-medium text-neutral-700">
            Dentist*
          </label>
          <select
            id="dentistId"
            name="dentistId"
            value={formData.dentistId || ''}
            onChange={handleChange}
            className={`input mt-1 block w-full ${errors.dentistId ? 'border-error-500 ring-error-500' : ''}`}
            disabled={isSubmitting}
          >
            <option value="">Select Dentist</option>
            {dentists.map((dentist:any) => (
              <option key={dentist.id} value={dentist.id}>
                {dentist.name}
              </option>
            ))}
          </select>
          {errors.dentistId && <p className="mt-1 text-sm text-error-500">{errors.dentistId}</p>}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-neutral-700">
            Date*
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className={`input mt-1 block w-full ${errors.date ? 'border-error-500 ring-error-500' : ''}`}
            disabled={isSubmitting}
          />
          {errors.date && <p className="mt-1 text-sm text-error-500">{errors.date}</p>}
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="startTime" className="block text-sm font-medium text-neutral-700">
              Start Time*
            </label>
            <input
              type="time"
              id="startTime"
              name="startTime"
              value={formData.startTime}
              onChange={handleStartTimeChange}
              className={`input mt-1 block w-full ${errors.startTime ? 'border-error-500 ring-error-500' : ''}`}
              disabled={isSubmitting}
            />
            {errors.startTime && <p className="mt-1 text-sm text-error-500">{errors.startTime}</p>}
          </div>
          <div>
            <label htmlFor="endTime" className="block text-sm font-medium text-neutral-700">
              End Time*
            </label>
            <input
              type="time"
              id="endTime"
              name="endTime"
              value={formData.endTime}
              onChange={handleChange}
              className={`input mt-1 block w-full ${errors.endTime ? 'border-error-500 ring-error-500' : ''}`}
              disabled={isSubmitting}
            />
            {errors.endTime && <p className="mt-1 text-sm text-error-500">{errors.endTime}</p>}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         <div>
          <label htmlFor="treatmentType" className="block text-sm font-medium text-neutral-700">
            Treatment Type*
          </label>
          <select
            id="treatmentType"
            name="treatmentType"
            value={formData.treatmentType}
            onChange={(e) => {
              setFormData((prev) => ({
                ...prev,
                treatmentType: e.target.value,
                type: ''
              }));
              if (errors.type) setErrors((prev) => ({ ...prev, type: '' }));
              if (errors.treatmentType) setErrors((prev) => ({ ...prev, treatmentType: '' }));
            }}
            className={`input mt-1 block w-full ${errors.treatmentType ? 'border-error-500 ring-error-500' : ''}`}
            disabled={isSubmitting}
          >
            <option value="">Select Treatment Type</option>
            <option value="dental">Dental</option>
            <option value="hair">Hair</option>
            <option value="skin">Skin</option>
          </select>
          {errors.treatmentType && <p className="mt-1 text-sm text-error-500">{errors.treatmentType}</p>}
        </div>
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-neutral-700">
            Appointment Type*
          </label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            className={`input mt-1 block w-full ${errors.type ? 'border-error-500 ring-error-500' : ''}`}
            disabled={isSubmitting}
          >
            <option value="">Select Appointment Type</option>
            {getAppointmentTypes().map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          {errors.type && <p className="mt-1 text-sm text-error-500">{errors.type}</p>}
        </div>
        
        
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
       
         <div>
          <label htmlFor="status" className="block text-sm font-medium text-neutral-700">
            Status*
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className={`input mt-1 block w-full ${errors.status ? 'border-error-500 ring-error-500' : ''}`}
            disabled={isSubmitting}
          >
            <option value="">Select Status </option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          {errors.status && <p className="mt-1 text-sm text-error-500">{errors.status}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-neutral-700">
          Notes
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={2}
          value={formData.notes}
          onChange={handleChange}
          className="input mt-1 block w-full"
          disabled={isSubmitting}
        />
      </div>
      
      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="btn btn-outline"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSubmitting}
        >
          {isSubmitting 
            ? 'Saving...' 
            : appointment 
              ? 'Update Appointment' 
              : 'Schedule Appointment'
          }
        </button>
      </div>
    </form>
  );
};

export default AppointmentForm;