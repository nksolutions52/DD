import { BarChart3, Calendar, Home, Users, X, Pill, DollarSign, Settings, UserPlus } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const { user } = useAuth();

  // Get user permissions from role entity
  let permissions = user?.roleEntity?.permissions || {};
  if (typeof permissions === 'string') {
    try {
      permissions = JSON.parse(permissions);
    } catch (e) {
      permissions = {};
    }
  }

  // Define all navigation items with their required permissions
  const allNavigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home, permission: 'dashboard' },
    { name: 'Patients', href: '/patients', icon: Users, permission: 'patients' },
    { name: 'Appointments', href: '/appointments', icon: Calendar, permission: 'appointments' },
    { name: 'Calendar', href: '/calendar', icon: Calendar, permission: 'calendar' },
    { name: 'Pharmacy', href: '/pharmacy', icon: Pill, permission: 'pharmacy' },
    { name: 'Pharmacy POS', href: '/pharmacy-pos', icon: DollarSign, permission: 'pharmacy-pos' },
    { name: 'Reports', href: '/reports', icon: BarChart3, permission: 'reports' },
    { name: 'Users', href: '/users', icon: UserPlus, permission: 'users' },
    { name: 'Configure', href: '/configure', icon: Settings, permission: 'configure' },
  ];

  // Filter navigation based on user permissions
  const navigation = allNavigation.filter(item => {
    if (!permissions || Object.keys(permissions).length === 0) {
      return true;
    }
    return permissions[item.permission] === true;
  });

  return (
    <>
      {/* Mobile sidebar overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity lg:hidden ${
          sidebarOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-80 bg-white border-r border-neutral-200 shadow-lg transform transition-transform lg:translate-x-0 lg:static lg:inset-0 flex flex-col ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo Section */}
        <div className="flex h-20 items-center justify-between px-6 border-b border-neutral-200 bg-white">
          <div className="flex items-center space-x-3">
            <img src="images/tooth-logo.svg" alt="Tooth Icon" className="h-8 w-8" />
            <span className="text-2xl font-bold text-primary-600">K-Health</span>
          </div>
          <button
            type="button"
            className="rounded-lg p-2 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-6 px-4">
          <nav className="space-y-1">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  `flex items-center space-x-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-600'
                      : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
                  }`
                }
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                <span>{item.name}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* User info at bottom */}
        <div className="p-4 border-t border-neutral-200 bg-white">
          <div className="flex items-center space-x-3 rounded-lg bg-neutral-50 p-3">
            <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
              {user?.avatar ? (
                <img
                  className="h-10 w-10 rounded-full object-cover"
                  src={user.avatar}
                  alt={user.name}
                />
              ) : (
                <Users className="h-5 w-5 text-primary-600" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-neutral-900 truncate">{user?.name}</p>
              <p className="text-xs text-neutral-600 capitalize truncate">
                {user?.roleEntity?.name || user?.role}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;