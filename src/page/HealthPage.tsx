/**
 * Health Check Route Component
 * Provides a dedicated health check endpoint page
 */

import React from 'react';
import HealthCheck from '../components/utils/HealthCheck';

const HealthPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">System Health Status</h1>
          <p className="text-gray-600">
            Monitor the health of your frontend and backend services
          </p>
        </div>
        
        <HealthCheck showDetails={true} />
        
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>This page automatically refreshes health status every 30 seconds</p>
        </div>
      </div>
    </div>
  );
};

export default HealthPage;