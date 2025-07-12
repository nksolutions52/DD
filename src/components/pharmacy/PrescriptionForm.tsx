import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Medicine, Prescription, PrescriptionItem, Appointment } from '../../types';
import { useMedicines } from '../../hooks/useApi';
import api from '../../services/api';

interface PrescriptionFormProps {
  onSubmit: (prescription: Prescription) => void;
  onCancel: () => void;
  appointment: Appointment;
}

const PrescriptionForm = ({
  onSubmit,
  onCancel,
  appointment,
}: PrescriptionFormProps) => {
  const { data: medicines = [], isLoading: isLoadingMedicines, error: medicinesError } = useMedicines();
  const [items, setItems] = useState<PrescriptionItem[]>([]);
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddItem = () => {
    setItems([
      ...items,
      {
        medicineId: 0,
        medicineName: '',
        medicineType: 'tablet',
        dosage: '',
        frequency: '',
        duration: '',
        instructions: '',
      },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: keyof PrescriptionItem, value: string | number) => {
    const newItems = [...items];
    if (field === 'medicineId') {
      const medicine = medicines.find((m) => m.id === Number(value));
      if (medicine) {
        newItems[index] = {
          ...newItems[index],
          medicineId: medicine.id,
          medicineName: medicine.name,
          medicineType: medicine.type,
        };
      }
    } else {
      newItems[index] = {
        ...newItems[index],
        [field]: value,
      };
    }
    setItems(newItems);
  };

  const validate = (): boolean => {
    const newErrors: string[] = [];
    
    if (items.length === 0) {
      newErrors.push('At least one medicine must be prescribed');
    }
    
    items.forEach((item, index) => {
      if (!item.medicineId) {
        newErrors.push(`Medicine #${index + 1}: Medicine selection is required`);
      }
      if (!item.dosage) {
        newErrors.push(`Medicine #${index + 1}: Dosage is required`);
      }
      if (!item.frequency) {
        newErrors.push(`Medicine #${index + 1}: Frequency is required`);
      }
      if (!item.duration) {
        newErrors.push(`Medicine #${index + 1}: Duration is required`);
      }
    });
    
    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate() || isSubmitting) {
      return;
    }

    try {
      setIsSubmitting(true);
      
      const prescription: Prescription = {
        id: 0,
        patientId: appointment.patientId,
        patientName: appointment.patientName,
        appointmentId: appointment.id,
        dentistId: appointment.dentistId,
        dentistName: appointment.dentistName,
        items,
        notes,
        createdAt: new Date().toISOString(),
      };

      // Make the API call to create the prescription
      const createdPrescription = await api.prescriptions.create(prescription);
      onSubmit(createdPrescription);
    } catch (error) {
      console.error('Failed to create prescription:', error);
      setErrors(['Failed to create prescription. Please try again.']);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingMedicines) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-neutral-500">Loading medicines...</p>
      </div>
    );
  }

  if (medicinesError) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-error-500">Error loading medicines: {medicinesError.message}</p>
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="p-6 text-center text-error-500">
        No appointment selected for prescription.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Scrollable content */}
      <div className="space-y-6">
        <div className="mb-4 rounded-lg bg-neutral-50 p-4">
          <h3 className="font-medium text-neutral-900">Appointment Details</h3>
          <p className="mt-1 text-sm text-neutral-600">
            Date: {new Date(appointment.date).toLocaleDateString()}
          </p>
          <p className="text-sm text-neutral-600">
            Time: {appointment.startTime} - {appointment.endTime}
          </p>
          <p className="text-sm text-neutral-600">
            Type: {appointment.type.replace('-', ' ')}
          </p>
        </div>

        {errors.length > 0 && (
          <div className="rounded-md bg-error-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-error-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-error-800">
                  Please correct the following errors:
                </h3>
                <div className="mt-2 text-sm text-error-700">
                  <ul className="list-disc space-y-1 pl-5">
                    {errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {items.map((item, index) => (
            <div key={index} className="rounded-lg border border-neutral-200 p-4">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-medium">Medicine #{index + 1}</h3>
                <button
                  type="button"
                  onClick={() => handleRemoveItem(index)}
                  className="text-error-500 hover:text-error-700"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-neutral-700">
                    Medicine*
                  </label>
                  <select
                    value={item.medicineId || ''}
                    onChange={(e) => handleItemChange(index, 'medicineId', e.target.value)}
                    className="input mt-1 block w-full"
                    disabled={isSubmitting}
                  >
                    <option value="">Select Medicine</option>
                    {medicines.map((medicine) => (
                      <option key={medicine.id} value={medicine.id}>
                        {medicine.name} ({medicine.type})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700">
                    Dosage*
                  </label>
                  <input
                    type="text"
                    value={item.dosage}
                    onChange={(e) => handleItemChange(index, 'dosage', e.target.value)}
                    placeholder="e.g., 1 tablet, 5ml"
                    className="input mt-1 block w-full"
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700">
                    Frequency*
                  </label>
                  <input
                    type="text"
                    value={item.frequency}
                    onChange={(e) => handleItemChange(index, 'frequency', e.target.value)}
                    placeholder="e.g., twice daily, every 8 hours"
                    className="input mt-1 block w-full"
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700">
                    Duration*
                  </label>
                  <input
                    type="text"
                    value={item.duration}
                    onChange={(e) => handleItemChange(index, 'duration', e.target.value)}
                    placeholder="e.g., 5 days, 1 week"
                    className="input mt-1 block w-full"
                    disabled={isSubmitting}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-neutral-700">
                    Special Instructions
                  </label>
                  <input
                    type="text"
                    value={item.instructions}
                    onChange={(e) => handleItemChange(index, 'instructions', e.target.value)}
                    placeholder="e.g., take after meals"
                    className="input mt-1 block w-full"
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={handleAddItem}
            className="btn btn-outline flex w-full items-center justify-center"
            disabled={isSubmitting}
          >
            <Plus className="mr-1 h-4 w-4" />
            Add Medicine
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700">
            Additional Notes
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="input mt-1 block w-full"
            placeholder="Any additional instructions or notes"
            disabled={isSubmitting}
          />
        </div>
      </div>

      {/* Action buttons at the bottom, NOT sticky/fixed */}
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
          {isSubmitting ? 'Saving...' : 'Save Prescription'}
        </button>
      </div>
    </form>
  );
};

export default PrescriptionForm;