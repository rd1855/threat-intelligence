// frontend/src/pages/Dashboard/index.js
import React, { Suspense, lazy } from 'react';
import ErrorBoundary from '../../components/ErrorBoundary';

// Lazy load dashboard component for better performance
const Dashboard = lazy(() => import('./Dashboard'));

// Simple loading component
const DashboardLoading = () => (
  <div className="p-6 min-h-screen bg-gray-50">
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading secure dashboard...</p>
      </div>
    </div>
  </div>
);

const DashboardPage = () => {
  return (
    <ErrorBoundary>
      <Suspense fallback={<DashboardLoading />}>
        <Dashboard />
      </Suspense>
    </ErrorBoundary>
  );
};

export default DashboardPage;