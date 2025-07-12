import { useState, useEffect } from 'react';
import { Download, FileText, RefreshCw } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ReportFilter, ReportPeriod } from '../types';
import { usePageHeader } from '../hooks/usePageHeader';
import api from '../services/api';

const ReportsPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  const [filter, setFilter] = useState<ReportFilter>({
    period: 'monthly',
    startDate: firstDayOfMonth.toISOString().split('T')[0],
    endDate: lastDayOfMonth.toISOString().split('T')[0]
  });
  
  const [patientStats, setPatientStats] = useState<any>(null);
  const [appointmentStats, setAppointmentStats] = useState<any>(null);
  const [financialStats, setFinancialStats] = useState<any>(null);
  const [pharmacyStats, setPharmacyStats] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [showTreatmentByType, setShowTreatmentByType] = useState(true);

  const COLORS = ['#0891b2', '#0d9488', '#ffc107', '#f44336', '#9e9e9e'];

  // Move handleRefresh and handlePeriodChange above usePageHeader
  const handleRefresh = async () => {
    setIsLoading(true);
    setError(null); // Reset error before fetching
    try {
      const [patients, appointments, financial, pharmacy] = await Promise.all([
        api.reports.getPatientStatistics(filter),
        api.reports.getAppointmentStatistics(filter),
        api.reports.getFinancialStatistics(filter),
        api.reports.getPharmacyStatistics(filter)
      ]);

      setPatientStats(patients);
      setAppointmentStats(appointments);
      setFinancialStats(financial);
      setPharmacyStats(pharmacy);
    } catch (err) {
      setError('Failed to load reports. Please try again later.');
      console.error('Failed to fetch reports:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePeriodChange = (period: ReportPeriod) => {
    const today = new Date();
    let startDate = new Date();
    let endDate = new Date();

    switch (period) {
      case 'monthly':
        startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        break;
      case 'quarterly':
        startDate = new Date(today.getFullYear(), today.getMonth() - 2, 1);
        endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        break;
      case 'yearly':
        startDate = new Date(today.getFullYear(), 0, 1);
        endDate = new Date(today.getFullYear(), 11, 31);
        break;
    }

    const newFilter = {
      period,
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0]
    };

    setFilter(newFilter);
    handleRefresh();
  };

  // Set page header with actions
  usePageHeader({
    title: 'Reports',
    subtitle: 'Comprehensive analytics and insights for your dental clinic',
    actions: (
      <div className="flex space-x-2 sm:space-x-3">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handlePeriodChange('monthly')}
            className={`btn btn-link px-0 ${
              filter.period === 'monthly' ? 'font-semibold underline btn-primary' : 'text-neutral-500 text-primary-600'
            }`}
          >
            Monthly
          </button>
          <span className="text-neutral-300">|</span>
          <button
            onClick={() => handlePeriodChange('quarterly')}
            className={`btn btn-link px-0 ${
              filter.period === 'quarterly' ? 'font-semibold underline btn-primary' : 'text-neutral-500 text-primary-600'
            }`}
          >
            Quarterly
          </button>
          <span className="text-neutral-300">|</span>
          <button
            onClick={() => handlePeriodChange('yearly')}
            className={`btn btn-link px-0 ${
              filter.period === 'yearly' ? 'font-semibold underline btn-primary' : 'text-neutral-500 text-primary-600'
            }`}
          >
            Yearly
          </button>
        </div>
        <button
          onClick={handleRefresh}
          className="btn btn-outline flex items-center"
          disabled={isLoading}
        >
          <RefreshCw className={`mr-1 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">Refresh</span>
        </button>
        <button className="btn btn-primary flex items-center">
          <Download className="mr-1 h-4 w-4" />
          <span className="hidden sm:inline">Export Reports</span>
          <span className="sm:hidden">Export</span>
        </button>
      </div>
    ),
  });

  // Fetch data on component mount
  useEffect(() => {
    handleRefresh();
  }, []);

  if (isLoading && !patientStats) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-lg text-neutral-500">Loading reports...</p>
      </div>
    );
  }

  if (error) {
    return <div className="text-error-600 text-center py-8">{error}</div>;
  }

  return (
    <div className="slide-in space-y-4 sm:space-y-6">
      <div className="grid gap-4 sm:gap-6">
        {/* Patient Statistics */}
        <div className="card">
          <h2 className="mb-4 sm:mb-6 text-lg sm:text-xl font-bold text-neutral-900">Patient Statistics</h2>
          {patientStats && (
            <div>
              <div className="mb-4 sm:mb-6 grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="stats-card">
                  <h3 className="text-sm sm:text-lg font-semibold text-neutral-900">Total Patients</h3>
                  <p className="mt-2 text-2xl sm:text-3xl font-bold text-primary-600">{patientStats?.totalPatients ?? 0}</p>
                </div>
                <div className="stats-card">
                  <h3 className="text-sm sm:text-lg font-semibold text-neutral-900">New Patients</h3>
                  <p className="mt-2 text-2xl sm:text-3xl font-bold text-secondary-600">{patientStats.newPatients}</p>
                </div>
                <div className="stats-card">
                  <h3 className="text-sm sm:text-lg font-semibold text-neutral-900">Returning Patients</h3>
                  <p className="mt-2 text-2xl sm:text-3xl font-bold text-accent-600">{patientStats.returningPatients}</p>
                </div>
                <div className="stats-card">
                  <h3 className="text-sm sm:text-lg font-semibold text-neutral-900">Average Age</h3>
                  <p className="mt-2 text-2xl sm:text-3xl font-bold text-neutral-900">
                    {Math.round(patientStats.averageAge)}
                  </p>
                </div>
              </div>

              <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
                <div>
                  <h3 className="mb-4 text-base sm:text-lg font-semibold text-neutral-900">Gender Distribution</h3>
                  <div className="h-48 sm:h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      {(patientStats?.genderDistribution && Object.values(patientStats.genderDistribution).some(v => v > 0)) ? (
                        <PieChart>
                          <Pie
                            data={Object.entries(patientStats.genderDistribution).map(([key, value]) => ({
                              name: key.charAt(0).toUpperCase() + key.slice(1),
                              value
                            }))}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          >
                            {Object.entries(patientStats.genderDistribution).map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      ) : (
                        <div className="flex items-center justify-center h-full text-neutral-400">
                          No data available
                        </div>
                      )}
                    </ResponsiveContainer>
                  </div>
                </div>

                <div>
                  <h3 className="mb-4 text-base sm:text-lg font-semibold text-neutral-900">Patient Trends</h3>
                  <div className="h-48 sm:h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={Array.isArray(patientStats?.monthlyTrends) ? patientStats.monthlyTrends : []}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        {/* <Legend /> */}
                        <Line
                          type="monotone"
                          dataKey="newPatients"
                          name="New Patients"
                          stroke="#0891b2"
                        />
                        <Line
                          type="monotone"
                          dataKey="returningPatients"
                          name="Returning Patients"
                          stroke="#0d9488"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Appointment Statistics */}
        <div className="card">
          <h2 className="mb-4 sm:mb-6 text-lg sm:text-xl font-bold text-neutral-900">Appointment Summary</h2>
          {appointmentStats && (
            <>
              <div className="mb-4 sm:mb-6 grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="stats-card">
                  <h3 className="text-sm sm:text-lg font-semibold text-neutral-900">Total Appointments</h3>
                  <p className="mt-2 text-2xl sm:text-3xl font-bold text-primary-600">
                    {appointmentStats.totalAppointments}
                  </p>
                </div>
                <div className="stats-card">
                  <h3 className="text-sm sm:text-lg font-semibold text-neutral-900">Completed</h3>
                  <p className="mt-2 text-2xl sm:text-3xl font-bold text-success-600">
                    {appointmentStats.completedAppointments}
                  </p>
                </div>
                <div className="stats-card">
                  <h3 className="text-sm sm:text-lg font-semibold text-neutral-900">Cancelled</h3>
                  <p className="mt-2 text-2xl sm:text-3xl font-bold text-error-600">
                    {appointmentStats.cancelledAppointments}
                  </p>
                </div>
                <div className="stats-card">
                  <h3 className="text-sm sm:text-lg font-semibold text-neutral-900">No Show</h3>
                  <p className="mt-2 text-2xl sm:text-3xl font-bold text-warning-600">
                    {appointmentStats.noShowAppointments}
                  </p>
                </div>
              </div>

              <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
                <div>
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-base sm:text-lg font-semibold text-neutral-900">
                    {showTreatmentByType ? 'Treatments by Type' : 'Appointments by Type'}
                  </h3>
                  <button
                    className="text-xs font-medium text-primary-600 hover:text-primary-700 transition-colors duration-200 bg-primary-50 px-3 py-1 rounded-lg"
                    onClick={() => setShowTreatmentByType((prev) => !prev)}
                  >
                    {showTreatmentByType ? 'Show Appointments by Type' : 'Show Treatments by Type'}
                  </button>
                </div>
                <div className="h-48 sm:h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={
                          showTreatmentByType
                            ? Object.entries(appointmentStats.treatmentTypeDistribution || {}).map(([key, value]) => ({
                                name: key.replace('-', ' '),
                                value,
                              }))
                            : Object.entries(appointmentStats.typeDistribution || {}).map(([key, value]) => ({
                                name: key.replace('-', ' '),
                                value,
                              }))
                        }
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {(showTreatmentByType
                          ? Object.entries(appointmentStats.treatmentTypeDistribution || {})
                          : Object.entries(appointmentStats.typeDistribution || {})
                        ).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      {/* <Legend /> */}
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

                <div>
                  <h3 className="mb-4 text-base sm:text-lg font-semibold text-neutral-900">Monthly Trends</h3>
                  <div className="h-48 sm:h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={appointmentStats.monthlyTrends}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="total"
                          name="Total"
                          stroke="#0891b2"
                        />
                        <Line
                          type="monotone"
                          dataKey="completed"
                          name="Completed"
                          stroke="#0d9488"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              
            </>
          )}
        </div>

        {/* Financial Overview */}
        <div className="card">
          <h2 className="mb-4 sm:mb-6 text-lg sm:text-xl font-bold text-neutral-900">Financial Overview</h2>
          {financialStats && (
            <>
              <div className="mb-4 sm:mb-6 grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-5">
                <div className="stats-card">
                  <h3 className="text-sm sm:text-lg font-semibold text-neutral-900">Total Revenue</h3>
                  <p className="mt-2 text-xl sm:text-3xl font-bold text-primary-600">
                    ₹{financialStats.totalRevenue.toFixed(2)}
                  </p>
                </div>
                <div className="stats-card">
                  <h3 className="text-sm sm:text-lg font-semibold text-neutral-900">Appointment Revenue</h3>
                  <p className="mt-2 text-xl sm:text-3xl font-bold text-secondary-600">
                    ₹{financialStats.appointmentRevenue.toFixed(2)}
                  </p>
                </div>
                <div className="stats-card">
                  <h3 className="text-sm sm:text-lg font-semibold text-neutral-900">Pharmacy Revenue</h3>
                  <p className="mt-2 text-xl sm:text-3xl font-bold text-accent-600">
                    ₹{financialStats.pharmacyRevenue.toFixed(2)}
                  </p>
                </div>
                <div className="stats-card">
                  <h3 className="text-sm sm:text-lg font-semibold text-neutral-900">Online Payments</h3>
                  <p className="mt-2 text-xl sm:text-3xl font-bold text-primary-600">
                    ₹{financialStats.onlineAmount?.toFixed(2) ?? '0.00'}
                  </p>
                </div>
                <div className="stats-card">
                  <h3 className="text-sm sm:text-lg font-semibold text-neutral-900">Cash Payments</h3>
                  <p className="mt-2 text-xl sm:text-3xl font-bold text-secondary-600">
                    ₹{financialStats.cashAmount?.toFixed(2) ?? '0.00'}
                  </p>
                </div>
              </div>

              <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
                <div>
                  <h3 className="mb-4 text-base sm:text-lg font-semibold text-neutral-900">Revenue Trends</h3>
                  <div className="h-48 sm:h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={financialStats.monthlyTrends}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="totalRevenue"
                          name="Total Revenue"
                          stroke="#0891b2"
                        />
                        <Line
                          type="monotone"
                          dataKey="appointmentRevenue"
                          name="Appointment Revenue"
                          stroke="#0d9488"
                        />
                        <Line
                          type="monotone"
                          dataKey="pharmacyRevenue"
                          name="Pharmacy Revenue"
                          stroke="#ffc107"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div>
                  <h3 className="mb-4 text-base sm:text-lg font-semibold text-neutral-900">Top Procedures</h3>
                  <div className="h-48 sm:h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={financialStats?.topProcedures ?? []}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="type" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="revenue" name="Revenue" fill="#0891b2" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Pharmacy Report */}
        <div className="card">
          <h2 className="mb-4 sm:mb-6 text-lg sm:text-xl font-bold text-neutral-900">Pharmacy Report</h2>
          {pharmacyStats && (
            <>
              <div className="mb-4 sm:mb-6 grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="stats-card">
                  <h3 className="text-sm sm:text-lg font-semibold text-neutral-900">Total Sales</h3>
                  <p className="mt-2 text-2xl sm:text-3xl font-bold text-primary-600">
                    {pharmacyStats.totalSales}
                  </p>
                </div>
                <div className="stats-card">
                
                  <h3 className="text-sm sm:text-lg font-semibold text-neutral-900">Total Revenue</h3>
                  <p className="mt-2 text-2xl sm:text-3xl font-bold text-secondary-600">
                    ₹{Number(pharmacyStats.totalRevenue).toFixed(2)}
                  </p>
                </div>
                <div className="stats-card">
                  <h3 className="text-sm sm:text-lg font-semibold text-neutral-900">Avg. Revenue per Sale</h3>
                  <p className="mt-2 text-2xl sm:text-3xl font-bold text-accent-600">
                    ₹{Number(pharmacyStats.averageSaleValue ?? pharmacyStats.averageRevenuePerSale ?? 0).toFixed(2)}
                  </p>
                </div>
                <div className="stats-card">
                  <h3 className="text-sm sm:text-lg font-semibold text-neutral-900">Top Selling Medicine</h3>
                  <p className="mt-2 text-xl sm:text-2xl font-bold text-neutral-900">
                    {pharmacyStats.topSellingMedicines && pharmacyStats.topSellingMedicines.length > 0
                      ? pharmacyStats.topSellingMedicines[0].medicineName
                      : 'N/A'}
                  </p>
                </div>
              </div>

              <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
                <div>
                  <h3 className="mb-4 text-base sm:text-lg font-semibold text-neutral-900">Sales Trends</h3>
                  <div className="h-48 sm:h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={pharmacyStats.monthlyTrends}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis
                          yAxisId="left"
                          allowDecimals={false}
                          domain={[0, 'auto']}
                          tickCount={6}
                          label={{ value: 'Sales', angle: -90, position: 'insideLeft' }}
                        />
                        <YAxis
                          yAxisId="right"
                          orientation="right"
                          domain={[0, 'auto']}
                          tickFormatter={v => `₹${v}`}
                          tickCount={6}
                          label={{ value: 'Revenue', angle: 90, position: 'insideRight' }}
                        />
                        <Tooltip />
                        <Legend />
                        <Line
                          yAxisId="left"
                          type="monotone"
                          dataKey="sales"
                          name="Total Sales"
                          stroke="#0891b2"
                          strokeWidth={2}
                        />
                        <Line
                          yAxisId="right"
                          type="monotone"
                          dataKey="revenue"
                          name="Total Revenue"
                          stroke="#0d9488"
                          strokeWidth={2}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div>
                  <h3 className="mb-4 text-base sm:text-lg font-semibold text-neutral-900">Top Medicines</h3>
                  <div className="h-48 sm:h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={pharmacyStats.topSellingMedicines ?? []}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="medicineName" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="quantity" name="Total Sales" fill="#0891b2" />
                        <Bar dataKey="revenue" name="Total Revenue" fill="#0d9488" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {pharmacyStats.stockAlerts.length > 0 && (
                <div className="mt-4 sm:mt-6">
                  <h3 className="mb-4 text-base sm:text-lg font-semibold text-neutral-900">Stock Alerts</h3>
                  <div className="overflow-hidden rounded-lg border border-neutral-200">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-neutral-200">
                        <thead className="bg-neutral-50">
                          <tr>
                            <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">
                              Medicine
                            </th>
                            <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">
                              Current Stock
                            </th>
                            <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">
                              Reorder Point
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-200 bg-white">
                          {pharmacyStats.stockAlerts.map((alert: any) => (
                            <tr key={alert.medicineId}>
                              <td className="whitespace-nowrap px-4 sm:px-6 py-4 text-sm text-neutral-900">
                                {alert.medicineName}
                              </td>
                              <td className="whitespace-nowrap px-4 sm:px-6 py-4 text-sm text-error-600">
                                {alert.currentStock}
                              </td>
                              <td className="whitespace-nowrap px-4 sm:px-6 py-4 text-sm text-neutral-500">
                                {alert.reorderPoint}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {pharmacyStats.expiryAlerts && pharmacyStats.expiryAlerts.length > 0 && (
                <div className="mt-4 sm:mt-6">
                  <h3 className="mb-4 text-base sm:text-lg font-semibold text-neutral-900">Expiry Alerts</h3>
                  <div className="overflow-hidden rounded-lg border border-neutral-200">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-neutral-200">
                        <thead className="bg-neutral-50">
                          <tr>
                            <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">
                              Medicine
                            </th>
                            <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">
                              Expiry Date
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-200 bg-white">
                          {pharmacyStats.expiryAlerts.map((alert: any) => (
                            <tr key={alert.medicineId}>
                              <td className="whitespace-nowrap px-4 sm:px-6 py-4 text-sm text-neutral-900">
                                {alert.medicineName}
                              </td>
                              <td className="whitespace-nowrap px-4 sm:px-6 py-4 text-sm text-error-600">
                                {alert.expiryDate}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;