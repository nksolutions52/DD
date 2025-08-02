import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gradient-to-br from-primary-50 via-purple-50 to-accent-50 overflow-hidden">
      {/* Sidebar - responsive for tablets */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      
      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden lg:ml-80 md:ml-0">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        
        <main className="flex-1 overflow-auto p-3 sm:p-4 md:p-5 lg:p-6 custom-scrollbar">
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