import { useState, useEffect } from 'react';
import { Calendar, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay } from 'date-fns';
import { Appointment, CalendarViewType } from '../types';
import AppointmentForm from '../components/appointments/AppointmentForm';
import { useAppointmentsByDate, useAppointmentsByWeek, useAppointmentsByMonth } from '../hooks/useApi';
import { usePageHeader } from '../hooks/usePageHeader';
import api from '../services/api';
import { Link } from 'react-router-dom';

const CalendarPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewType, setViewType] = useState<CalendarViewType>('month');
  const [showForm, setShowForm] = useState(false);
  
  // Get appointments based on view type
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;
  const formattedDate = format(currentDate, 'yyyy-MM-dd');
  
  const {
    data: monthAppointments = [],
    isLoading: isLoadingMonth,
    error: monthError,
    refetch: refetchMonth
  } = useAppointmentsByMonth(year, month);

  const {
    data: weekAppointments = [],
    isLoading: isLoadingWeek,
    error: weekError,
    refetch: refetchWeek
  } = useAppointmentsByWeek(formattedDate);

  const {
    data: dayAppointments = [],
    isLoading: isLoadingDay,
    error: dayError,
    refetch: refetchDay
  } = useAppointmentsByDate(formattedDate);

  // Get appointments based on current view
  const appointments = viewType === 'month' 
    ? monthAppointments 
    : viewType === 'week'
    ? weekAppointments
    : dayAppointments;

  const isLoading = viewType === 'month'
    ? isLoadingMonth
    : viewType === 'week'
    ? isLoadingWeek
    : isLoadingDay;

  const error = viewType === 'month'
    ? monthError
    : viewType === 'week'
    ? weekError
    : dayError;

  const refetch = () => {
    if (viewType === 'month') {
      refetchMonth();
    } else if (viewType === 'week') {
      refetchWeek();
    } else {
      refetchDay();
    }
  };

  // Set page header with actions
  usePageHeader({
    title: 'Calendar',
    subtitle: 'View and manage all appointments in calendar format',
    actions: (
      <div className="flex space-x-2 sm:space-x-3">
        <Link to="/appointments" className="btn btn-outline flex items-center">
          <Calendar className="mr-1 h-4 w-4" />
          <span className="hidden sm:inline">Appointment List</span>
          <span className="sm:hidden">List</span>
        </Link>
        <button
          onClick={() => setShowForm(true)}
          className="btn btn-primary flex items-center"
        >
          <Plus className="mr-1 h-4 w-4" />
          <span className="hidden sm:inline">New Appointment</span>
          <span className="sm:hidden">New</span>
        </button>
      </div>
    ),
  });

  // Effect to refetch data when date or view changes
  useEffect(() => {
    refetch();
  }, [currentDate, viewType]);

  const handleAddAppointment = async (appointment: Appointment) => {
    try {
      await api.appointments.create(appointment);
      refetch();
      setShowForm(false);
    } catch (error) {
      console.error('Failed to create appointment:', error);
    }
  };

  const handlePrevious = () => {
    if (viewType === 'month') {
      setCurrentDate(subMonths(currentDate, 1));
    } else if (viewType === 'week') {
      setCurrentDate(addDays(currentDate, -7));
    } else {
      setCurrentDate(addDays(currentDate, -1));
    }
  };

  const handleNext = () => {
    if (viewType === 'month') {
      setCurrentDate(addMonths(currentDate, 1));
    } else if (viewType === 'week') {
      setCurrentDate(addDays(currentDate, 7));
    } else {
      setCurrentDate(addDays(currentDate, 1));
    }
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  // Month View
  const renderMonthView = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;

    // Calendar header with day names
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // Create calendar rows
    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = day;
        const formattedDate = format(cloneDay, 'yyyy-MM-dd');
        const dayAppointments = appointments.filter(a => a.date === formattedDate);

        days.push(
          <div
            key={day.toString()}
            className="calendar-day"
            style={{
              border: '1px solid',
              borderColor: 'rgba(188,181,181,0.3)',
              display: 'flex',
              flexDirection: 'column',
              height: 110, // or any fixed height you prefer
              minHeight: 90,
              overflow: 'hidden',
            }}
          >
            <div className="font-medium text-right">{format(day, 'd')}</div>
            <div
              className="mt-1 space-y-1"
              style={{
                flex: 1,
                overflowY: 'auto',
                maxHeight: 70, // adjust as needed to fit your design
              }}
            >
              {dayAppointments.map((appointment: Appointment) => (
                <div
                  key={appointment.id}
                  className={`calendar-appointment text-xs truncate ${
                    appointment.type === 'check-up'
                      ? 'bg-primary-500'
                      : appointment.type === 'cleaning'
                      ? 'bg-secondary-500'
                      : appointment.type === 'filling'
                      ? 'bg-accent-500'
                      : appointment.type === 'root-canal'
                      ? 'bg-error-500'
                      : 'bg-neutral-500'
                  }`}
                  title={`${appointment.patientName} - ${appointment.type}`}
                >
                  {appointment.startTime} {appointment.patientName}
                </div>
              ))}
            </div>
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div key={day.toString()} className="grid grid-cols-7">
          {days}
        </div>
      );
      days = [];
    }

    return (
      <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
        <div className="grid grid-cols-7">
          {dayNames.map((dayName) => (
            <div key={dayName} className="calendar-day-header">
              {dayName}
            </div>
          ))}
        </div>
        {rows}
      </div>
    );
  };

  // Week View
  const renderWeekView = () => {
    const startDate = startOfWeek(currentDate);
    const weekDays = Array.from({ length: 7 }, (_, i) => addDays(startDate, i));

    // Generate 30-min slots from 09:00 to 23:30
    const slots: string[] = [];
    for (let hour = 9; hour <= 23; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
      slots.push(`${hour.toString().padStart(2, '0')}:30`);
    }

    return (
      <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
        <div className="grid grid-cols-8 border-b border-neutral-200">
          <div className="p-2 text-sm font-medium text-neutral-500 border-r border-neutral-200">
            Time
          </div>
          {weekDays.map((day) => (
            <div
              key={day.toString()}
              className={`p-2 text-center ${
                isSameDay(day, new Date()) ? 'bg-primary-50' : ''
              }`}
            >
              <div className="text-sm font-medium">{format(day, 'EEE')}</div>
              <div className="text-lg font-bold">{format(day, 'd')}</div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-8">
          {/* Time slots */}
          <div className="border-r border-neutral-200">
            {slots.map((slot, idx) => (
              <div key={slot + idx} className="h-12 p-1 text-xs text-neutral-500 border-b border-neutral-200">
                {slot}
              </div>
            ))}
          </div>
          {/* Appointment slots for each day */}
          {weekDays.map((day) => {
            const dayAppointments = appointments.filter(
              a => a.date === format(day, 'yyyy-MM-dd')
            );
            return (
              <div key={day.toString()} className="min-w-[120px]">
                {slots.map((slot, idx) => {
                  // Find appointments that start at this slot
                  const slotAppointments = dayAppointments.filter(
                    a => a.startTime.slice(0, 5) === slot
                  );
                  return (
                    <div
                      key={`${day}-${slot}-${idx}`}
                      className={`h-12 p-1 border-b border-r border-neutral-200 ${
                        isSameDay(day, new Date()) ? 'bg-primary-50' : ''
                      }`}
                    >
                      {slotAppointments.map((appointment) => (
                        <div
                          key={appointment.id}
                          className={`w-full rounded p-1 overflow-hidden text-white text-xs ${
                            appointment.type === 'check-up'
                              ? 'bg-primary-500'
                              : appointment.type === 'cleaning'
                              ? 'bg-secondary-500'
                              : appointment.type === 'filling'
                              ? 'bg-accent-500'
                              : appointment.type === 'root-canal'
                              ? 'bg-error-500'
                              : 'bg-neutral-500'
                          }`}
                        >
                          <div className="font-medium">{appointment.patientName}</div>
                          <div>{appointment.type.replace('-', ' ')}</div>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Day View
  const renderDayView = () => {
    // Generate all 30-min slots from 06:00 to 22:00
    const slots: string[] = [];
    for (let hour = 8; hour <= 23; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
      if (hour !== 22) slots.push(`${hour.toString().padStart(2, '0')}:30`);
    }

    const dayAppointments = appointments.filter(
      a => a.date === format(currentDate, 'yyyy-MM-dd')
    );

    return (
      <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
        <div className="p-4 border-b border-neutral-200 bg-primary-50">
          <h3 className="text-lg font-bold">
            {format(currentDate, 'EEEE, MMMM d, yyyy')}
          </h3>
        </div>
        <div className="divide-y divide-neutral-200">
          {slots.map((slot) => {
            const appointment = dayAppointments.find(
              a => a.startTime.slice(0, 5) === slot
            );
            return (
              <div key={slot} className="flex p-3 hover:bg-neutral-50 transition-colors">
                <div className="w-20 flex-shrink-0 font-medium text-neutral-500">
                  {slot}
                </div>
                {appointment ? (
                  <div
                    className={`flex-1 ml-4 p-3 rounded ${
                      appointment.type === 'check-up'
                        ? 'bg-primary-100 text-primary-800'
                        : appointment.type === 'cleaning'
                        ? 'bg-secondary-100 text-secondary-800'
                        : appointment.type === 'filling'
                        ? 'bg-accent-100 text-accent-800'
                        : appointment.type === 'root-canal'
                        ? 'bg-error-100 text-error-800'
                        : 'bg-neutral-100 text-neutral-800'
                    }`}
                  >
                    <div className="font-medium">{appointment.patientName}</div>
                    <div className="text-sm">
                      {appointment.type.replace('-', ' ')} with {appointment.dentistName}
                    </div>
                    {appointment.notes && (
                      <div className="text-sm mt-1">{appointment.notes}</div>
                    )}
                  </div>
                ) : (
                  <div className="flex-1 ml-4 p-3 border border-dashed border-neutral-200 rounded text-neutral-400 text-center">
                    Available
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-lg text-neutral-500">Loading calendar...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-lg text-error-500">Error loading calendar: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="slide-in space-y-4 sm:space-y-6">
      {/* Calendar controls */}
      <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
        <div className="flex items-center space-x-2">
          <button
            onClick={handlePrevious}
            className="btn btn-outline p-2 rounded-full"
            aria-label="Previous"
          >
            <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
          <button
            onClick={handleToday}
            className="btn btn-outline px-3 py-2 text-sm rounded-full font-medium"
          >
            Today
          </button>
          <button
            onClick={handleNext}
            className="btn btn-outline p-2 rounded-full"
            aria-label="Next"
          >
            <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
          <h2 className="text-base sm:text-lg font-semibold text-neutral-900 ml-4">
            {viewType === 'month'
              ? format(currentDate, 'MMMM yyyy')
              : viewType === 'week'
              ? `Week of ${format(startOfWeek(currentDate), 'MMM d')} - ${format(
                  endOfWeek(currentDate),
                  'MMM d, yyyy'
                )}`
              : format(currentDate, 'EEEE, MMMM d, yyyy')}
          </h2>
        </div>
        <div className="flex items-center space-x-2">
          <div className="rounded-full border border-neutral-200 bg-white p-1 flex">
            <button
              onClick={() => setViewType('day')}
              className={`btn px-3 py-1 text-sm font-medium rounded-full transition shadow-none ${
                viewType === 'day'
                  ? 'btn-gradient text-white'
                  : 'btn-outline text-neutral-600'
              }`}
            >
              Day
            </button>
            <button
              onClick={() => setViewType('week')}
              className={`btn px-3 py-1 text-sm font-medium rounded-full transition shadow-none ${
                viewType === 'week'
                  ? 'btn-gradient text-white'
                  : 'btn-outline text-neutral-600'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setViewType('month')}
              className={`btn px-3 py-1 text-sm font-medium rounded-full transition shadow-none ${
                viewType === 'month'
                  ? 'btn-gradient text-white'
                  : 'btn-outline text-neutral-600'
              }`}
            >
              Month
            </button>
          </div>
        </div>
      </div>

      {/* Calendar view */}
      <div className="overflow-x-auto pb-6">
        {viewType === 'month' && renderMonthView()}
        {viewType === 'week' && renderWeekView()}
        {viewType === 'day' && renderDayView()}
      </div>

      {/* Appointment Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-3xl rounded-2xl bg-white/95 backdrop-blur-md p-8 shadow-2xl border border-white/20">
             <h2 className="mb-6 text-2xl font-bold gradient-text">Schedule An Appointment</h2>
            <AppointmentForm
              onSubmit={handleAddAppointment}
              onCancel={() => setShowForm(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarPage;