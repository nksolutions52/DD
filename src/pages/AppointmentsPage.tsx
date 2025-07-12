import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Plus, Search, User, Eye, Pencil, X } from 'lucide-react';
import { Appointment } from '../types';
import AppointmentForm from '../components/appointments/AppointmentForm';
import Pagination from '../components/common/Pagination';
import { useAppointments } from '../hooks/useApi';
import { usePageHeader } from '../hooks/usePageHeader';
import api from '../services/api';

const ITEMS_PER_PAGE = 10;

const AppointmentsPage = () => {
  const { data: appointments = [], isLoading, error, refetch } = useAppointments();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [appointmentToCancel, setAppointmentToCancel] = useState<Appointment | null>(null);

  // Filter appointments based on search term and status filter
  const filteredAppointments = appointments.filter((appointment:any) => {
    const matchesSearch = appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Sort appointments by date and time (most recent first)
  const sortedAppointments = [...filteredAppointments].sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.startTime}`);
    const dateB = new Date(`${b.date}T${b.startTime}`);
    return dateB.getTime() - dateA.getTime();
  });

  // Calculate pagination
  const totalPages = Math.ceil(sortedAppointments.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedAppointments = sortedAppointments.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Set page header with actions
  usePageHeader({
    title: 'Appointments',
    subtitle: 'Schedule and manage consultations with ease',
    actions: (
      <div className="flex space-x-2 sm:space-x-3">
        <Link to="/calendar" className="btn btn-outline flex items-center">
          <Calendar className="mr-1 h-4 w-4" />
          <span className="hidden sm:inline">Calendar View</span>
          <span className="sm:hidden">Calendar</span>
        </Link>
        <button
          onClick={() => {
            setEditingAppointment(null);
            setShowForm(true);
          }}
          className="btn btn-primary flex items-center"
        >
          <Plus className="mr-1 h-4 w-4" />
          <span className="hidden sm:inline">New Appointment</span>
          <span className="sm:hidden">New</span>
        </button>
      </div>
    ),
  });

  const handleAddAppointment = async (appointment: Appointment) => {
    try {
      await api.appointments.create(appointment);
      refetch();
      setShowForm(false);
      setEditingAppointment(null);
    } catch (error) {
      console.error('Failed to create appointment:', error);
    }
  };

  const handleEditAppointment = async (appointment: Appointment) => {
    try {
      await api.appointments.update(appointment.id, appointment);
      refetch();
      setShowForm(false);
      setEditingAppointment(null);
    } catch (error) {
      console.error('Failed to update appointment:', error);
    }
  };

  const handleCancelAppointment = async (appointment: Appointment) => {
    try {
      await api.appointments.update(appointment.id, { ...appointment, status: 'cancelled' });
      refetch();
    } catch (error) {
      console.error('Failed to cancel appointment:', error);
    }
  };

  const canEditAppointment = (appointment: Appointment) => {
    const appointmentDate = new Date(`${appointment.date}T${appointment.startTime}`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    // Disallow edit/cancel if status is completed, even if today or future
    if (appointment.status === 'completed') return false;
    return appointmentDate >= today;
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-lg text-neutral-500">Loading appointments...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-lg text-error-500">Error loading appointments: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="slide-in space-y-4 sm:space-y-6">
      {/* Search and filters */}
      <div className="flex flex-col space-y-3 sm:space-y-4 md:flex-row md:items-center md:space-y-0 md:space-x-4">
        <div className="relative flex-grow">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 sm:h-5 sm:w-5 text-neutral-400" />
          </div>
          <input
            type="text"
            className="input pl-10 sm:pl-12 w-full"
            placeholder="Search appointments..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset to first page on search
            }}
          />
        </div>
        <div className="w-full md:w-48">
          <select
            className="input w-full"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1); // Reset to first page on filter change
            }}
          >
            <option value="all">All Statuses</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Appointments list */}
      <div className="overflow-hidden rounded-xl sm:rounded-2xl border border-neutral-200 bg-white shadow-xl">
        {/* Mobile Card View */}
        <div className="block xl:hidden">
          {paginatedAppointments.length > 0 ? (
            <div className="divide-y divide-neutral-200">
              {paginatedAppointments.map((appointment) => (
                <div key={appointment.id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center mb-2">
                        <div className="h-8 w-8 flex-shrink-0 rounded-full bg-neutral-200 flex items-center justify-center mr-3">
                          <User className="h-4 w-4 text-neutral-500" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-neutral-900 truncate">
                            {appointment.patientName}
                          </p>
                          <p className="text-xs text-neutral-500">
                            {new Date(`${appointment.date}T${appointment.startTime}`).toLocaleString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                              hour: 'numeric',
                              minute: 'numeric',
                              hour12: true,
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <p className="text-xs text-neutral-600">
                          <span className="font-medium">Doctor:</span> {appointment.dentistName}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <span
                            className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                              appointment.treatmentType === 'dental'
                                ? 'bg-primary-100 text-primary-800'
                                : appointment.treatmentType === 'hair'
                                ? 'bg-accent-100 text-accent-800'
                                : appointment.treatmentType === 'skin'
                                ? 'bg-secondary-100 text-secondary-800'
                                : 'bg-neutral-100 text-neutral-800'
                            }`}
                          >
                            {appointment.treatmentType
                              ? appointment.treatmentType.charAt(0).toUpperCase() + appointment.treatmentType.slice(1)
                              : '-'}
                          </span>
                          <span className="inline-flex rounded-full bg-primary-100 px-2 py-1 text-xs font-semibold text-primary-800">
                            {appointment.type.replace('-', ' ')}
                          </span>
                          <span
                            className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                              appointment.status === 'confirmed'
                                ? 'bg-success-100 text-success-800'
                                : appointment.status === 'scheduled'
                                ? 'bg-accent-100 text-accent-800'
                                : appointment.status === 'completed'
                                ? 'bg-secondary-100 text-secondary-800'
                                : appointment.status === 'cancelled'
                                ? 'bg-error-100 text-error-800'
                                : 'bg-neutral-100 text-neutral-800'
                            }`}
                          >
                            {appointment.status}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2 ml-3">
                      <Link
                        to={`/patients/${appointment.patientId}`}
                        className="p-2 text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors"
                        title="View Patient"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      {canEditAppointment(appointment) && (
                        <>
                          <button
                            onClick={() => {
                              setEditingAppointment(appointment);
                              setShowForm(true);
                            }}
                            className="p-2 text-secondary-600 hover:text-secondary-700 hover:bg-secondary-50 rounded-lg transition-colors"
                            title="Edit Appointment"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          {appointment.status !== 'cancelled' && (
                            <button
                              onClick={() => {
                                setAppointmentToCancel(appointment);
                                setShowCancelModal(true);
                              }}
                              className="p-2 text-error-600 hover:text-error-700 hover:bg-error-50 rounded-lg transition-colors"
                              title="Cancel Appointment"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 sm:p-12 text-center text-sm text-neutral-500">
              No appointments found
            </div>
          )}
        </div>

        {/* Desktop Table View */}
        <div className="hidden xl:block">
          <table className="min-w-full divide-y divide-neutral-200 rounded-2xl overflow-hidden">
            <thead className="bg-neutral-50">
              <tr>
                <th scope="col" className="px-4 2xl:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">
                  Patient
                </th>
                <th scope="col" className="px-4 2xl:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">
                  Date & Time
                </th>
                <th scope="col" className="px-4 2xl:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">
                  Dentist
                </th>
                <th scope="col" className="px-4 2xl:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">
                  Treatment
                </th>
                <th scope="col" className="px-4 2xl:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">
                  Type
                </th>
                <th scope="col" className="px-4 2xl:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">
                  Status
                </th>
                <th scope="col" className="px-4 2xl:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {paginatedAppointments.length > 0 ? (
                paginatedAppointments.map((appointment) => (
                  <tr key={appointment.id} className="hover:bg-neutral-50 transition rounded-xl">
                    <td className="whitespace-nowrap px-4 2xl:px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-8 w-8 flex-shrink-0 rounded-full bg-neutral-200 flex items-center justify-center">
                          <User className="h-4 w-4 text-neutral-500" />
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-neutral-900">
                            {appointment.patientName}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 2xl:px-6 py-4 text-sm text-neutral-500">
                      {new Date(`${appointment.date}T${appointment.startTime}`).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: 'numeric',
                        minute: 'numeric',
                        hour12: true,
                      })}
                    </td>
                    <td className="whitespace-nowrap px-4 2xl:px-6 py-4 text-sm text-neutral-900">
                      {appointment.dentistName}
                    </td>
                    <td className="whitespace-nowrap px-4 2xl:px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                          appointment.treatmentType === 'dental'
                            ? 'bg-primary-100 text-primary-800'
                            : appointment.treatmentType === 'hair'
                            ? 'bg-accent-100 text-accent-800'
                            : appointment.treatmentType === 'skin'
                            ? 'bg-secondary-100 text-secondary-800'
                            : 'bg-neutral-100 text-neutral-800'
                        }`}
                      >
                        {appointment.treatmentType
                          ? appointment.treatmentType.charAt(0).toUpperCase() + appointment.treatmentType.slice(1)
                          : '-'}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 2xl:px-6 py-4">
                      <span className="inline-flex rounded-full bg-primary-100 px-2 py-1 text-xs font-semibold text-primary-800">
                        {appointment.type.replace('-', ' ')}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 2xl:px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                          appointment.status === 'confirmed'
                            ? 'bg-success-100 text-success-800'
                            : appointment.status === 'scheduled'
                            ? 'bg-accent-100 text-accent-800'
                            : appointment.status === 'completed'
                            ? 'bg-secondary-100 text-secondary-800'
                            : appointment.status === 'cancelled'
                            ? 'bg-error-100 text-error-800'
                            : 'bg-neutral-100 text-neutral-800'
                        }`}
                      >
                        {appointment.status}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 2xl:px-6 py-4 text-sm">
                      <div className="flex space-x-2">
                        <Link
                          to={`/patients/${appointment.patientId}`}
                          className="inline-flex items-center justify-center rounded-full p-2 hover:bg-primary-50 hover:text-primary-700 transition"
                          title="View Patient"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        {canEditAppointment(appointment) && (
                          <>
                            <button
                              onClick={() => {
                                setEditingAppointment(appointment);
                                setShowForm(true);
                              }}
                              className="inline-flex items-center justify-center rounded-full p-2 hover:bg-secondary-50 hover:text-secondary-700 transition"
                              title="Edit Appointment"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                            {appointment.status !== 'cancelled' && (
                              <button
                                onClick={() => {
                                  setAppointmentToCancel(appointment);
                                  setShowCancelModal(true);
                                }}
                                className="inline-flex items-center justify-center rounded-full p-2 hover:bg-error-50 hover:text-error-700 transition"
                                title="Cancel Appointment"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-sm text-neutral-500">
                    No appointments found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredAppointments.length > 0 && totalPages > 1 && (
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

      {/* Appointment Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-3xl rounded-2xl bg-white/95 backdrop-blur-md p-8 shadow-2xl border border-white/20">
           <h2 className="mb-6 text-2xl font-bold gradient-text">Schedule An Appointment</h2>
            <AppointmentForm
              appointment={editingAppointment || undefined}
              onSubmit={editingAppointment ? handleEditAppointment : handleAddAppointment}
              onCancel={() => {
                setShowForm(false);
                setEditingAppointment(null);
              }}
            />
          </div>
        </div>
      )}

      {/* Cancel Appointment Modal */}
      {showCancelModal && appointmentToCancel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl border border-white/20">
            <h2 className="text-lg font-semibold mb-4 text-error-700">Cancel Appointment</h2>
            <p className="mb-6">Are you sure you want to cancel this appointment?</p>
            <div className="flex justify-end space-x-3">
              <button
                className="btn btn-outline"
                onClick={() => setShowCancelModal(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-error"
                onClick={async () => {
                  if (appointmentToCancel) {
                    await handleCancelAppointment(appointmentToCancel);
                    setShowCancelModal(false);
                    setAppointmentToCancel(null);
                  }
                }}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentsPage;