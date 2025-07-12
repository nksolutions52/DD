import { useState, useEffect } from 'react';
import { ArrowRight, Calendar, User, Users, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useAppointments, usePatients, useUsers } from '../hooks/useApi';
import { DashboardStats } from '../types';
import { usePageHeader } from '../hooks/usePageHeader';

const DashboardPage = () => {
  const { data: appointments = [], isLoading: isLoadingAppointments } = useAppointments();
  const { data: patients = [], isLoading: isLoadingPatients } = usePatients();
  const { data: users = [], isLoading: isLoadingUsers } = useUsers();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [showTreatmentByType, setShowTreatmentByType] = useState(true);
  
  const COLORS = ['#2563eb', '#7c3aed', '#fb3c2d', '#10b981', '#f59e42'];

  // Set page header
  usePageHeader({
    title: 'Dashboard',
    subtitle: 'Welcome back!'
  });

  useEffect(() => {
    if (!isLoadingAppointments && !isLoadingPatients && !isLoadingUsers) {
      const today = new Date().toISOString().split('T')[0];
      // Calculate stats from API data
      const todayAppointments = appointments.filter((a: any) => a.date === today).length;
      const upcomingAppointments = appointments
        .filter((a: any) => a.date >= today && (a.status === 'scheduled' || a.status === 'confirmed'))
        .sort((a: any, b: any) => {
          const dateA = new Date(`${a.date}T${a.startTime}`);
          const dateB = new Date(`${b.date}T${b.startTime}`);
          return dateA.getTime() - dateB.getTime();
        })
        .slice(0, 5);

      const recentPatients = [...patients]
        .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5);

      // Calculate appointment type stats
      const appointmentTypes = appointments.reduce((acc: { [key: string]: number }, curr: any) => {
        acc[curr.type] = (acc[curr.type] || 0) + 1;
        return acc;
      }, {});

      const appointmentsByType = Object.entries(appointmentTypes).map(([name, value]) => ({
        name,
        value: Number(value),
      }));

      // Calculate appointment status stats
      const appointmentStatuses = appointments.reduce((acc: { [key: string]: number }, curr: any) => {
        acc[curr.status] = (acc[curr.status] || 0) + 1;
        return acc;
      }, {});

      const appointmentsByStatus = Object.entries(appointmentStatuses).map(([name, value]) => ({
        name,
        value: Number(value),
      }));

      // Calculate treatment type stats
      const treatmentByType = appointments.reduce((acc: { [key: string]: number }, curr: any) => {
        if (curr.treatmentType) {
          acc[curr.treatmentType] = (acc[curr.treatmentType] || 0) + 1;
        }
        return acc;
      }, {});

      const treatmentsByTypeData = Object.entries(treatmentByType).map(([name, value]) => ({
        name,
        value: Number(value), // Ensure value is a number
      }));

      setStats({
        todayAppointments,
        totalAppointments: appointments.length,
        totalPatients: patients.length,
        totalUsers: users.length,
        upcomingAppointments,
        recentPatients,
        appointmentsByType,
        appointmentsByStatus,
        treatmentsByTypeData,
      });
    }
  }, [appointments, patients, users, isLoadingAppointments, isLoadingPatients, isLoadingUsers]);

  if (isLoadingAppointments || isLoadingPatients || isLoadingUsers) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="spinner"></div>
        <p className="ml-3 text-lg text-neutral-500">Loading dashboard data...</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-lg text-error-500">Error loading dashboard data</p>
      </div>
    );
  }

  return (
    <div className="slide-in space-y-4 sm:space-y-6">
      {/* Stats Overview */}
      <div className="grid-responsive">
        <div className="stats-card border-l-4 border-primary-500">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-500">Today's Appointments</p>
              <p className="mt-2 text-3xl font-bold text-neutral-900">{stats.todayAppointments}</p>
              <p className="mt-1 text-xs text-primary-600">
                <TrendingUp className="inline h-3 w-3 mr-1" />
                Active today
              </p>
            </div>
            <div className="rounded-xl bg-gradient-to-br from-primary-100 to-purple-100 p-3 text-primary-600">
              <Calendar className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-4">
            <Link to="/appointments" className="text-xs font-medium text-primary-600 hover:text-primary-700 transition-colors duration-200 flex items-center">
              View all appointments
              <ArrowRight className="ml-1 h-3 w-3" />
            </Link>
          </div>
        </div>

        <div className="stats-card border-l-4 border-secondary-500">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-500">Total Appointments</p>
              <p className="mt-2 text-3xl font-bold text-neutral-900">{stats.totalAppointments}</p>
              <p className="mt-1 text-xs text-secondary-600">
                <CheckCircle className="inline h-3 w-3 mr-1" />
                All time
              </p>
            </div>
            <div className="rounded-xl bg-gradient-to-br from-secondary-100 to-secondary-200 p-3 text-secondary-600">
              <Clock className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-4">
            <Link to="/calendar" className="text-xs font-medium text-secondary-600 hover:text-secondary-700 transition-colors duration-200 flex items-center">
              View calendar
              <ArrowRight className="ml-1 h-3 w-3" />
            </Link>
          </div>
        </div>

        <div className="stats-card border-l-4 border-accent-500">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-500">Total Patients</p>
              <p className="mt-2 text-3xl font-bold text-neutral-900">{stats.totalPatients}</p>
              <p className="mt-1 text-xs text-accent-600">
                <Users className="inline h-3 w-3 mr-1" />
                Registered
              </p>
            </div>
            <div className="rounded-xl bg-gradient-to-br from-accent-100 to-accent-200 p-3 text-accent-600">
              <Users className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-4">
            <Link to="/patients" className="text-xs font-medium text-accent-600 hover:text-accent-700 transition-colors duration-200 flex items-center">
              View all patients
              <ArrowRight className="ml-1 h-3 w-3" />
            </Link>
          </div>
        </div>

        <div className="stats-card border-l-4 border-blue-400">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-500">Total Users</p>
              <p className="mt-2 text-3xl font-bold text-neutral-900">{stats.totalUsers}</p>
              <p className="mt-1 text-xs text-blue-600">
                <Users className="inline h-3 w-3 mr-1" />
                System users
              </p>
            </div>
            <div className="rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 p-3 text-blue-600">
              <Users className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-4">
            <Link to="/users" className="text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors duration-200 flex items-center">
              View all users
              <ArrowRight className="ml-1 h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* Main content grid */}
      <div className="grid-responsive-2 gap-4 sm:gap-6">
        {/* Upcoming Appointments */}
        <div className="card">
          <div className="mb-4 sm:mb-6 flex items-center justify-between">
            <h2 className="text-responsive-lg font-semibold text-neutral-900">Upcoming Appointments</h2>
            <Link to="/appointments" className="text-xs font-medium text-primary-600 hover:text-primary-700 transition-colors duration-200 bg-primary-50 px-3 py-1 rounded-lg">
              View All
            </Link>
          </div>
          <div className="overflow-hidden rounded-xl border border-neutral-200/50">
            {stats.upcomingAppointments.length === 0 ? (
              <div className="flex items-center justify-center h-48 w-full">
                <span className="text-neutral-400 text-base font-medium">No appointments today</span>
              </div>
            ) : (
              <table className="w-full divide-y divide-neutral-200/50 table-auto">
                <thead className="bg-gradient-to-r from-neutral-50 to-neutral-100/50">
                  <tr>
                    <th scope="col" className="px-3 sm:px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">
                      Patient
                    </th>
                    <th scope="col" className="px-3 sm:px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">
                      Date & Time
                    </th>
                    <th scope="col" className="px-3 sm:px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">
                      Type
                    </th>
                    <th scope="col" className="px-3 sm:px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200/50 bg-white/50">
                  {stats.upcomingAppointments.map((appointment) => (
                    <tr key={appointment.id} className="hover:bg-primary-50/30 transition-colors duration-200">
                      <td className="whitespace-nowrap px-3 sm:px-4 py-3">
                        <div className="flex items-center">
                          <div className="h-6 w-6 sm:h-8 sm:w-8 flex-shrink-0 rounded-xl bg-gradient-to-br from-neutral-200 to-neutral-300 flex items-center justify-center">
                            <User className="h-3 w-3 sm:h-4 sm:w-4 text-neutral-500" />
                          </div>
                          <div className="ml-2 sm:ml-3">
                            <p className="text-xs sm:text-sm font-medium text-neutral-900">{appointment.patientName}</p>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 sm:px-4 py-3 text-xs sm:text-sm text-neutral-500">
                        {new Date(`${appointment.date}T${appointment.startTime}`).toLocaleString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: 'numeric',
                          minute: 'numeric',
                          hour12: true,
                        })}
                      </td>
                      <td className="whitespace-nowrap px-3 sm:px-4 py-3">
                        <span className="inline-flex rounded-full bg-gradient-to-r from-primary-100 to-purple-100 px-2 sm:px-3 py-1 text-xs font-semibold text-primary-800">
                          {appointment.type.replace('-', ' ')}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 sm:px-4 py-3">
                        <span
                          className={`inline-flex rounded-full px-2 sm:px-3 py-1 text-xs font-semibold ${
                            appointment.status === 'confirmed'
                              ? 'bg-gradient-to-r from-success-100 to-success-200 text-success-800'
                              : appointment.status === 'scheduled'
                              ? 'bg-gradient-to-r from-accent-100 to-accent-200 text-accent-800'
                              : appointment.status === 'completed'
                              ? 'bg-gradient-to-r from-secondary-100 to-secondary-200 text-secondary-800'
                              : 'bg-gradient-to-r from-neutral-100 to-neutral-200 text-neutral-800'
                          }`}
                        >
                          {appointment.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Recent Patients */}
        <div className="card">
          <div className="mb-4 sm:mb-6 flex items-center justify-between">
            <h2 className="text-responsive-lg font-semibold text-neutral-900">Recent Patients</h2>
            <Link to="/patients" className="text-xs font-medium text-primary-600 hover:text-primary-700 transition-colors duration-200 bg-primary-50 px-3 py-1 rounded-lg">
              View All
            </Link>
          </div>
          <div className="overflow-hidden rounded-xl border border-neutral-200/50">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-neutral-200/50">
                <thead className="bg-gradient-to-r from-neutral-50 to-neutral-100/50">
                  <tr>
                    <th scope="col" className="px-3 sm:px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">
                      Name
                    </th>
                    <th scope="col" className="px-3 sm:px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">
                      Contact
                    </th>
                    <th scope="col" className="px-3 sm:px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">
                      Last Visit
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200/50 bg-white/50">
                  {stats.recentPatients.map((patient) => (
                    <tr key={patient.id} className="hover:bg-primary-50/30 transition-colors duration-200">
                      <td className="whitespace-nowrap px-3 sm:px-4 py-3">
                        <div className="flex items-center">
                          <div className="h-6 w-6 sm:h-8 sm:w-8 flex-shrink-0 rounded-xl bg-gradient-to-br from-neutral-200 to-neutral-300 flex items-center justify-center">
                            <User className="h-3 w-3 sm:h-4 sm:w-4 text-neutral-500" />
                          </div>
                          <div className="ml-2 sm:ml-3">
                            <p className="text-xs sm:text-sm font-medium text-neutral-900">
                              {patient.firstName} {patient.lastName}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 sm:px-4 py-3 text-xs sm:text-sm text-neutral-500">
                        {patient.phone}
                      </td>
                      <td className="whitespace-nowrap px-3 sm:px-4 py-3 text-xs sm:text-sm text-neutral-500">
                        {patient.lastVisit
                          ? new Date(patient.lastVisit).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })
                          : 'Never'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid-responsive-2 gap-4 sm:gap-6">
        {/* Appointments by Type */}
        <div className="card">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-responsive-lg font-semibold text-neutral-900">
              {showTreatmentByType ? 'Treatments by Type' : 'Appointments by Type'}
            </h2>
            <button
             className="text-xs font-medium text-primary-600 hover:text-primary-700 transition-colors duration-200 bg-primary-50 px-3 py-1 rounded-lg"
              onClick={() => setShowTreatmentByType((prev) => !prev)}
            >
              {showTreatmentByType ? 'Show Appointments by Type' : 'Show Treatments by Type'}
            </button>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={showTreatmentByType ? stats.treatmentsByTypeData : stats.appointmentsByType}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {(showTreatmentByType ? stats.treatmentsByTypeData : stats.appointmentsByType).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Appointments by Status */}
        <div className="card">
          <h2 className="mb-4 sm:mb-6 text-responsive-lg font-semibold text-neutral-900">Appointments by Status</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={stats.appointmentsByStatus}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid rgba(229, 231, 235, 0.5)',
                    borderRadius: '12px',
                    backdropFilter: 'blur(8px)'
                  }}
                />
                <Bar 
                  dataKey="value" 
                  fill="url(#colorGradient)" 
                  radius={[4, 4, 0, 0]}
                />
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#7c3aed" stopOpacity={0.8}/>
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;