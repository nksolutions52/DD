import { User, Patient, Appointment, DashboardStats, Report } from '../types';
import { addDays, subDays, format, addHours, addMinutes } from 'date-fns';

// Mock Users
export const mockUsers: User[] = [
  {
    id: 1,
    name: 'Dr. John Smith',
    email: 'admin@example.com',
    role: 'admin',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
  },
  {
    id: 2,
    name: 'Dr. Sarah Johnson',
    email: 'dentist@example.com',
    role: 'dentist',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
  },
  {
    id: 3,
    name: 'Emma Davis',
    email: 'receptionist@example.com',
    role: 'receptionist',
    avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
  },
];

// Mock Patients
export const mockPatients: Patient[] = [
  {
    id: 1,
    firstName: 'Michael',
    lastName: 'Brown',
    email: 'michael.brown@example.com',
    phone: '(555) 123-4567',
    dateOfBirth: '1985-06-15',
    gender: 'male',
    address: '123 Main St, Anytown, CA 12345',
    medicalHistory: 'No significant medical history',
    insuranceInfo: 'DentalCare Plus #12345678',
    createdAt: '2023-01-15T10:30:00Z',
    lastVisit: '2023-06-22T14:00:00Z',
  },
  {
    id: 2,
    firstName: 'Jessica',
    lastName: 'Miller',
    email: 'jessica.miller@example.com',
    phone: '(555) 987-6543',
    dateOfBirth: '1990-03-22',
    gender: 'female',
    address: '456 Oak Ave, Somewhere, NY 67890',
    medicalHistory: 'Allergic to penicillin',
    insuranceInfo: 'HealthFirst Dental #87654321',
    createdAt: '2023-02-10T09:15:00Z',
    lastVisit: '2023-07-05T11:30:00Z',
  },
  {
    id: 3,
    firstName: 'David',
    lastName: 'Wilson',
    email: 'david.wilson@example.com',
    phone: '(555) 456-7890',
    dateOfBirth: '1978-11-30',
    gender: 'male',
    address: '789 Pine St, Elsewhere, TX 54321',
    medicalHistory: 'Hypertension, takes lisinopril',
    insuranceInfo: 'DentalPlus #23456789',
    createdAt: '2023-03-05T13:45:00Z',
    lastVisit: '2023-05-18T16:15:00Z',
  },
  {
    id: 4,
    firstName: 'Emily',
    lastName: 'Taylor',
    email: 'emily.taylor@example.com',
    phone: '(555) 789-0123',
    dateOfBirth: '1995-09-08',
    gender: 'female',
    address: '101 Maple Dr, Nowhere, FL 98765',
    medicalHistory: 'No significant medical history',
    insuranceInfo: 'CareFirst Dental #34567890',
    createdAt: '2023-04-20T10:00:00Z',
    lastVisit: '2023-08-02T13:45:00Z',
  },
  {
    id: 5,
    firstName: 'Robert',
    lastName: 'Anderson',
    email: 'robert.anderson@example.com',
    phone: '(555) 234-5678',
    dateOfBirth: '1982-07-17',
    gender: 'male',
    address: '202 Cedar Ln, Anyplace, WA 13579',
    medicalHistory: 'Asthma, uses albuterol inhaler',
    insuranceInfo: 'DentalCare Plus #45678901',
    createdAt: '2023-05-12T14:30:00Z',
    lastVisit: '2023-08-12T10:30:00Z',
  },
];

// Generate today's date and format it
const today = new Date();
const formattedToday = format(today, 'yyyy-MM-dd');
const tomorrow = addDays(today, 1);
const formattedTomorrow = format(tomorrow, 'yyyy-MM-dd');
const yesterday = subDays(today, 1);
const formattedYesterday = format(yesterday, 'yyyy-MM-dd');

