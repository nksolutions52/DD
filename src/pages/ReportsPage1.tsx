import { useState } from 'react';
import { Download, FileText, RefreshCw } from 'lucide-react';
import { mockReports } from '../data/mockData';
import { Report } from '../types';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ReportsPage1 = () => {
  const [reports, setReports] = useState<Report[]>(mockReports);
  const [activeReport, setActiveReport] = useState<Report | null>(reports[0] || null);
  const [isLoading, setIsLoading] = useState(false);

  const handleRefresh = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const renderChart = (report: Report) => {
    const COLORS = ['#0891b2', '#0d9488', '#ffc107', '#f44336', '#9e9e9e'];

    switch (report.type) {
      case 'patient':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart
              data={report.data.chart}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="newPatients" stroke="#0891b2" name="New Patients" />
              <Line type="monotone" dataKey="returningPatients" stroke="#0d9488" name="Returning Patients" />
            </LineChart>
          </ResponsiveContainer>
        );
      case 'appointment':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={report.data.chart}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="appointments" fill="#0891b2" name="Total Appointments" />
              <Bar dataKey="completed" fill="#0d9488" name="Completed" />
            </BarChart>
          </ResponsiveContainer>
        );
      case 'financial':
        return (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={report.data.chart}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="#0891b2" name="Revenue" />
              </LineChart>
            </ResponsiveContainer>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={report.data.topProcedures}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="revenue"
                  nameKey="name"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {report.data.topProcedures.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        );
      default:
        return null;
    }
  };

  const renderReportData = (report: Report) => {
    switch (report.type) {
      case 'patient':
        return (
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="stats-card">
              <h3 className="text-lg font-semibold text-neutral-900">New Patients</h3>
              <p className="mt-2 text-3xl font-bold text-primary-600">{report.data.newPatients}</p>
            </div>
            <div className="stats-card">
              <h3 className="text-lg font-semibold text-neutral-900">Returning Patients</h3>
              <p className="mt-2 text-3xl font-bold text-secondary-600">{report.data.returningPatients}</p>
            </div>
            <div className="stats-card">
              <h3 className="text-lg font-semibold text-neutral-900">Total Visits</h3>
              <p className="mt-2 text-3xl font-bold text-accent-600">{report.data.totalVisits}</p>
            </div>
            <div className="stats-card">
              <h3 className="text-lg font-semibold text-neutral-900">Cancellation Rate</h3>
              <p className="mt-2 text-3xl font-bold text-neutral-900">
                {(report.data.cancellationRate * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        );
      case 'appointment':
        return (
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="stats-card">
              <h3 className="text-lg font-semibold text-neutral-900">Total Appointments</h3>
              <p className="mt-2 text-3xl font-bold text-primary-600">{report.data.totalAppointments}</p>
            </div>
            <div className="stats-card">
              <h3 className="text-lg font-semibold text-neutral-900">Completed</h3>
              <p className="mt-2 text-3xl font-bold text-success-600">{report.data.completedAppointments}</p>
            </div>
            <div className="stats-card">
              <h3 className="text-lg font-semibold text-neutral-900">Cancelled</h3>
              <p className="mt-2 text-3xl font-bold text-error-600">{report.data.cancelledAppointments}</p>
            </div>
            <div className="stats-card">
              <h3 className="text-lg font-semibold text-neutral-900">Completion Rate</h3>
              <p className="mt-2 text-3xl font-bold text-neutral-900">
                {(report.data.completionRate * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        );
      case 'financial':
        return (
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="stats-card">
              <h3 className="text-lg font-semibold text-neutral-900">Total Revenue</h3>
              <p className="mt-2 text-3xl font-bold text-primary-600">${report.data.totalRevenue.toLocaleString()}</p>
            </div>
            <div className="stats-card">
              <h3 className="text-lg font-semibold text-neutral-900">Average Per Patient</h3>
              <p className="mt-2 text-3xl font-bold text-secondary-600">${report.data.averagePerPatient.toFixed(2)}</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="slide-in">
      <div className="mb-6 flex flex-col justify-between space-y-4 md:flex-row md:items-center md:space-y-0">
        <h1 className="text-2xl font-bold text-neutral-900">Reports</h1>
        <div className="flex space-x-3">
          <button
            onClick={handleRefresh}
            className="btn btn-outline flex items-center"
            disabled={isLoading}
          >
            <RefreshCw className={`mr-1 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          {activeReport && (
            <button className="btn btn-primary flex items-center">
              <Download className="mr-1 h-4 w-4" />
              Export Report
            </button>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        {/* Reports sidebar */}
        <div className="md:col-span-1">
          <div className="card">
            <h2 className="mb-3 font-semibold text-neutral-900">Available Reports</h2>
            <div className="space-y-2">
              {reports.map((report) => (
                <button
                  key={report.id}
                  className={`flex w-full items-start rounded-md p-3 text-left transition-colors ${
                    activeReport?.id === report.id
                      ? 'bg-primary-50 text-primary-700'
                      : 'hover:bg-neutral-100'
                  }`}
                  onClick={() => setActiveReport(report)}
                >
                  <FileText className="mr-3 h-5 w-5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">{report.title}</p>
                    <p className="text-xs text-neutral-500">
                      {report.period.charAt(0).toUpperCase() + report.period.slice(1)} |{' '}
                      {new Date(report.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Report content */}
        <div className="md:col-span-3">
          {activeReport ? (
            <div className="card">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-neutral-900">{activeReport.title}</h2>
                  <p className="text-sm text-neutral-500">
                    {activeReport.period.charAt(0).toUpperCase() + activeReport.period.slice(1)} Report |{' '}
                    {new Date(activeReport.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Report stats */}
              {renderReportData(activeReport)}

              {/* Report chart */}
              {renderChart(activeReport)}
            </div>
          ) : (
            <div className="card flex h-64 items-center justify-center">
              <p className="text-lg text-neutral-500">Select a report to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportsPage1;