import { useState, useEffect } from 'react';
import { Patient } from '../../types';
import { User, Mail, Phone, Calendar, MapPin, FileText, Shield } from 'lucide-react';
import api from '../../services/api';

interface PatientFormProps {
  patient?: Partial<Patient>;
  onSubmit: (patient: Patient) => void;
  onCancel: () => void;
}

const PatientForm = ({ patient, onSubmit, onCancel }: PatientFormProps) => {
  const [formData, setFormData] = useState<Partial<Patient>>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: 'male',
    address: '',
    medicalHistory: '',
    insuranceInfo: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof Patient, string>> & { submit?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (patient) {
      setFormData({
        ...patient,
        dateOfBirth: patient.dateOfBirth ? new Date(patient.dateOfBirth).toISOString().split('T')[0] : '',
      });
    }
  }, [patient]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when field is changed
    if (errors[name as keyof Patient]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof Patient, string>> = {};

    if (!formData.firstName?.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName?.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    // Email validation
    if (!formData.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (
      !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(formData.email)
    ) {
      newErrors.email = 'Email is invalid';
    }

    // Mobile validation (10-15 digits, allows + at start)
    if (!formData.phone?.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (
      !/^(\+?\d{10,15})$/.test(formData.phone.replace(/\s+/g, ''))
    ) {
      newErrors.phone = 'Phone number is invalid';
    }

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required';
    }

    if (!formData.address?.trim()) {
      newErrors.address = 'Address is required';
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
      if (patient?.id) {
        // Update existing patient
        const updatedPatient = await api.patients.update(patient.id, {
          ...formData,
          id: patient.id,
          createdAt: patient.createdAt || new Date().toISOString(),
        });
        onSubmit(updatedPatient);
      } else {
        // Create new patient
        const newPatient = await api.patients.create({
          ...formData,
          createdAt: new Date().toISOString(),
        });
        onSubmit(newPatient);
      }
    } catch (error) {
      console.error('Failed to save patient:', error);
      setErrors((prev) => ({
        ...prev,
        submit: 'Failed to save patient. Please try again.',
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8"
      autoComplete="off"
    >
      {/* Personal Information Section */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2 mb-4">
          <User className="h-5 w-5 text-primary-600" />
          <h3 className="text-lg font-semibold text-neutral-900">Personal Information</h3>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-neutral-700 mb-2">
              First Name*
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className={`input w-full ${errors.firstName ? 'border-error-500 ring-error-500' : ''}`}
              placeholder="Enter first name"
              disabled={isSubmitting}
              autoComplete="off"
            />
            {errors.firstName && <p className="mt-1 text-sm text-error-500">{errors.firstName}</p>}
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-neutral-700 mb-2">
              Last Name*
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className={`input w-full ${errors.lastName ? 'border-error-500 ring-error-500' : ''}`}
              placeholder="Enter last name"
              disabled={isSubmitting}
              autoComplete="off"
            />
            {errors.lastName && <p className="mt-1 text-sm text-error-500">{errors.lastName}</p>}
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="dateOfBirth" className="block text-sm font-medium text-neutral-700 mb-2">
              <Calendar className="inline h-4 w-4 mr-1" />
              Date of Birth*
            </label>
            <input
              type="date"
              id="dateOfBirth"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              className={`input w-full ${errors.dateOfBirth ? 'border-error-500 ring-error-500' : ''}`}
              disabled={isSubmitting}
            />
            {errors.dateOfBirth && <p className="mt-1 text-sm text-error-500">{errors.dateOfBirth}</p>}
          </div>
          <div>
            <label htmlFor="gender" className="block text-sm font-medium text-neutral-700 mb-2">
              Gender*
            </label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="input w-full"
              disabled={isSubmitting}
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
      </div>

      {/* Contact Information Section */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2 mb-4">
          <Phone className="h-5 w-5 text-primary-600" />
          <h3 className="text-lg font-semibold text-neutral-900">Contact Information</h3>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-2">
              <Mail className="inline h-4 w-4 mr-1" />
              Email*
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`input w-full ${errors.email ? 'border-error-500 ring-error-500' : ''}`}
              placeholder="Enter email address"
              disabled={isSubmitting}
              autoComplete="off"
            />
            {errors.email && <p className="mt-1 text-sm text-error-500">{errors.email}</p>}
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-neutral-700 mb-2">
              <Phone className="inline h-4 w-4 mr-1" />
              Phone*
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={`input w-full ${errors.phone ? 'border-error-500 ring-error-500' : ''}`}
              placeholder="Enter phone number"
              disabled={isSubmitting}
              autoComplete="off"
            />
            {errors.phone && <p className="mt-1 text-sm text-error-500">{errors.phone}</p>}
          </div>
        </div>
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-neutral-700 mb-2">
            <MapPin className="inline h-4 w-4 mr-1" />
            Address*
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className={`input w-full ${errors.address ? 'border-error-500 ring-error-500' : ''}`}
            placeholder="Enter full address"
            disabled={isSubmitting}
            autoComplete="off"
          />
          {errors.address && <p className="mt-1 text-sm text-error-500">{errors.address}</p>}
        </div>
      </div>

      {/* Medical Information Section */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2 mb-4">
          <FileText className="h-5 w-5 text-primary-600" />
          <h3 className="text-lg font-semibold text-neutral-900">Medical Information</h3>
        </div>
        <div>
          <label htmlFor="medicalHistory" className="block text-sm font-medium text-neutral-700 mb-2">
            Medical History
          </label>
          <textarea
            id="medicalHistory"
            name="medicalHistory"
            rows={3}
            value={formData.medicalHistory}
            onChange={handleChange}
            className="input w-full"
            placeholder="Enter any relevant medical history, allergies, or conditions"
            disabled={isSubmitting}
          />
        </div>
        <div>
          <label htmlFor="insuranceInfo" className="block text-sm font-medium text-neutral-700 mb-2">
            <Shield className="inline h-4 w-4 mr-1" />
            Insurance Information
          </label>
          <input
            type="text"
            id="insuranceInfo"
            name="insuranceInfo"
            value={formData.insuranceInfo}
            onChange={handleChange}
            className="input w-full"
            placeholder="Enter insurance provider and policy number"
            disabled={isSubmitting}
            autoComplete="off"
          />
        </div>
      </div>

      {errors.submit && (
        <div className="rounded-xl bg-error-50 p-4 border border-error-200">
          <p className="text-sm text-error-600">{errors.submit}</p>
        </div>
      )}

      <div className="flex justify-end space-x-3 pt-6 border-t border-neutral-200">
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
          {isSubmitting ? (
            <>
              <div className="spinner mr-2"></div>
              Saving...
            </>
          ) : (
            patient ? 'Update Patient' : 'Add Patient'
          )}
        </button>
      </div>
    </form>
  );
};

export default PatientForm;