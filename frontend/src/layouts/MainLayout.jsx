import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { Outlet } from 'react-router-dom';
import { HiMenu } from 'react-icons/hi';

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const saved = localStorage.getItem('sidebarCollapsed');
    return saved ? !JSON.parse(saved) : true;
  });
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="bg-white min-h-screen">
      <Sidebar 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen}
        isMobileOpen={isMobileOpen}
        onMobileClose={() => setIsMobileOpen(false)}
      />
      
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-30 p-4 flex items-center justify-between">
        <h1 className="text-lg font-semibold text-black">BTS Manager</h1>
        <button
          onClick={() => setIsMobileOpen(true)}
          className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
        >
          <HiMenu className="w-6 h-6" />
        </button>
      </div>

      {/* Main Content */}
      <div className={`pt-16 lg:pt-6 p-6 lg:p-10 transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}`}>
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;

