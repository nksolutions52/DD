import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen bg-gradient-to-br from-primary-50 via-purple-50 to-accent-50 overflow-hidden">
      {/* Sidebar - responsive for tablets */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      
      {/* Main Content */}
      <div className="fixed inset-y-0 left-0 right-0 lg:left-80 flex flex-col overflow-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        
        <main className="flex-1 overflow-auto p-3 sm:p-4 md:p-5 lg:p-6 custom-scrollbar bg-gradient-to-br from-primary-50 via-purple-50 to-accent-50">
          <div className="container-responsive">
            <Outlet />
          </div>
        </main>
        
        <Footer />
      </div>
    </div>
  );
};

export default Layout;