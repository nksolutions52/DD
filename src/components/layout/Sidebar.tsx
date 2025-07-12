import { BarChart3, Calendar, Home, Menu, Users, X, Pill, DollarSign, Settings, UserPlus } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { ToothLogo } from '../common/ToothLogo';
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
    // If no permissions defined, show all (backward compatibility)
    if (!permissions || Object.keys(permissions).length === 0) {
      return true;
    }
    // Check if user has permission for this item
    return permissions[item.permission] === true;
  });

  return (
    <>
      {/* Mobile sidebar overlay */}
      <div
        className={`fixed inset-0 z-20 bg-black/50 backdrop-blur-sm transition-opacity lg:hidden ${
          sidebarOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={() => setSidebarOpen(false)}
      />

      <div
        className={`fixed inset-y-0 left-0 z-20 w-64 max-w-full transform overflow-y-auto glass-sidebar transition-transform lg:translate-x-0 flex flex-col ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-14 sm:h-16 items-center justify-between px-3 sm:px-4 border-b border-white/20 flex-shrink-0">
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* <ToothLogo className="h-6 w-6 sm:h-8 sm:w-8" /> */}
             <img src="images/tooth-logo.svg" alt="Tooth Icon" className="h-6 w-6 sm:h-8 sm:w-8" />
            <span className="text-lg sm:text-xl font-bold gradient-text">K-Health</span>
          </div>
          <button
            type="button"
            className="rounded-xl p-1 sm:p-2 text-neutral-500 hover:bg-white/20 hover:text-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <span className="sr-only">Close sidebar</span>
            <X className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
        </div>

        <div className="py-4 sm:py-6 px-3 sm:px-4 flex-1 overflow-y-auto">
          <nav className="space-y-1 sm:space-y-2">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? 'active' : 'text-neutral-600'}`
                }
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="font-medium text-sm sm:text-base">{item.name}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* User info at bottom */}
        <div className="p-3 sm:p-4 w-full flex-shrink-0">
          <div className="rounded-xl sm:rounded-2xl bg-gradient-to-r from-primary-500/10 to-purple-500/10 p-3 sm:p-4 border border-primary-200/30 backdrop-blur-sm">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                <Users className="h-4 w-4 sm:h-5 sm:w-5 text-primary-600" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-semibold text-neutral-900 truncate">{user?.name}</p>
                <p className="text-xs text-neutral-600 capitalize truncate">
                  {user?.roleEntity?.name || user?.role}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;