import React, { useState, useEffect } from 'react';
import { Medicine } from '../../types'; // Adjust the import path as needed
import { useApi } from '../../hooks/useApi';
import api from '../../services/api';

interface MedicineFormProps {
  medicine?: Partial<Medicine>;
  onSubmit: (medicine: Medicine) => void;
  onCancel: () => void;
}

const MedicineForm = ({ medicine, onSubmit, onCancel }: MedicineFormProps) => {
  const [formData, setFormData] = useState<Partial<Medicine>>({
    name: medicine?.name || '',
    type: medicine?.type || '',
    description: medicine?.description || '',
    manufacturer: medicine?.manufacturer || '',
    stock: medicine?.stock || 0,
    unit: medicine?.unit || 'tablets',
    price: medicine?.price || 0,
    dateOfMfg: medicine?.dateOfMfg || '',
    dateOfExpiry: medicine?.dateOfExpiry || '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof Medicine, string>>>({});

  // Fetch manufacturers and medicine types
  const { data: manufacturers = [] } = useApi(() => api.manufacturers.getAll());
  const { data: medicineTypes = [] } = useApi(() => api.medicineTypes.getAll());

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name as keyof Medicine]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof Medicine, string>> = {};

    if (!formData.name?.trim()) {
      newErrors.name = 'Medicine name is required';
    }
    if (!formData.type) {
      newErrors.type = 'Medicine type is required';
    }
    if (!formData.manufacturer?.trim()) {
      newErrors.manufacturer = 'Manufacturer is required';
    }
    if (
      formData.stock === undefined ||
      formData.stock === null ||
      formData.stock === '' ||
      Number(formData.stock) <= 0
    ) {
      newErrors.stock = 'Stock is required and must be greater than zero';
    }
    if (!formData.unit?.trim()) {
      newErrors.unit = 'Unit is required';
    }
    if (
      formData.price === undefined ||
      formData.price === null ||
      formData.price === '' ||
      Number(formData.price) <= 0
    ) {
      newErrors.price = 'Price is required and must be greater than zero';
    }
    if (!formData.dateOfMfg) {
      newErrors.dateOfMfg = 'Date of manufacture is required';
    }
    if (!formData.dateOfExpiry) {
      newErrors.dateOfExpiry = 'Date of expiry is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    onSubmit({
      ...formData,
      stock: Number(formData.stock),
      price: Number(formData.price),
    } as Medicine);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8" autoComplete="off">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Medicine Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-2">
            Medicine Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`input w-full ${errors.name ? 'border-red-500' : ''}`}
          />
          {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
        </div>

        {/* Type */}
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-neutral-700 mb-2">
            Type <span className="text-red-500">*</span>
          </label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            className={`input w-full ${errors.type ? 'border-red-500' : ''}`}
          >
            <option value="">Select type</option>
            {medicineTypes.map((type: any) => (
              <option key={type.id} value={type.name}>
                {type.name}
              </option>
            ))}
          </select>
          {errors.type && <p className="mt-1 text-xs text-red-600">{errors.type}</p>}
        </div>

        {/* Manufacturer */}
        <div>
          <label htmlFor="manufacturer" className="block text-sm font-medium text-neutral-700 mb-2">
            Manufacturer <span className="text-red-500">*</span>
          </label>
          <select
            id="manufacturer"
            name="manufacturer"
            value={formData.manufacturer}
            onChange={handleChange}
            className={`input w-full ${errors.manufacturer ? 'border-red-500' : ''}`}
          >
            <option value="">Select manufacturer</option>
            {manufacturers.map((manufacturer: any) => (
              <option key={manufacturer.id} value={manufacturer.name}>
                {manufacturer.name}
              </option>
            ))}
          </select>
          {errors.manufacturer && <p className="mt-1 text-xs text-red-600">{errors.manufacturer}</p>}
        </div>

        {/* Stock */}
        <div>
          <label htmlFor="stock" className="block text-sm font-medium text-neutral-700 mb-2">
            Stock <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="stock"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            min={0}
            className={`input w-full ${errors.stock ? 'border-red-500' : ''}`}
          />
          {errors.stock && <p className="mt-1 text-xs text-red-600">{errors.stock}</p>}
        </div>

        {/* Unit */}
        <div>
          <label htmlFor="unit" className="block text-sm font-medium text-neutral-700 mb-2">
            Unit <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="unit"
            name="unit"
            value={formData.unit}
            onChange={handleChange}
            className={`input w-full ${errors.unit ? 'border-red-500' : ''}`}
          />
          {errors.unit && <p className="mt-1 text-xs text-red-600">{errors.unit}</p>}
        </div>

        {/* Price */}
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-neutral-700 mb-2">
            Price <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            min={0}
            step="0.01"
            className={`input w-full ${errors.price ? 'border-red-500' : ''}`}
          />
          {errors.price && <p className="mt-1 text-xs text-red-600">{errors.price}</p>}
        </div>

        {/* Date of Manufacture */}
        <div>
          <label htmlFor="dateOfMfg" className="block text-sm font-medium text-neutral-700 mb-2">
            Date of Manufacture <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            id="dateOfMfg"
            name="dateOfMfg"
            value={formData.dateOfMfg}
            onChange={handleChange}
            className={`input w-full ${errors.dateOfMfg ? 'border-red-500' : ''}`}
          />
          {errors.dateOfMfg && <p className="mt-1 text-xs text-red-600">{errors.dateOfMfg}</p>}
        </div>

        {/* Date of Expiry */}
        <div>
          <label htmlFor="dateOfExpiry" className="block text-sm font-medium text-neutral-700 mb-2">
            Date of Expiry <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            id="dateOfExpiry"
            name="dateOfExpiry"
            value={formData.dateOfExpiry}
            onChange={handleChange}
            className={`input w-full ${errors.dateOfExpiry ? 'border-red-500' : ''}`}
          />
          {errors.dateOfExpiry && <p className="mt-1 text-xs text-red-600">{errors.dateOfExpiry}</p>}
        </div>
      </div>

      {/* Description (optional) */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-neutral-700 mb-2">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="input w-full"
          rows={3}
        />
      </div>

      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="btn btn-neutral"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn-primary"
        >
          Save
        </button>
      </div>
    </form>
  );
};

export default MedicineForm;