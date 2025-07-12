import { useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useApi } from '../hooks/useApi';
import ConfirmDialog from '../components/common/ConfirmDialog';
import AlertDialog from '../components/common/AlertDialog';
import api from '../services/api';
import { usePageHeader } from '../hooks/usePageHeader';

interface Manufacturer {
  id: number;
  name: string;
  createdAt: string;
}

interface MedicineType {
  id: number;
  name: string;
  createdAt: string;
}

const ConfigurePage = () => {
  const [activeTab, setActiveTab] = useState('manufacturers');
  const [showManufacturerModal, setShowManufacturerModal] = useState(false);
  const [showMedicineTypeModal, setShowMedicineTypeModal] = useState(false);
  const [editingManufacturer, setEditingManufacturer] = useState<Manufacturer | null>(null);
  const [editingMedicineType, setEditingMedicineType] = useState<MedicineType | null>(null);
  const [manufacturerName, setManufacturerName] = useState('');
  const [medicineTypeName, setMedicineTypeName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Dialog states
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteConfig, setDeleteConfig] = useState<{
    type: 'manufacturer' | 'medicineType';
    id: number;
    name: string;
  } | null>(null);
  const [showAlertDialog, setShowAlertDialog] = useState(false);
  const [alertConfig, setAlertConfig] = useState<{
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message: string;
  }>({ type: 'info', title: '', message: '' });

  // Fetch manufacturers and medicine types
  const { data: manufacturers = [], isLoading: isLoadingManufacturers, refetch: refetchManufacturers } = useApi(() => api.manufacturers.getAll());
  const { data: medicineTypes = [], isLoading: isLoadingMedicineTypes, refetch: refetchMedicineTypes } = useApi(() => api.medicineTypes.getAll());

  const showAlert = (type: 'success' | 'error' | 'warning' | 'info', title: string, message: string) => {
    setAlertConfig({ type, title, message });
    setShowAlertDialog(true);
  };

  const handleAddManufacturer = () => {
    setEditingManufacturer(null);
    setManufacturerName('');
    setShowManufacturerModal(true);
    setError(null);
  };

  const handleEditManufacturer = (manufacturer: Manufacturer) => {
    setEditingManufacturer(manufacturer);
    setManufacturerName(manufacturer.name);
    setShowManufacturerModal(true);
    setError(null);
  };

  const handleAddMedicineType = () => {
    setEditingMedicineType(null);
    setMedicineTypeName('');
    setShowMedicineTypeModal(true);
    setError(null);
  };

  const handleEditMedicineType = (medicineType: MedicineType) => {
    setEditingMedicineType(medicineType);
    setMedicineTypeName(medicineType.name);
    setShowMedicineTypeModal(true);
    setError(null);
  };

  const handleSubmitManufacturer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manufacturerName.trim()) {
      setError('Manufacturer name is required');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      if (editingManufacturer) {
        await api.manufacturers.update(editingManufacturer.id, { name: manufacturerName.trim() });
        showAlert('success', 'Success', 'Manufacturer updated successfully!');
      } else {
        await api.manufacturers.create({ name: manufacturerName.trim() });
        showAlert('success', 'Success', 'Manufacturer created successfully!');
      }
      
      await refetchManufacturers();
      setShowManufacturerModal(false);
      setManufacturerName('');
      setEditingManufacturer(null);
    } catch (error) {
      console.error('Failed to save manufacturer:', error);
      setError('Failed to save manufacturer. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitMedicineType = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!medicineTypeName.trim()) {
      setError('Medicine type name is required');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      if (editingMedicineType) {
        await api.medicineTypes.update(editingMedicineType.id, { name: medicineTypeName.trim() });
        showAlert('success', 'Success', 'Medicine type updated successfully!');
      } else {
        await api.medicineTypes.create({ name: medicineTypeName.trim() });
        showAlert('success', 'Success', 'Medicine type created successfully!');
      }
      
      await refetchMedicineTypes();
      setShowMedicineTypeModal(false);
      setMedicineTypeName('');
      setEditingMedicineType(null);
    } catch (error) {
      console.error('Failed to save medicine type:', error);
      setError('Failed to save medicine type. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = (type: 'manufacturer' | 'medicineType', id: number, name: string) => {
    setDeleteConfig({ type, id, name });
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfig) return;

    try {
      if (deleteConfig.type === 'manufacturer') {
        await api.manufacturers.delete(deleteConfig.id);
        await refetchManufacturers();
        showAlert('success', 'Success', 'Manufacturer deleted successfully!');
      } else {
        await api.medicineTypes.delete(deleteConfig.id);
        await refetchMedicineTypes();
        showAlert('success', 'Success', 'Medicine type deleted successfully!');
      }
    } catch (error) {
      console.error('Failed to delete:', error);
      showAlert('error', 'Error', `Failed to delete ${deleteConfig.type}. It may be in use.`);
    } finally {
      setShowDeleteDialog(false);
      setDeleteConfig(null);
    }
  };

  // Dynamic header actions based on active tab
  const headerActions = (
    <>
      {activeTab === 'manufacturers' && (
        <button
          onClick={handleAddManufacturer}
          className="btn btn-primary flex items-center justify-center"
        >
          <Plus className="mr-1 h-4 w-4" />
          <span className="hidden sm:inline">Add Manufacturer</span>
          <span className="sm:hidden">Add</span>
        </button>
      )}
      {activeTab === 'medicineTypes' && (
        <button
          onClick={handleAddMedicineType}
          className="btn btn-primary flex items-center justify-center"
        >
          <Plus className="mr-1 h-4 w-4" />
          <span className="hidden sm:inline">Add Medicine Type</span>
          <span className="sm:hidden">Add</span>
        </button>
      )}
    </>
  );

  // Set dynamic page header
  usePageHeader({
    title: 'Configure Masters',
    subtitle: 'Manage master data for manufacturers and medicine types',
    actions: headerActions,
  });

  return (
    <div className="slide-in">
      {/* Tabs */}
      <div className="mb-4 sm:mb-6 border-b border-neutral-200">
        <nav className="-mb-px flex space-x-4 sm:space-x-8 overflow-x-auto">
          <button
            onClick={() => setActiveTab('manufacturers')}
            className={`pb-3 sm:pb-4 text-sm font-medium whitespace-nowrap ${
              activeTab === 'manufacturers'
                ? 'border-b-2 border-primary-600 text-primary-700'
                : 'text-neutral-600 hover:border-b-2 hover:border-neutral-300 hover:text-neutral-700'
            }`}
          >
            Manufacturers
          </button>
          <button
            onClick={() => setActiveTab('medicineTypes')}
            className={`pb-3 sm:pb-4 text-sm font-medium whitespace-nowrap ${
              activeTab === 'medicineTypes'
                ? 'border-b-2 border-primary-600 text-primary-700'
                : 'text-neutral-600 hover:border-b-2 hover:border-neutral-300 hover:text-neutral-700'
            }`}
          >
            Medicine Types
          </button>
        </nav>
      </div>

      {/* Manufacturers Tab */}
      {activeTab === 'manufacturers' && (
        <div className="space-y-4 sm:space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
            <h2 className="text-base sm:text-lg font-semibold text-neutral-900">Manufacturers</h2>
          </div>

          <div className="overflow-hidden rounded-xl sm:rounded-2xl border border-neutral-200 bg-white shadow-xl">
            {/* Mobile Card View */}
            <div className="block sm:hidden">
              {isLoadingManufacturers ? (
                <div className="p-8 text-center text-sm text-neutral-500">
                  Loading manufacturers...
                </div>
              ) : manufacturers.length > 0 ? (
                <div className="divide-y divide-neutral-200">
                  {manufacturers.map((manufacturer: Manufacturer) => (
                    <div key={manufacturer.id} className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-neutral-900 truncate">
                            {manufacturer.name}
                          </p>
                          <p className="text-xs text-neutral-500">
                            {new Date(manufacturer.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex space-x-2 ml-2">
                          <button
                            onClick={() => handleEditManufacturer(manufacturer)}
                            className="p-2 text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick('manufacturer', manufacturer.id, manufacturer.name)}
                            className="p-2 text-error-600 hover:text-error-700 hover:bg-error-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-sm text-neutral-500">
                  No manufacturers found
                </div>
              )}
            </div>

            {/* Desktop Table View */}
            <div className="hidden sm:block">
              <table className="min-w-full divide-y divide-neutral-200">
                <thead className="bg-neutral-50">
                  <tr>
                    <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">
                      Name
                    </th>
                    <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">
                      Created At
                    </th>
                    <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {isLoadingManufacturers ? (
                    <tr>
                      <td colSpan={3} className="px-6 py-4 text-center text-sm text-neutral-500">
                        Loading manufacturers...
                      </td>
                    </tr>
                  ) : manufacturers.length > 0 ? (
                    manufacturers.map((manufacturer: Manufacturer) => (
                      <tr key={manufacturer.id} className="hover:bg-neutral-50 transition">
                        <td className="whitespace-nowrap px-4 lg:px-6 py-4 text-sm font-medium text-neutral-900">
                          {manufacturer.name}
                        </td>
                        <td className="whitespace-nowrap px-4 lg:px-6 py-4 text-sm text-neutral-500">
                          {new Date(manufacturer.createdAt).toLocaleDateString()}
                        </td>
                        <td className="whitespace-nowrap px-4 lg:px-6 py-4 text-sm">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditManufacturer(manufacturer)}
                              className="text-primary-600 hover:text-primary-700 p-1 hover:bg-primary-50 rounded transition-colors"
                              title="Edit"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteClick('manufacturer', manufacturer.id, manufacturer.name)}
                              className="text-error-600 hover:text-error-700 p-1 hover:bg-error-50 rounded transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="px-6 py-4 text-center text-sm text-neutral-500">
                        No manufacturers found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Medicine Types Tab */}
      {activeTab === 'medicineTypes' && (
        <div className="space-y-4 sm:space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
            <h2 className="text-base sm:text-lg font-semibold text-neutral-900">Medicine Types</h2>
          </div>

          <div className="overflow-hidden rounded-xl sm:rounded-2xl border border-neutral-200 bg-white shadow-xl">
            {/* Mobile Card View */}
            <div className="block sm:hidden">
              {isLoadingMedicineTypes ? (
                <div className="p-8 text-center text-sm text-neutral-500">
                  Loading medicine types...
                </div>
              ) : medicineTypes.length > 0 ? (
                <div className="divide-y divide-neutral-200">
                  {medicineTypes.map((medicineType: MedicineType) => (
                    <div key={medicineType.id} className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-neutral-900 truncate">
                            {medicineType.name}
                          </p>
                          <p className="text-xs text-neutral-500">
                            {new Date(medicineType.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex space-x-2 ml-2">
                          <button
                            onClick={() => handleEditMedicineType(medicineType)}
                            className="p-2 text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick('medicineType', medicineType.id, medicineType.name)}
                            className="p-2 text-error-600 hover:text-error-700 hover:bg-error-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-sm text-neutral-500">
                  No medicine types found
                </div>
              )}
            </div>

            {/* Desktop Table View */}
            <div className="hidden sm:block">
              <table className="min-w-full divide-y divide-neutral-200">
                <thead className="bg-neutral-50">
                  <tr>
                    <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">
                      Name
                    </th>
                    <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">
                      Created At
                    </th>
                    <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {isLoadingMedicineTypes ? (
                    <tr>
                      <td colSpan={3} className="px-6 py-4 text-center text-sm text-neutral-500">
                        Loading medicine types...
                      </td>
                    </tr>
                  ) : medicineTypes.length > 0 ? (
                    medicineTypes.map((medicineType: MedicineType) => (
                      <tr key={medicineType.id} className="hover:bg-neutral-50 transition">
                        <td className="whitespace-nowrap px-4 lg:px-6 py-4 text-sm font-medium text-neutral-900">
                          {medicineType.name}
                        </td>
                        <td className="whitespace-nowrap px-4 lg:px-6 py-4 text-sm text-neutral-500">
                          {new Date(medicineType.createdAt).toLocaleDateString()}
                        </td>
                        <td className="whitespace-nowrap px-4 lg:px-6 py-4 text-sm">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditMedicineType(medicineType)}
                              className="text-primary-600 hover:text-primary-700 p-1 hover:bg-primary-50 rounded transition-colors"
                              title="Edit"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteClick('medicineType', medicineType.id, medicineType.name)}
                              className="text-error-600 hover:text-error-700 p-1 hover:bg-error-50 rounded transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="px-6 py-4 text-center text-sm text-neutral-500">
                        No medicine types found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Manufacturer Modal */}
      {showManufacturerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-xl sm:rounded-2xl bg-white/95 backdrop-blur-md p-6 sm:p-8 shadow-2xl border border-white/20">
            <h2 className="mb-6 text-lg sm:text-xl font-bold text-neutral-900">
              {editingManufacturer ? 'Edit Manufacturer' : 'Add New Manufacturer'}
            </h2>
            <form onSubmit={handleSubmitManufacturer} className="space-y-4">
              <div>
                <label htmlFor="manufacturerName" className="block text-sm font-medium text-neutral-700 mb-2">
                  Manufacturer Name*
                </label>
                <input
                  type="text"
                  id="manufacturerName"
                  value={manufacturerName}
                  onChange={(e) => setManufacturerName(e.target.value)}
                  className="input w-full text-sm sm:text-base"
                  placeholder="Enter manufacturer name"
                  required
                  disabled={isSubmitting}
                />
              </div>
              {error && (
                <p className="text-sm text-error-500">{error}</p>
              )}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowManufacturerModal(false);
                    setManufacturerName('');
                    setEditingManufacturer(null);
                    setError(null);
                  }}
                  className="btn btn-outline w-full sm:w-auto order-2 sm:order-1"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary w-full sm:w-auto order-1 sm:order-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Saving...' : editingManufacturer ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Medicine Type Modal */}
      {showMedicineTypeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-xl sm:rounded-2xl bg-white/95 backdrop-blur-md p-6 sm:p-8 shadow-2xl border border-white/20">
            <h2 className="mb-6 text-lg sm:text-xl font-bold text-neutral-900">
              {editingMedicineType ? 'Edit Medicine Type' : 'Add New Medicine Type'}
            </h2>
            <form onSubmit={handleSubmitMedicineType} className="space-y-4">
              <div>
                <label htmlFor="medicineTypeName" className="block text-sm font-medium text-neutral-700 mb-2">
                  Medicine Type Name*
                </label>
                <input
                  type="text"
                  id="medicineTypeName"
                  value={medicineTypeName}
                  onChange={(e) => setMedicineTypeName(e.target.value)}
                  className="input w-full text-sm sm:text-base"
                  placeholder="Enter medicine type name"
                  required
                  disabled={isSubmitting}
                />
              </div>
              {error && (
                <p className="text-sm text-error-500">{error}</p>
              )}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowMedicineTypeModal(false);
                    setMedicineTypeName('');
                    setEditingMedicineType(null);
                    setError(null);
                  }}
                  className="btn btn-outline w-full sm:w-auto order-2 sm:order-1"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary w-full sm:w-auto order-1 sm:order-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Saving...' : editingMedicineType ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        title={`Delete ${deleteConfig?.type === 'manufacturer' ? 'Manufacturer' : 'Medicine Type'}`}
        message={`Are you sure you want to delete "${deleteConfig?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setShowDeleteDialog(false);
          setDeleteConfig(null);
        }}
      />

      {/* Alert Dialog */}
      <AlertDialog
        isOpen={showAlertDialog}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
        onClose={() => setShowAlertDialog(false)}
      />
    </div>
  );
};

export default ConfigurePage;