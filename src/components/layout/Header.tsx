import { Bell, LogOut, Menu, User, ChevronDown } from 'lucide-react';
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
  const headerConfig = useHeaderState();

  return (
    <header className="h-20 bg-white border-b border-neutral-200 shadow-sm flex-shrink-0">
      <div className="flex h-full items-center justify-between px-6">
        {/* Left: Menu button (mobile) and Page Title */}
        <div className="flex items-center min-w-0 flex-1">
          <button
            type="button"
            className="mr-4 rounded-lg p-2 text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 lg:hidden"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu className="h-6 w-6" />
          </button>
          
          {/* Mobile Logo */}
          <div className="flex items-center lg:hidden">
            <img src="images/tooth-logo.svg" alt="Tooth Icon" className="h-8 w-8 mr-2" />
            <span className="text-xl font-bold text-primary-600">K-Health</span>
          </div>

          {/* Page Title - Desktop */}
          {headerConfig && (
            <div className="hidden lg:block min-w-0 flex-1">
              <h1 className="text-2xl font-bold text-neutral-900 truncate">
                {headerConfig.title}
              </h1>
              {headerConfig.subtitle && (
                <p className="text-sm text-neutral-500 truncate">
                  {headerConfig.subtitle}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Center: Page actions */}
        {headerConfig?.actions && (
          <div className="hidden lg:flex items-center mx-6">
            {headerConfig.actions}
          </div>
        )}

        {/* Right: User menu */}
        <div className="flex items-center space-x-4 flex-shrink-0">
          {/* User menu */}
          <div className="relative">
            <button
              type="button"
              className="flex items-center space-x-3 rounded-lg p-2 hover:bg-neutral-50 transition-colors"
              onClick={() => setUserMenuOpen(!userMenuOpen)}
            >
              {user?.avatar ? (
                <img
                  className="h-10 w-10 rounded-full object-cover border-2 border-neutral-200"
                  src={user.avatar}
                  alt={user.name}
                />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-primary-600 border-2 border-neutral-200">
                  <User className="h-5 w-5" />
                </div>
              )}
              <div className="hidden lg:block text-left">
                <p className="text-sm font-semibold text-neutral-900 truncate">{user?.name}</p>
                <p className="text-xs text-neutral-500 capitalize truncate">
                  {user?.roleEntity?.name || user?.role}
                </p>
              </div>
              <ChevronDown className={`h-4 w-4 text-neutral-500 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {/* User dropdown */}
            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-lg bg-white shadow-lg ring-1 ring-black/5 border border-neutral-200">
                <div className="border-b border-neutral-100 px-4 py-3">
                  <p className="text-sm font-semibold text-neutral-900 truncate">{user?.name}</p>
                  <p className="text-xs text-neutral-500 truncate">{user?.email}</p>
                </div>
                <button
                  onClick={logout}
                  className="flex w-full items-center px-4 py-3 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
                >
                  <LogOut className="mr-3 h-4 w-4" />
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile page title and actions */}
      {headerConfig && (
        <div className="lg:hidden border-t border-neutral-200 px-6 py-4 bg-white">
          <div className="flex flex-col space-y-3">
            <div>
              <h1 className="text-xl font-bold text-neutral-900 truncate">
                {headerConfig.title}
              </h1>
              {headerConfig.subtitle && (
                <p className="text-sm text-neutral-500 truncate">
                  {headerConfig.subtitle}
                </p>
              )}
            </div>
            {headerConfig.actions && (
              <div className="flex items-center space-x-2">
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