// Mock Appointments
export const mockAppointments: Appointment[] = [
  {
    id: 1,
    patientId: 1,
    patientName: 'Michael Brown',
    dentistId: 2,
    dentistName: 'Dr. Sarah Johnson',
    date: formattedToday,
    startTime: '09:00',
    endTime: '09:30',
    status: 'confirmed',
    type: 'check-up',
    notes: 'Regular check-up appointment',
    createdAt: '2023-08-01T10:00:00Z',
  },
  {
    id: 2,
    patientId: 2,
    patientName: 'Jessica Miller',
    dentistId: 2,
    dentistName: 'Dr. Sarah Johnson',
    date: formattedToday,
    startTime: '10:00',
    endTime: '11:00',
    status: 'scheduled',
    type: 'filling',
    notes: 'Filling for lower right molar',
    createdAt: '2023-08-03T15:30:00Z',
  },
  {
    id: 3,
    patientId: 3,
    patientName: 'David Wilson',
    dentistId: 1,
    dentistName: 'Dr. John Smith',
    date: formattedToday,
    startTime: '14:00',
    endTime: '15:00',
    status: 'confirmed',
    type: 'root-canal',
    notes: 'Root canal treatment for upper left incisor',
    createdAt: '2023-08-05T09:15:00Z',
  },
  {
    id: 4,
    patientId: 4,
    patientName: 'Emily Taylor',
    dentistId: 2,
    dentistName: 'Dr. Sarah Johnson',
    date: formattedTomorrow,
    startTime: '11:30',
    endTime: '12:00',
    status: 'scheduled',
    type: 'cleaning',
    notes: 'Regular dental cleaning',
    createdAt: '2023-08-07T13:45:00Z',
  },
  {
    id: 5,
    patientId: 5,
    patientName: 'Robert Anderson',
    dentistId: 1,
    dentistName: 'Dr. John Smith',
    date: formattedTomorrow,
    startTime: '15:30',
    endTime: '16:30',
    status: 'scheduled',
    type: 'extraction',
    notes: 'Extraction of wisdom tooth',
    createdAt: '2023-08-10T11:00:00Z',
  },
  {
    id: 6,
    patientId: 1,
    patientName: 'Michael Brown',
    dentistId: 1,
    dentistName: 'Dr. John Smith',
    date: formattedYesterday,
    startTime: '13:00',
    endTime: '13:30',
    status: 'completed',
    type: 'consultation',
    notes: 'Consultation for dental implants',
    createdAt: '2023-07-25T16:20:00Z',
  },
  {
    id: 7,
    patientId: 2,
    patientName: 'Jessica Miller',
    dentistId: 2,
    dentistName: 'Dr. Sarah Johnson',
    date: formattedYesterday,
    startTime: '09:30',
    endTime: '10:00',
    status: 'completed',
    type: 'check-up',
    notes: 'Regular check-up appointment',
    createdAt: '2023-07-28T14:10:00Z',
  },
];

// Mock Dashboard Stats
export const mockDashboardStats: DashboardStats = {
  todayAppointments: mockAppointments.filter(a => a.date === formattedToday).length,
  totalAppointments: mockAppointments.length,
  totalPatients: mockPatients.length,
  upcomingAppointments: mockAppointments
    .filter(a => a.date >= formattedToday && (a.status === 'scheduled' || a.status === 'confirmed'))
    .sort((a, b) => {
      // Sort by date and time
      const dateA = new Date(`${a.date}T${a.startTime}`);
      const dateB = new Date(`${b.date}T${b.startTime}`);
      return dateA.getTime() - dateB.getTime();
    })
    .slice(0, 5),
  recentPatients: [...mockPatients].sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  }).slice(0, 5),
  appointmentsByType: [
    { name: 'Check-up', value: 2 },
    { name: 'Cleaning', value: 1 },
    { name: 'Filling', value: 1 },
    { name: 'Extraction', value: 1 },
    { name: 'Root Canal', value: 1 },
    { name: 'Consultation', value: 1 },
  ],
  appointmentsByStatus: [
    { name: 'Scheduled', value: 3 },
    { name: 'Confirmed', value: 2 },
    { name: 'Completed', value: 2 },
    { name: 'Cancelled', value: 0 },
    { name: 'No-show', value: 0 },
  ],
};

