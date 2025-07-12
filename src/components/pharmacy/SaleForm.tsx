import { useState } from 'react';
import { Medicine, Prescription, Sale, SaleItem } from '../../types';
import { useMedicines } from '../../hooks/useApi';

interface SaleFormProps {
  prescription: Prescription;
  onSubmit: (sale: Sale) => void;
  onCancel: () => void;
}

const SaleForm = ({ prescription, onSubmit, onCancel }: SaleFormProps) => {
  const { data: medicines = [] } = useMedicines();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize sale items from prescription
  const [saleItems, setSaleItems] = useState<SaleItem[]>(
    prescription.items.map((item) => {
      const medicine = medicines.find((m) => m.id === item.medicineId);
      return {
        medicineId: item.medicineId,
        medicineName: item.medicineName,
        quantity: 1, // Default quantity
        unitPrice: medicine?.price || 0,
        totalPrice: medicine?.price || 0,
      };
    })
  );

  const handleQuantityChange = (index: number, quantity: number) => {
    setSaleItems((prev) => {
      const newItems = [...prev];
      const medicine = medicines.find((m) => m.id === newItems[index].medicineId);
      
      if (medicine) {
        // Check if quantity is available in stock
        if (quantity > medicine.stock) {
          setError(`Only ${medicine.stock} units available for ${medicine.name}`);
          return prev;
        }
        
        newItems[index] = {
          ...newItems[index],
          quantity,
          totalPrice: quantity * medicine.price,
        };
      }
      
      setError(null);
      return newItems;
    });
  };

  const calculateTotal = () => {
    return saleItems.reduce((total, item) => total + item.totalPrice, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) {
      return;
    }

    // Validate stock availability
    for (const item of saleItems) {
      const medicine = medicines.find((m) => m.id === item.medicineId);
      if (medicine && item.quantity > medicine.stock) {
        setError(`Insufficient stock for ${medicine.name}`);
        return;
      }
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const sale: Sale = {
        id: 0, // Will be set by the server
        prescriptionId: prescription.id,
        patientId: prescription.patientId,
        patientName: prescription.patientName,
        appointmentId: prescription.appointmentId,
        items: saleItems,
        totalAmount: calculateTotal(),
        createdAt: new Date().toISOString(),
      };

      await onSubmit(sale);
    } catch (error) {
      setError('Failed to process sale. Please try again.');
      console.error('Sale error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-md bg-error-50 p-4 text-error-500">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {saleItems.map((item, index) => {
          const medicine = medicines.find((m) => m.id === item.medicineId);
          
          return (
            <div
              key={item.medicineId}
              className="rounded-lg border border-neutral-200 p-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-neutral-900">
                    {item.medicineName}
                  </h3>
                  <p className="text-sm text-neutral-500">
                    Stock available: {medicine?.stock || 0} {medicine?.unit}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-neutral-900">
                    ${item.unitPrice.toFixed(2)} per {medicine?.unit}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <label className="text-sm font-medium text-neutral-700">
                    Quantity:
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={medicine?.stock || 1}
                    value={item.quantity}
                    onChange={(e) =>
                      handleQuantityChange(index, parseInt(e.target.value) || 0)
                    }
                    className="input w-20"
                    disabled={isSubmitting}
                  />
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-neutral-700">
                    Total: ${item.totalPrice.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="rounded-lg bg-neutral-50 p-4">
        <div className="flex items-center justify-between">
          <p className="text-lg font-medium text-neutral-900">Total Amount:</p>
          <p className="text-2xl font-bold text-primary-600">
            ${calculateTotal().toFixed(2)}
          </p>
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="btn-outline"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn-primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Processing...' : 'Complete Sale'}
        </button>
      </div>
    </form>
  );
};

export default SaleForm;