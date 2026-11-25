import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import StudentLayout from '../layouts/StudentLayout';
import AdminLayout from '../layouts/AdminLayout';

import LoginPage from '../pages/auth/LoginPage';
import StudentDashboard from '../pages/student/StudentDashboard';
import ServiceCatalogPage from '../pages/student/ServiceCatalogPage';
import SubmissionFormPage from '../pages/student/SubmissionFormPage';
import MySubmissionsPage from '../pages/student/MySubmissionsPage';
import SubmissionDetailPage from '../pages/student/SubmissionDetailPage';
import StudentProfilePage from '../pages/student/StudentProfilePage';

import AdminDashboard from '../pages/admin/AdminDashboard';
import ManageSubmissionsPage from '../pages/admin/ManageSubmissionsPage';
import ApprovalDetailPage from '../pages/admin/ApprovalDetailPage';
import UserManagementPage from '../pages/admin/UserManagementPage';
import ReportsPage from '../pages/admin/ReportsPage';

import NotFoundPage from '../pages/NotFoundPage';
import { authService } from '../services/authService';

function RootRedirect() {
  const user = authService.getCurrentUser();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'ADMIN') return <Navigate to="/admin/dashboard" replace />;
  return <Navigate to="/student/dashboard" replace />;
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootRedirect />,
  },
  {
    element: <AuthLayout />,
    children: [
      {
        path: '/login',
        element: <LoginPage />,
      },
    ],
  },
  {
    path: '/student',
    element: <StudentLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/student/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <StudentDashboard />,
      },
      {
        path: 'services',
        element: <ServiceCatalogPage />,
      },
      {
        path: 'services/:serviceType/new',
        element: <SubmissionFormPage />,
      },
      {
        path: 'submissions',
        element: <MySubmissionsPage />,
      },
      {
        path: 'submissions/:id',
        element: <SubmissionDetailPage />,
      },
      {
        path: 'profile',
        element: <StudentProfilePage />,
      },
    ],
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/admin/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <AdminDashboard />,
      },
      {
        path: 'submissions',
        element: <ManageSubmissionsPage />,
      },
      {
        path: 'submissions/:id',
        element: <ApprovalDetailPage />,
      },
      {
        path: 'users',
        element: <UserManagementPage />,
      },
      {
        path: 'reports',
        element: <ReportsPage />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);
