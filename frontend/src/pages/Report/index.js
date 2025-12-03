// frontend/src/pages/Report/index.js
import React, { Suspense, lazy } from 'react';
import ErrorBoundary from '../../components/ErrorBoundary';

// Lazy load the report component for better performance and security
const Report = lazy(() => import('./Report'));

// Loading component for suspense fallback
const ReportLoading = () => (
  <div className="min-h-screen bg-gray-50 p-6">
    <div className="bg-white rounded-lg shadow p-6">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
        <div className="space-y-4">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 rounded w-4/6"></div>
        </div>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  </div>
);

const ReportPage = () => {
  return (
    <ErrorBoundary>
      <Suspense fallback={<ReportLoading />}>
        <Report />
      </Suspense>
    </ErrorBoundary>
  );
};

// Add security metadata
ReportPage.displayName = 'ReportPage';
ReportPage.security = {
  requiresAuth: true,
  permission: 'view_reports',
  dataSensitivity: 'high'
};

export default ReportPage;