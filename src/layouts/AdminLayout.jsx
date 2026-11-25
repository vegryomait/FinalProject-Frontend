import React, { useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AppSidebar from '../components/layout/AppSidebar';
import AppTopbar from '../components/layout/AppTopbar';
import { authService } from '../services/authService';

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const currentUser = authService.getCurrentUser();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (currentUser.role !== 'ADMIN') {
    return <Navigate to="/student/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-[#F4F7FC]">
      <AppSidebar
        role="ADMIN"
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="lg:pl-64 flex flex-col min-h-screen">
        <AppTopbar
          user={currentUser}
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
