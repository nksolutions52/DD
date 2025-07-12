import { Bell, HelpCircle, LogOut, Menu, User } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useHeaderState } from '../../hooks/usePageHeader';

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const Header = ({ sidebarOpen, setSidebarOpen }: HeaderProps) => {
  const { user, logout } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const headerConfig = useHeaderState();

  return (
    <header className="glass-header z-10 border-b border-white/20 shadow-lg">
      {/* Main header bar */}
      <div className="flex h-14 sm:h-16 items-center justify-between px-3 sm:px-4 md:px-6">
        {/* Left: Menu button (mobile) and Logo */}
        <div className="flex items-center min-w-0 flex-1">
          <button
            type="button"
            className="mr-3 sm:mr-4 rounded-xl p-1 sm:p-2 text-neutral-600 hover:bg-white/30 hover:text-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200 lg:hidden"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <span className="sr-only">Open sidebar</span>
            <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
          
          <div className="flex items-center lg:hidden">
            <span className="text-lg sm:text-xl font-bold gradient-text">K-Health</span>
          </div>

          {/* Dynamic page title - only show on larger screens when available */}
          {headerConfig && (
            <div className="hidden lg:block ml-6 min-w-0 flex-1">
              <h1 className="text-xl xl:text-2xl font-bold text-neutral-900 truncate">
                {headerConfig.title}
              </h1>
              {headerConfig.subtitle && (
                <p className="text-sm text-neutral-500 truncate mt-1">
                  {headerConfig.subtitle}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Center: Page actions (if any) */}
        {headerConfig?.actions && (
          <div className="hidden sm:flex items-center mx-4">
            {headerConfig.actions}
          </div>
        )}

        {/* Right: User menu, notifications, etc. */}
        <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
          {/* Notifications */}
          {/* <div className="relative">
            <button
              type="button"
              className="rounded-xl p-1 sm:p-2 text-neutral-600 hover:bg-white/30 hover:text-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200"
              onClick={() => setNotificationsOpen(!notificationsOpen)}
            >
              <span className="sr-only">View notifications</span>
              <Bell className="h-5 w-5 sm:h-6 sm:w-6" />
              <span className="absolute -right-1 -top-1 flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-full bg-gradient-to-r from-accent-500 to-accent-600 text-[10px] sm:text-xs font-bold text-white shadow-lg">
                3
              </span>
            </button>
            

            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-72 sm:w-80 origin-top-right rounded-xl sm:rounded-2xl bg-white/95 backdrop-blur-md shadow-2xl ring-1 ring-black/5 focus:outline-none border border-white/20">
                <div className="py-2">
                  <div className="border-b border-neutral-200/50 px-3 sm:px-4 py-3">
                    <h3 className="font-semibold gradient-text text-sm sm:text-base">Notifications</h3>
                  </div>
                
                  <div className="max-h-48 sm:max-h-60 overflow-y-auto custom-scrollbar">
                    <div className="border-b border-neutral-100/50 px-3 sm:px-4 py-3 hover:bg-primary-50/50 transition-colors duration-200">
                      <p className="text-xs sm:text-sm font-medium text-neutral-900">New appointment scheduled</p>
                      <p className="text-xs text-neutral-500">Jessica Miller - Today at 10:00 AM</p>
                    </div>
                    <div className="border-b border-neutral-100/50 px-3 sm:px-4 py-3 hover:bg-primary-50/50 transition-colors duration-200">
                      <p className="text-xs sm:text-sm font-medium text-neutral-900">Appointment rescheduled</p>
                      <p className="text-xs text-neutral-500">David Wilson - Yesterday at 3:45 PM</p>
                    </div>
                    <div className="px-3 sm:px-4 py-3 hover:bg-primary-50/50 transition-colors duration-200">
                      <p className="text-xs sm:text-sm font-medium text-neutral-900">New patient registered</p>
                      <p className="text-xs text-neutral-500">Emily Taylor - 2 days ago</p>
                    </div>
                  </div>
                  <div className="border-t border-neutral-200/50 px-3 sm:px-4 py-3 text-center">
                    <button className="text-xs font-medium text-primary-600 hover:text-primary-700 transition-colors duration-200">
                      View all notifications
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div> */}

          {/* Help */}
          {/* <button
            type="button"
            className="rounded-xl p-1 sm:p-2 text-neutral-600 hover:bg-white/30 hover:text-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200 hidden sm:block"
          >
            <span className="sr-only">Help</span>
            <HelpCircle className="h-5 w-5 sm:h-6 sm:w-6" />
          </button> */}

          {/* User menu */}
          <div className="relative">
            <button
              type="button"
              className="flex items-center rounded-xl p-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200 hover:shadow-lg"
              onClick={() => setUserMenuOpen(!userMenuOpen)}
            >
              <span className="sr-only">Open user menu</span>
              {user?.avatar ? (
                <img
                  className="h-8 w-8 sm:h-10 sm:w-10 rounded-xl object-cover shadow-lg border-2 border-white/50"
                  src={user.avatar}
                  alt={user.name}
                />
              ) : (
                <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-100 to-purple-100 text-primary-700 shadow-lg border-2 border-white/50">
                  <User className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
              )}
            </button>
            
            {/* User dropdown */}
            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 sm:w-56 origin-top-right rounded-xl sm:rounded-2xl bg-white/95 backdrop-blur-md py-2 shadow-2xl ring-1 ring-black/5 focus:outline-none border border-white/20">
                <div className="border-b border-neutral-200/50 px-3 sm:px-4 py-3">
                  <p className="text-xs sm:text-sm font-semibold text-neutral-900 truncate">{user?.name}</p>
                  <p className="text-xs text-neutral-500 truncate">{user?.email}</p>
                </div>
                {/* <a
                  href="#"
                  className="block px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-neutral-700 hover:bg-primary-50/50 transition-colors duration-200"
                >
                  Your Profile
                </a>
                <a
                  href="#"
                  className="block px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-neutral-700 hover:bg-primary-50/50 transition-colors duration-200"
                >
                  Settings
                </a> */}
                <button
                  onClick={logout}
                  className="flex w-full items-center px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-neutral-700 hover:bg-error-50/50 hover:text-error-600 transition-colors duration-200"
                >
                  <LogOut className="mr-2 sm:mr-3 h-3 w-3 sm:h-4 sm:w-4" />
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile page title and actions */}
      {headerConfig && (
        <div className="lg:hidden border-t border-white/20 px-3 sm:px-4 py-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
            <div className="min-w-0 flex-1">
              <h1 className="text-lg sm:text-xl font-bold text-neutral-900 truncate">
                {headerConfig.title}
              </h1>
              {headerConfig.subtitle && (
                <p className="text-xs sm:text-sm text-neutral-500 truncate">
                  {headerConfig.subtitle}
                </p>
              )}
            </div>
            {headerConfig.actions && (
              <div className="flex items-center space-x-2 flex-shrink-0">
                {headerConfig.actions}
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;