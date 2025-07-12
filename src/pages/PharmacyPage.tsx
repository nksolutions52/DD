import { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { Medicine } from '../types';
import MedicineForm from '../components/pharmacy/MedicineForm';
import Pagination from '../components/common/Pagination';
import { useMedicines } from '../hooks/useApi';
import { usePageHeader } from '../hooks/usePageHeader';
import api from '../services/api';

const ITEMS_PER_PAGE = 10;

const PharmacyPage = () => {
  const { data: medicines = [], isLoading, error, refetch } = useMedicines();
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Filter medicines based on search term
  const filteredMedicines = medicines.filter((medicine) =>
    medicine.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredMedicines.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedMedicines = filteredMedicines.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Set page header with actions
  usePageHeader({
    title: 'Pharmacy Stock',
    subtitle: 'Manage your pharmacy medicines and stock levels',
    actions: (
      <button
        onClick={() => setShowForm(true)}
        className="btn btn-primary flex items-center"
      >
        <Plus className="mr-1 h-4 w-4" />
        <span className="hidden sm:inline">Add New Medicine</span>
        <span className="sm:hidden">Add Medicine</span>
      </button>
    ),
  });

  const handleAddMedicine = async (medicine: Medicine) => {
    try {
      await api.medicines.create(medicine);
      refetch();
      setShowForm(false);
    } catch (error) {
      console.error('Failed to create medicine:', error);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-lg text-neutral-500">Loading medicines...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-lg text-error-500">Error loading medicines: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="slide-in space-y-4 sm:space-y-6">
      {/* Search */}
      <div className="flex flex-col space-y-3 sm:space-y-4 md:flex-row md:items-center md:space-y-0 md:space-x-4">
        <div className="relative flex-grow">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 sm:h-5 sm:w-5 text-neutral-400" />
          </div>
          <input
            type="text"
            className="input pl-10 sm:pl-12 w-full"
            placeholder="Search medicines..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>

      {/* Medicines list */}
      <div className="overflow-hidden rounded-xl sm:rounded-2xl border border-neutral-200 bg-white shadow-xl">
        {/* Mobile Card View */}
        <div className="block xl:hidden">
          {paginatedMedicines.length > 0 ? (
            <div className="divide-y divide-neutral-200">
              {paginatedMedicines.map((medicine) => (
                <div key={medicine.id} className="p-4">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-neutral-900 truncate">
                          {medicine.name}
                        </p>
                        {medicine.description && (
                          <p className="text-xs text-neutral-500 truncate">{medicine.description}</p>
                        )}
                      </div>
                      <span
                        className={`ml-2 font-medium text-sm ${
                          medicine.stock > 100
                            ? 'text-success-600'
                            : medicine.stock > 20
                            ? 'text-warning-600'
                            : 'text-error-600'
                        }`}
                      >
                        {medicine.stock} {medicine.unit}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span className="inline-flex rounded-full bg-primary-100 px-2 py-1 text-xs font-semibold text-primary-800">
                        {medicine.type}
                      </span>
                      <span className="text-xs text-neutral-600">
                        ₹{medicine.price.toFixed(2)}
                      </span>
                      <span className="text-xs text-neutral-500">
                        {medicine.manufacturer || '-'}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs text-neutral-500">
                      <span>Updated: {new Date(medicine.updatedAt).toLocaleDateString()}</span>
                      {medicine.dateOfExpiry && (
                        <span
                          className={`${
                            (() => {
                              const expiry = new Date(medicine.dateOfExpiry);
                              const now = new Date();
                              const isExpiringThisMonth =
                                expiry.getFullYear() === now.getFullYear() &&
                                expiry.getMonth() === now.getMonth();
                              return isExpiringThisMonth ? 'text-error-600 font-medium' : '';
                            })()
                          }`}
                        >
                          Exp: {new Date(medicine.dateOfExpiry).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 sm:p-12 text-center text-sm text-neutral-500">
              No medicines found
            </div>
          )}
        </div>

        {/* Desktop Table View */}
        <div className="hidden xl:block">
          <table className="min-w-full divide-y divide-neutral-200 rounded-2xl overflow-hidden">
            <thead className="bg-neutral-50">
              <tr>
                <th scope="col" className="px-4 2xl:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">
                  Name
                </th>
                <th scope="col" className="px-4 2xl:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">
                  Type
                </th>
                <th scope="col" className="px-4 2xl:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">
                  Stock
                </th>
                <th scope="col" className="px-4 2xl:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">
                  Unit
                </th>
                <th scope="col" className="px-4 2xl:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">
                  Price
                </th>
                <th scope="col" className="px-4 2xl:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">
                  Manufacturer
                </th>
                <th scope="col" className="px-4 2xl:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">
                  Last Updated
                </th>
                <th scope="col" className="px-4 2xl:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">
                  Expiry Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {paginatedMedicines.length > 0 ? (
                paginatedMedicines.map((medicine) => (
                  <tr key={medicine.id} className="hover:bg-neutral-50 transition rounded-xl">
                    <td className="whitespace-nowrap px-4 2xl:px-6 py-4">
                      <div>
                        <div className="font-medium text-neutral-900">{medicine.name}</div>
                        {medicine.description && (
                          <div className="text-sm text-neutral-500">{medicine.description}</div>
                        )}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 2xl:px-6 py-4">
                      <span className="inline-flex rounded-full bg-primary-100 px-2 py-1 text-xs font-semibold text-primary-800">
                        {medicine.type}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 2xl:px-6 py-4">
                      <span
                        className={`font-medium ${
                          medicine.stock > 100
                            ? 'text-success-600'
                            : medicine.stock > 20
                            ? 'text-warning-600'
                            : 'text-error-600'
                        }`}
                      >
                        {medicine.stock}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 2xl:px-6 py-4 text-sm text-neutral-500">
                      {medicine.unit}
                    </td>
                    <td className="whitespace-nowrap px-4 2xl:px-6 py-4 text-sm text-neutral-900">
                      ₹{medicine.price.toFixed(2)}
                    </td>
                    <td className="whitespace-nowrap px-4 2xl:px-6 py-4 text-sm text-neutral-500">
                      {medicine.manufacturer || '-'}
                    </td>
                    <td className="whitespace-nowrap px-4 2xl:px-6 py-4 text-sm text-neutral-500">
                      {new Date(medicine.updatedAt).toLocaleDateString()}
                    </td>
                    <td className="whitespace-nowrap px-4 2xl:px-6 py-4 text-sm text-neutral-500">
                      {medicine.dateOfExpiry ? (
                        (() => {
                          const expiry = new Date(medicine.dateOfExpiry);
                          const now = new Date();
                          const isExpiringThisMonth =
                            expiry.getFullYear() === now.getFullYear() &&
                            expiry.getMonth() === now.getMonth();
                          return (
                            <span
                              className={`inline-flex rounded-full px-3 py-1 font-semibold
                                ${isExpiringThisMonth ? 'bg-red-100 text-red-700' : 'bg-neutral-100 text-neutral-700'}
                              `}
                            >
                              {expiry.toLocaleDateString()}
                            </span>
                          );
                        })()
                      ) : (
                        '-'
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-4 text-center text-sm text-neutral-500">
                    No medicines found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredMedicines.length > 0 && totalPages > 1 && (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-4 py-3 border-t border-neutral-200">
            <div className="mb-2 sm:mb-0">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                showSummaryOnly
              />
            </div>
            <div className="flex justify-center sm:justify-end">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                showPagesOnly
              />
            </div>
          </div>
        )}
      </div>

      {/* Medicine Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div
            className="
        w-full max-w-5xl
        rounded-2xl
        bg-white/95
        backdrop-blur-md
        p-10
        shadow-2xl
        border border-white/20
        my-12
        overflow-visible
      "
            style={{ minHeight: 'auto' }}
          >
            <h2 className="mb-6 text-2xl font-bold gradient-text">Add New Medicine</h2>
            <MedicineForm
              onSubmit={handleAddMedicine}
              onCancel={() => setShowForm(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PharmacyPage;