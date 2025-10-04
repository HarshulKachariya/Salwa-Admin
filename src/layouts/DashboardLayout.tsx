import { useState, type FC, type ReactNode } from "react";
import Header from "../components/Header";
import ProfileModal from "../components/ProfileModal";
import Sidebar from "../components/Sidebar";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout: FC<DashboardLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="flex h-screen bg-[#f5f6fb] text-gray-900 overflow-hidden">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

      {/* Right content area */}
      <div className="flex flex-col flex-1 lg:ml-72 relative">
        {/* Fixed header */}
        <div className="fixed top-0 left-0 lg:left-72 right-0 z-9999 bg-[#f5f6fb] border-b border-gray-200">
          <Header
            onToggleSidebar={toggleSidebar}
            onOpenProfile={() => setIsProfileOpen(true)}
          />
        </div>

        {/* Scrollable main content below header */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden px-4 py-8 sm:px-8 lg:px-12 mt-[80px]">
          {children}
        </main>
      </div>

      {/* Profile modal */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />
    </div>
  );
};

export default DashboardLayout;