// Mock Reports
export const mockReports: Report[] = [
  {
    id: 1,
    title: 'Monthly Patient Activity',
    type: 'patient',
    period: 'monthly',
    createdAt: '2023-08-01T10:00:00Z',
    data: {
      newPatients: 12,
      returningPatients: 45,
      totalVisits: 57,
      cancellationRate: 0.05,
      chart: [
        { month: 'Jan', newPatients: 8, returningPatients: 32 },
        { month: 'Feb', newPatients: 10, returningPatients: 38 },
        { month: 'Mar', newPatients: 12, returningPatients: 42 },
        { month: 'Apr', newPatients: 9, returningPatients: 40 },
        { month: 'May', newPatients: 11, returningPatients: 43 },
        { month: 'Jun', newPatients: 13, returningPatients: 47 },
        { month: 'Jul', newPatients: 12, returningPatients: 45 },
      ],
    },
  },
  {
    id: 2,
    title: 'Appointment Statistics',
    type: 'appointment',
    period: 'weekly',
    createdAt: '2023-08-05T14:30:00Z',
    data: {
      totalAppointments: 47,
      completedAppointments: 42,
      cancelledAppointments: 3,
      noShowAppointments: 2,
      completionRate: 0.89,
      chart: [
        { day: 'Mon', appointments: 10, completed: 9 },
        { day: 'Tue', appointments: 8, completed: 7 },
        { day: 'Wed', appointments: 12, completed: 11 },
        { day: 'Thu', appointments: 7, completed: 6 },
        { day: 'Fri', appointments: 10, completed: 9 },
      ],
    },
  },
  {
    id: 3,
    title: 'Revenue Report',
    type: 'financial',
    period: 'yearly',
    createdAt: '2023-07-15T09:45:00Z',
    data: {
      totalRevenue: 125000,
      averagePerPatient: 219.30,
      topProcedures: [
        { name: 'Cleaning', revenue: 28500 },
        { name: 'Filling', revenue: 35000 },
        { name: 'Root Canal', revenue: 42000 },
        { name: 'Extraction', revenue: 19500 },
      ],
      chart: [
        { month: 'Jan', revenue: 9200 },
        { month: 'Feb', revenue: 9800 },
        { month: 'Mar', revenue: 10500 },
        { month: 'Apr', revenue: 11200 },
        { month: 'May', revenue: 12000 },
        { month: 'Jun', revenue: 11800 },
        { month: 'Jul', revenue: 10500 },
      ],
    },
  },
];

// Generate month calendar data
export const generateCalendarData = (year: number, month: number) => {
  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0);
  const daysInMonth = lastDay.getDate();
  
  const calendarData = [];
  
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month - 1, day);
    const formattedDate = format(date, 'yyyy-MM-dd');
    
    // Find appointments for this day
    const dayAppointments = mockAppointments.filter(
      appointment => appointment.date === formattedDate
    );
    
    calendarData.push({
      date: formattedDate,
      day,
      appointments: dayAppointments,
    });
  }
  
  return calendarData;
};

// Generate today's schedule
export const generateDaySchedule = (dateString: string) => {
  const timeSlots = [];
  const startHour = 9; // 9 AM
  const endHour = 17; // 5 PM
  
  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      
      // Find appointment that starts at this time
      const appointment = mockAppointments.find(
        app => app.date === dateString && app.startTime === time
      );
      
      timeSlots.push({
        time,
        appointment: appointment || null,
      });
    }
  }
  
  return timeSlots;
};

// Generate weekly schedule
export const generateWeekSchedule = (startDateString: string) => {
  const startDate = new Date(startDateString);
  const weekSchedule = [];
  
  for (let i = 0; i < 7; i++) {
    const currentDate = addDays(startDate, i);
    const formattedDate = format(currentDate, 'yyyy-MM-dd');
    
    weekSchedule.push({
      date: formattedDate,
      dayName: format(currentDate, 'EEE'),
      dayNumber: format(currentDate, 'd'),
      schedule: generateDaySchedule(formattedDate),
    });
  }
  
  return weekSchedule;
};