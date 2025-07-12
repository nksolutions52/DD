import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Calendar, ChevronLeft, Edit, Mail, Phone, User, Pill, IndianRupee, Plus, X, CheckCircle, ClipboardList } from 'lucide-react';
import { Patient, Appointment, Prescription } from '../types';
import PatientForm from '../components/patients/PatientForm';
import PrescriptionForm from '../components/pharmacy/PrescriptionForm';
import Pagination from '../components/common/Pagination';
import { usePatient, useAppointmentsByPatient, usePrescriptionsByPatient, useTreatmentsByPatient, useAmountsByPatient } from '../hooks/useApi';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const ITEMS_PER_PAGE = 10;

const PatientDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [isEditing, setIsEditing] = useState(false);
  const [showPrescriptionForm, setShowPrescriptionForm] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [appointmentToComplete, setAppointmentToComplete] = useState<Appointment | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<string>('0');
  const [paymentType, setPaymentType] = useState<'cash' | 'online'>('cash');
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showTreatmentForm, setShowTreatmentForm] = useState(false);
  const [selectedTreatmentAppointment, setSelectedTreatmentAppointment] = useState<Appointment | null>(null);
  const [treatmentDescription, setTreatmentDescription] = useState('');

  const { user } = useAuth();

  const { data: patient, isLoading: isLoadingPatient, error: patientError, refetch: refetchPatient } = usePatient(parseInt(id!));
  const { data: appointments = [], isLoading: isLoadingAppointments, refetch: refetchAppointments } = useAppointmentsByPatient(parseInt(id!));
  const { data: prescriptions = [], isLoading: isLoadingPrescriptions, refetch: refetchPrescriptions } = usePrescriptionsByPatient(parseInt(id!));
  const { data: treatments = [], isLoading: isLoadingTreatments, refetch: refetchTreatments } = useTreatmentsByPatient(parseInt(id!));
  const { data: amounts = [], isLoading: isLoadingAmounts, refetch: refetchAmounts } = useAmountsByPatient(parseInt(id!));

  // Pagination for appointments
  const sortedAppointments = [...appointments].sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.startTime}`);
    const dateB = new Date(`${b.date}T${b.startTime}`);
    return dateB.getTime() - dateA.getTime();
  });
  const totalPages = Math.ceil(sortedAppointments.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedAppointments = sortedAppointments.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const handleUpdatePatient = async (updatedPatient: Patient) => {
    try {
      await api.patients.update(parseInt(id!), updatedPatient);
      refetchPatient();
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update patient:', error);
    }
  };

  const handleAddPrescription = async (prescription: Prescription) => {
    try {
      await api.prescriptions.create(prescription);
      await refetchPrescriptions();
      setShowPrescriptionForm(false);
      setSelectedAppointment(null);
    } catch (error) {
      console.error('Failed to create prescription:', error);
    }
  };

  const handlePayment = async () => {
    setPaymentError(null);
    if (!selectedAppointment) return;

    // Validation
    if (!paymentAmount || isNaN(Number(paymentAmount)) || Number(paymentAmount) <= 0) {
      setPaymentError('Amount must be greater than 0');
      return;
    }
    if (!paymentType) {
      setPaymentError('Please select a payment type');
      return;
    }

    setIsProcessing(true);
    try {
      await api.amounts.create({
        appointmentId: selectedAppointment.id,
        patientId: selectedAppointment.patientId,
        amount: Number(paymentAmount),
        paymentType,
      });
      setShowPaymentModal(false);
      setPaymentAmount('0');
      setPaymentType('cash');
      await refetchAmounts();
    } catch (err) {
      setPaymentError('Failed to add payment');
    } finally {
      setIsProcessing(false);
    }
  };

  // --- Update handleEditPayment to prefill with latest amount ---
  const handleEditPayment = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    // Find all amounts for this appointment
    const appointmentAmounts = amounts.filter(a => a.appointmentId === appointment.id);
    // Get the latest amount by createdAt
    const latestAmount = appointmentAmounts.length > 0
      ? appointmentAmounts.reduce((a, b) =>
          new Date(a.createdAt) > new Date(b.createdAt) ? a : b
        )
      : null;
    setPaymentAmount(latestAmount ? latestAmount.amount.toString() : '');
    setPaymentType(latestAmount ? latestAmount.paymentType : 'cash');
    setShowPaymentModal(true);
  };

  const handleMarkCompleted = async (appointment: Appointment) => {
    try {
      await api.appointments.update(appointment.id, {
        ...appointment,
        status: 'completed',
      });
      await refetchAppointments();
    } catch (error) {
      console.error('Failed to update appointment status:', error);
    }
  };

  const handleCompleteAppointment = (appointment: Appointment) => {
    setAppointmentToComplete(appointment);
    setShowCompleteModal(true);
  };

  const handleAddTreatment = async (treatment: { appointmentId: number; description: string }) => {
    try {
      await api.treatments.create(treatment);
      await refetchTreatments();
    } catch (error) {
      console.error('Failed to create treatment:', error);
    }
  };

  const canAddPrescription = (appointment: Appointment) => {
    const appointmentDate = new Date(appointment.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    appointmentDate.setHours(0, 0, 0, 0);
    return appointmentDate.getTime() === today.getTime();
  };

  if (isLoadingPatient || isLoadingAppointments || isLoadingPrescriptions || isLoadingTreatments) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-lg text-neutral-500">Loading patient data...</p>
      </div>
    );
  }

  if (patientError || !patient) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-lg text-error-500">Error loading patient: {patientError?.message || 'Patient not found'}</p>
      </div>
    );
  }

  const prescriptionsByAppointment = prescriptions.reduce((acc, prescription) => {
    if (!acc[prescription.appointmentId]) {
      acc[prescription.appointmentId] = [];
    }
    acc[prescription.appointmentId].push(prescription);
    return acc;
  }, {} as Record<number, Prescription[]>);

  return (
    <div className="slide-in">
      {/* <div className="mb-6 flex items-center">
        <Link to="/patients" className="mr-3 flex items-center text-sm text-neutral-500 hover:text-neutral-700">
          <ChevronLeft className="h-4 w-4" />
          Back to Patients
        </Link>
        <h1 className="text-2xl font-bold text-neutral-900">
          {patient.firstName} {patient.lastName}
        </h1>
      </div> */}

      <div className="mb-6 flex flex-col justify-between space-y-4 md:flex-row md:items-center md:space-y-0">
        <div className="flex items-center">
           <Link to="/patients" className="mr-3 flex items-center text-sm text-neutral-500 hover:text-neutral-700">
          <ChevronLeft className="h-4 w-4" />
          Back
        </Link>
          <div className="mr-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-100 text-primary-600">
            <User className="h-8 w-8" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-neutral-900">
              {patient.firstName} {patient.lastName}
            </h2>
            <div className="flex flex-wrap items-center text-sm text-neutral-500">
              <div className="mr-4 flex items-center">
                <Mail className="mr-1 h-4 w-4" />
                {patient.email}
              </div>
              <div className="flex items-center">
                <Phone className="mr-1 h-4 w-4" />
                {patient.phone}
              </div>
            </div>
          </div>
        </div>
        <div className="flex space-x-3">
          {/* <button
            onClick={() => setShowPrescriptionForm(true)}
            className="btn btn-primary flex items-center"
          >
            <Plus className="mr-1 h-4 w-4" />
            Add Prescription
          </button> */}
          <button
            onClick={() => setIsEditing(true)}
            className="btn btn-primary flex items-center"
          >
            <Edit className="mr-1 h-4 w-4" />
            Edit Patient
          </button>
        </div>
      </div>

      <div className="mb-6 border-b border-neutral-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-4 text-sm font-medium ${
              activeTab === 'overview'
                ? 'border-b-2 border-primary-600 text-primary-700'
                : 'text-neutral-600 hover:border-b-2 hover:border-neutral-300 hover:text-neutral-700'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('appointments')}
            className={`pb-4 text-sm font-medium ${
              activeTab === 'appointments'
                ? 'border-b-2 border-primary-600 text-primary-700'
                : 'text-neutral-600 hover:border-b-2 hover:border-neutral-300 hover:text-neutral-700'
            }`}
          >
            Appointments
          </button>
          {/* Move Treatments tab here */}
          <button
            onClick={() => setActiveTab('treatments')}
            className={`pb-4 text-sm font-medium ${
              activeTab === 'treatments'
                ? 'border-b-2 border-primary-600 text-primary-700'
                : 'text-neutral-600 hover:border-b-2 hover:border-neutral-300 hover:text-neutral-700'
            }`}
          >
            Treatments
          </button>
          <button
            onClick={() => setActiveTab('prescriptions')}
            className={`pb-4 text-sm font-medium ${
              activeTab === 'prescriptions'
                ? 'border-b-2 border-primary-600 text-primary-700'
                : 'text-neutral-600 hover:border-b-2 hover:border-neutral-300 hover:text-neutral-700'
            }`}
          >
            Prescriptions
          </button>
          <button
            onClick={() => setActiveTab('medicalHistory')}
            className={`pb-4 text-sm font-medium ${
              activeTab === 'medicalHistory'
                ? 'border-b-2 border-primary-600 text-primary-700'
                : 'text-neutral-600 hover:border-b-2 hover:border-neutral-300 hover:text-neutral-700'
            }`}
          >
            Medical History
          </button>
          <button
            onClick={() => setActiveTab('paymentHistory')}
            className={`pb-4 text-sm font-medium ${
              activeTab === 'paymentHistory'
                ? 'border-b-2 border-primary-600 text-primary-700'
                : 'text-neutral-600 hover:border-b-2 hover:border-neutral-300 hover:text-neutral-700'
            }`}
          >
            Payment History
          </button>
        </nav>
      </div>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
        {activeTab === 'overview' && (
          <>
            <div className="rounded-2xl border border-neutral-200 bg-white shadow-xl p-6 lg:col-span-2">
              <h3 className="mb-4 text-lg font-semibold text-neutral-900">Patient Information</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm font-medium text-neutral-500">Full Name</p>
                  <p className="text-neutral-900">
                    {patient.firstName} {patient.lastName}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-500">Date of Birth</p>
                  <p className="text-neutral-900">
                    {new Date(patient.dateOfBirth).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-500">Gender</p>
                  <p className="text-neutral-900">
                    {patient.gender.charAt(0).toUpperCase() + patient.gender.slice(1)}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-500">Email</p>
                  <p className="text-neutral-900">{patient.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-500">Phone</p>
                  <p className="text-neutral-900">{patient.phone}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-500">Address</p>
                  <p className="text-neutral-900">{patient.address}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm font-medium text-neutral-500">Insurance Information</p>
                  <p className="text-neutral-900">{patient.insuranceInfo || 'Not provided'}</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-2xl border border-neutral-200 bg-white shadow-xl p-6">
                <h3 className="mb-4 text-lg font-semibold text-neutral-900">Recent Prescriptions</h3>
                {prescriptions.length > 0 ? (
                  <div className="space-y-3">
                    {prescriptions.slice(0, 3).map((prescription) => (
                      <div
                        key={prescription.id}
                        className="flex items-start rounded-md border border-neutral-200 p-3"
                      >
                        <div className="mr-3 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-600">
                          <Pill className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium text-neutral-900">
                            {prescription.items.length} medications prescribed
                          </p>
                          <p className="text-sm text-neutral-500">
                            {new Date(prescription.createdAt).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-neutral-500">
                            By: {prescription.dentistName}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-neutral-500">No recent prescriptions</p>
                )}
              </div>

              <div className="rounded-2xl border border-neutral-200 bg-white shadow-xl p-6">
                <h3 className="mb-4 text-lg font-semibold text-neutral-900">Upcoming Appointments</h3>
                {appointments.length > 0 ? (
                  <div className="space-y-3">
                    {appointments
                      .filter((a) => new Date(`${a.date}T${a.startTime}`) >= new Date())
                      .slice(0, 3)
                      .map((appointment) => (
                        <div
                          key={appointment.id}
                          className="flex items-start rounded-md border border-neutral-200 p-3"
                        >
                          <div className="mr-3 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-600">
                            <Calendar className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-medium text-neutral-900">
                              {appointment.type.replace('-', ' ')}
                            </p>
                            <p className="text-sm text-neutral-500">
                              {new Date(`${appointment.date}T${appointment.startTime}`).toLocaleString(
                                'en-US',
                                {
                                  month: 'short',
                                  day: 'numeric',
                                  hour: 'numeric',
                                  minute: 'numeric',
                                  hour12: true,
                                }
                              )}
                            </p>
                            <span
                              className={`mt-1 inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                                appointment.status === 'confirmed'
                                  ? 'bg-success-100 text-success-800'
                                  : appointment.status === 'scheduled'
                                  ? 'bg-accent-100 text-accent-800'
                                  : 'bg-neutral-100 text-neutral-800'
                              }`}
                            >
                              {appointment.status}
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <p className="text-neutral-500">No upcoming appointments</p>
                )}
              </div>
            </div>
          </>
        )}

        {activeTab === 'appointments' && (
          <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-xl p-6 lg:col-span-3">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-neutral-900">Appointment History</h3>
              <Link to="/appointments" className="btn btn-outline flex items-center">
                <Calendar className="mr-1 h-4 w-4" />
                Book New Appointment
              </Link>
            </div>
            {appointments.length > 0 ? (
              <>
                <table className="min-w-full divide-y divide-neutral-200 rounded-2xl overflow-hidden">
                  <thead className="bg-neutral-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">
                        Date & Time
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">
                        Dentist
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">
                        Notes
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200 bg-white">
                    {paginatedAppointments.map((appointment) => {
                      // Find all amounts for this appointment
                      const appointmentAmounts = amounts.filter(a => a.appointmentId === appointment.id);
                      // Calculate the total amount for this appointment
                      const totalAmount = appointmentAmounts.reduce((sum, a) => sum + (a.amount || 0), 0);

                      // Check if logged in user is the dentist for this appointment
                      const isDentist = user && appointment.dentistId === user.id;
                      return (
                        <tr key={appointment.id} className="hover:bg-neutral-50 transition rounded-xl">
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-neutral-900">
                            {new Date(`${appointment.date}T${appointment.startTime}`).toLocaleString(
                              'en-US',
                              {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: 'numeric',
                                minute: 'numeric',
                                hour12: true,
                              }
                            )}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-neutral-900">
                            {appointment.dentistName}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            <span className="inline-flex rounded-full bg-primary-100 px-2 py-1 text-xs font-semibold text-primary-800">
                              {appointment.type.replace('-', ' ')}
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
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
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-neutral-900">
                            {totalAmount > 0 ? (
                              <button
                                onClick={() => handleEditPayment(appointment)}
                                className="text-primary-500 hover:text-primary-700 flex items-center"
                              >
                                <IndianRupee className="h-4 w-4 mr-1" />
                                {totalAmount.toFixed(2)}
                              </button>
                            ) : (
                              <button
                                onClick={() => {
                                  setSelectedAppointment(appointment);
                                  setShowPaymentModal(true);
                                }}
                                className="text-primary-500 hover:text-primary-700 flex items-center"
                              >
                                <IndianRupee className="h-4 w-4 mr-1" />
                                Add Payment
                              </button>
                            )}
                          </td>
                          <td className="px-6 py-4 text-sm text-neutral-500">
                            {appointment.notes || 'No notes'}
                          </td>
                          <td className="px-6 py-4 text-sm space-x-2">
                            {(canAddPrescription(appointment) && isDentist) && (
                              <button
                                onClick={() => {
                                  setSelectedAppointment(appointment);
                                  setShowPrescriptionForm(true);
                                }}
                                title="Add Prescription"
                                className="text-primary-500 hover:text-primary-700"
                              >
                                <Pill className="h-5 w-5" />
                              </button>
                            )}
                            {/* Treatment Icon */}
                            {(canAddPrescription(appointment) && isDentist) && (
                              <button
                                onClick={() => {
                                  setSelectedTreatmentAppointment(appointment);
                                  setShowTreatmentForm(true);
                                }}
                                title="Add Treatment"
                                className="text-accent-500 hover:text-accent-700"
                              >
                                <ClipboardList className="h-5 w-5" />
                              </button>
                            )}
                            {appointment.status === 'confirmed' && (
                              <button
                                onClick={() => {
                                  setAppointmentToComplete(appointment);
                                  setShowCompleteModal(true);
                                }}
                                title="Mark as Completed"
                                className="ml-2 text-success-600 hover:text-success-800"
                              >
                                <CheckCircle className="h-5 w-5" />
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {/* Pagination */}
                {sortedAppointments.length > 0 && totalPages > 1 && (
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-4 py-3">
                    <div>
                      <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                        pageClassName="mb-2 mr-2"
                        summaryClassName="ml-0"
                        showSummaryOnly
                      />
                    </div>
                    <div>
                      <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                        pageClassName="mb-2 mr-2"
                        summaryClassName="hidden"
                        showPagesOnly
                      />
                    </div>
                  </div>
                )}
              </>
            ) : (
              <p className="text-neutral-500">No appointment history</p>
            )}
          </div>
        )}
        {activeTab === 'treatments' && (
          <div className="rounded-2xl border border-neutral-200 bg-white shadow-xl p-6 lg:col-span-3">
            <h3 className="mb-6 text-lg font-semibold text-neutral-900">Treatment History</h3>
            {treatments.length === 0 ? (
              <p className="text-neutral-500">No treatment history</p>
            ) : (
              appointments.map((appointment) => {
                const appointmentTreatments = treatments.filter(t => t.appointmentId === appointment.id);
                if (appointmentTreatments.length === 0) return null;
                return (
                  <div key={appointment.id} className="rounded-lg border border-neutral-200 p-4 mb-6">
                    <div className="mb-4">
                      <h4 className="font-medium text-neutral-900">
                        Appointment on {new Date(appointment.date).toLocaleDateString()}
                      </h4>
                      <p className="text-sm text-neutral-500">
                        {appointment.type.replace('-', ' ')} with {appointment.dentistName}
                      </p>
                    </div>
                    <div className="space-y-4">
                      {appointmentTreatments.map((treatment) => (
                        <div key={treatment.id} className="rounded-lg bg-neutral-50 p-4">
                          <div className="mb-3">
                            <p className="text-sm text-neutral-500">
                              Added on {new Date(treatment.createdAt).toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <p className="font-medium text-neutral-900">{treatment.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {activeTab === 'prescriptions' && (
          <div className="rounded-2xl border border-neutral-200 bg-white shadow-xl p-6 lg:col-span-3">
            <h3 className="mb-6 text-lg font-semibold text-neutral-900">Prescription History</h3>
            {prescriptions.length === 0 ? (
              <p className="text-neutral-500">No prescription history</p>
            ) : (
              appointments.map((appointment) => {
                const appointmentPrescriptions = prescriptionsByAppointment[appointment.id] || [];
                if (appointmentPrescriptions.length === 0) return null;
                return (
                  <div key={appointment.id} className="rounded-lg border border-neutral-200 p-4 mb-6">
                    <div className="mb-4">
                      <h4 className="font-medium text-neutral-900">
                        Appointment on {new Date(appointment.date).toLocaleDateString()}
                      </h4>
                      <p className="text-sm text-neutral-500">
                        {appointment.type.replace('-', ' ')} with {appointment.dentistName}
                      </p>
                    </div>
                    <div className="space-y-4">
                      {appointmentPrescriptions.map((prescription) => (
                        <div key={prescription.id} className="rounded-lg bg-neutral-50 p-4">
                          <div className="mb-3">
                            <p className="text-sm text-neutral-500">
                              Prescribed on {new Date(prescription.createdAt).toLocaleString()}
                            </p>
                          </div>
                          <div className="space-y-3">
                            {prescription.items.map((item, idx) => (
                              <div key={idx} className="rounded-md bg-white p-3 shadow-sm">
                                <p className="font-medium text-neutral-900">
                                  {item.medicineName} ({item.medicineType})
                                </p>
                                <p className="text-sm text-neutral-600">
                                  Dosage: {item.dosage} | Frequency: {item.frequency} | Duration: {item.duration}
                                </p>
                                {item.instructions && (
                                  <p className="mt-1 text-sm text-neutral-500">
                                    Instructions: {item.instructions}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                          {prescription.notes && (
                            <div className="mt-3 text-sm text-neutral-500">
                              <p className="font-medium">Notes:</p>
                              <p>{prescription.notes}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {activeTab === 'medicalHistory' && (
          <div className="rounded-2xl border border-neutral-200 bg-white shadow-xl p-6 lg:col-span-3">
            <h3 className="mb-4 text-lg font-semibold text-neutral-900">Medical History</h3>
            <p className="text-neutral-500">No medical history available</p>
          </div>
        )}
        {activeTab === 'paymentHistory' && (
          <div className="rounded-2xl border border-neutral-200 bg-white shadow-xl p-6 lg:col-span-3">
            <h3 className="mb-6 text-lg font-semibold text-neutral-900">Payment History</h3>
            {appointments.length === 0 ? (
              <p className="text-neutral-500">No payment history</p>
            ) : (
              appointments.map((appointment) => {
                const appointmentAmounts = amounts.filter(a => a.appointmentId === appointment.id);
                if (appointmentAmounts.length === 0) return null;
                return (
                  <div key={appointment.id} className="rounded-lg border border-neutral-200 p-4 mb-6">
                    <div className="mb-4">
                      <h4 className="font-medium text-neutral-900">
                        Appointment on {new Date(appointment.date).toLocaleDateString()}
                      </h4>
                      <p className="text-sm text-neutral-500">
                        {appointment.type.replace('-', ' ')} with {appointment.dentistName}
                      </p>
                    </div>
                    <div className="space-y-4">
                      {appointmentAmounts.map((amount) => (
                        <div key={amount.id} className="rounded-lg bg-neutral-50 p-4 flex items-center justify-between">
                          <div>
                            <p className="font-medium text-neutral-900">
                              ₹{amount.amount.toFixed(2)}
                            </p>
                            <p className="text-sm text-neutral-500">
                              {amount.paymentType.charAt(0).toUpperCase() + amount.paymentType.slice(1)} payment
                            </p>
                          </div>
                          <div className="text-sm text-neutral-500">
                            {amount.createdAt
                              ? new Date(amount.createdAt).toLocaleString()
                              : ''}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* Patient Form Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white/95 backdrop-blur-md p-6 shadow-2xl border border-white/20 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <h2 className="mb-6 text-2xl font-bold gradient-text">
              Edit Patient
            </h2>
            <PatientForm
              patient={patient}
              onSubmit={handleUpdatePatient}
              onCancel={() => setIsEditing(false)}
            />
          </div>
        </div>
      )}

      {/* Prescription Form Modal */}
      {showPrescriptionForm && selectedAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-3xl rounded-2xl bg-white/95 backdrop-blur-md p-8 shadow-2xl border border-white/20 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <h2 className="mb-4 text-xl font-bold">Add New Prescription</h2>
            <PrescriptionForm
              appointment={selectedAppointment}
              onSubmit={handleAddPrescription}
              onCancel={() => {
                setShowPrescriptionForm(false);
                setSelectedAppointment(null);
              }}
            />
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white/95 backdrop-blur-md p-8 shadow-2xl border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-neutral-900">Update Payment</h2>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="btn btn-outline btn-icon"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Amount
              </label>
              <input
                type="number"
                min={0}
                value={paymentAmount}
                onChange={e => setPaymentAmount(e.target.value)}
                className="input w-full"
                required
              />
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Payment Type
              </label>
              <select
                value={paymentType}
                onChange={e => setPaymentType(e.target.value as 'cash' | 'online')}
                className="input w-full"
                required
              >
                <option value="cash">Cash</option>
                <option value="online">Online</option>
              </select>
            </div>
            {paymentError && <div className="text-red-500 mt-2">{paymentError}</div>}
            <div className="flex justify-end space-x-3 pt-6 border-t border-neutral-200 mt-8">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button
                onClick={handlePayment}
                className="btn btn-primary"
                disabled={isProcessing}
              >
                {isProcessing ? 'Processing...' : 'Update Payment'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Complete Appointment Modal */}
      {showCompleteModal && appointmentToComplete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white/95 backdrop-blur-md p-8 shadow-2xl border border-white/20">
            <h2 className="text-lg font-semibold mb-4">Mark Appointment as Completed?</h2>
            <p className="mb-6">Are you sure you want to mark this appointment as completed?</p>
            <div className="flex justify-end space-x-3">
              <button
                className="btn btn-neutral"
                onClick={() => setShowCompleteModal(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-success"
                onClick={async () => {
                  if (appointmentToComplete) {
                    await handleMarkCompleted(appointmentToComplete);
                    setShowCompleteModal(false);
                    setAppointmentToComplete(null);
                  }
                }}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Treatment Form Modal */}
      {showTreatmentForm && selectedTreatmentAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white/95 backdrop-blur-md p-8 shadow-2xl border border-white/20">
            <h2 className="mb-4 text-xl font-bold">Add Treatment</h2>
            <div className="mb-4">
              <p className="text-sm text-neutral-500">
                {selectedTreatmentAppointment.type.replace('-', ' ')} with {selectedTreatmentAppointment.dentistName}
              </p>
              <p className="text-sm text-neutral-500">
                {new Date(`${selectedTreatmentAppointment.date}T${selectedTreatmentAppointment.startTime}`).toLocaleString()}
              </p>
            </div>
            <textarea
              className="input w-full min-h-[100px]"
              placeholder="Enter treatment description"
              value={treatmentDescription}
              onChange={e => setTreatmentDescription(e.target.value)}
            />
            <div className="flex justify-end space-x-3 pt-6 border-t border-neutral-200 mt-8">
              <button
                onClick={() => {
                  setShowTreatmentForm(false);
                  setSelectedTreatmentAppointment(null);
                  setTreatmentDescription('');
                }}
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  // Call API to save treatment
                  if (selectedTreatmentAppointment && treatmentDescription.trim()) {
                    await handleAddTreatment({
                      appointmentId: selectedTreatmentAppointment.id,
                      description: treatmentDescription,
                    });
                    setShowTreatmentForm(false);
                    setSelectedTreatmentAppointment(null);
                    setTreatmentDescription('');
                  }
                }}
                className="btn btn-primary"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientDetailPage;