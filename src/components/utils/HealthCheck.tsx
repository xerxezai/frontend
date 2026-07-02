/**
 * Health Check Component
 * Monitors frontend and backend API health status
 * Provides real-time health monitoring with soft-coded configuration
 */

import React, { useState, useEffect } from 'react';
import { useSafeHealthCheck } from '../../hooks/useSafeApi';

interface HealthStatus {
  frontend: {
    status: 'healthy' | 'unhealthy' | 'unknown';
    timestamp: string;
    version: string;
    uptime: number;
  };
  backend: {
    status: 'healthy' | 'unhealthy' | 'unknown';
    timestamp?: string;
    version?: string;
    environment?: string;
    database?: string;
  };
  overall: 'healthy' | 'degraded' | 'unhealthy';
}

interface HealthCheckProps {
  showDetails?: boolean;
  compact?: boolean;
  onStatusChange?: (status: HealthStatus) => void;
}

const HealthCheck: React.FC<HealthCheckProps> = ({
  showDetails = false,
  compact = false,
  onStatusChange,
}) => {
  const [frontendHealth, setFrontendHealth] = useState<HealthStatus['frontend']>({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: import.meta.env.VITE_APP_VERSION || '1.0.0',
    uptime: 0,
  });

  const [startTime] = useState(Date.now());
  
  // Soft-coded error handling - gracefully handle hook failures
  let backendHealth = null;
  let backendError = null;
  let loading = false;
  
  try {
    const healthCheck = useSafeHealthCheck();
    backendHealth = healthCheck.data;
    backendError = healthCheck.error;
    loading = healthCheck.loading;
  } catch (hookError) {
    backendError = 'Health check service unavailable';
  }

  // Calculate overall health status with proper typing
  const getOverallStatus = React.useCallback((): HealthStatus => {
    const backendStatus: 'healthy' | 'unhealthy' | 'unknown' = 
      backendError ? 'unhealthy' : backendHealth ? 'healthy' : 'unknown';
    
    const backend: HealthStatus['backend'] = {
      status: backendStatus,
      timestamp: backendHealth?.timestamp,
      version: backendHealth?.version,
      environment: backendHealth?.environment,
      database: backendHealth?.database,
    };

    const overall: 'healthy' | 'degraded' | 'unhealthy' = 
      frontendHealth.status === 'healthy' && backend.status === 'healthy' ? 'healthy' :
      frontendHealth.status === 'unhealthy' || backend.status === 'unhealthy' ? 'unhealthy' :
      'degraded';

    return {
      frontend: frontendHealth,
      backend,
      overall,
    };
  }, [frontendHealth, backendHealth, backendError]);

  // Update uptime every second with safe cleanup
  useEffect(() => {
    const interval = setInterval(() => {
      setFrontendHealth(prev => ({
        ...prev,
        uptime: Math.floor((Date.now() - startTime) / 1000),
        timestamp: new Date().toISOString(),
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  // Notify parent component of status changes with proper dependency array
  useEffect(() => {
    if (onStatusChange) {
      onStatusChange(getOverallStatus());
    }
  }, [getOverallStatus, onStatusChange]);

  const healthStatus = getOverallStatus();

  // Format uptime with proper type annotation
  const formatUptime = React.useCallback((seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  // Get status color with proper type annotation
  const getStatusColor = React.useCallback((status: string): string => {
    switch (status) {
      case 'healthy': return 'text-green-600';
      case 'degraded': return 'text-yellow-600';
      case 'unhealthy': return 'text-red-600';
      default: return 'text-gray-600';
    }
  }, []);

  // Get status icon with proper type annotation
  const getStatusIcon = React.useCallback((status: string): string => {
    switch (status) {
      case 'healthy': return 'âœ…';
      case 'degraded': return 'âš ï¸';
      case 'unhealthy': return 'âŒ';
      default: return 'â“';
    }
  }, []);

  if (compact) {
    return (
      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium">Status:</span>
        <span className={`text-sm font-semibold ${getStatusColor(healthStatus.overall)}`}>
          {getStatusIcon(healthStatus.overall)} {healthStatus.overall.toUpperCase()}
        </span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">System Health</h3>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
          healthStatus.overall === 'healthy' ? 'bg-green-100 text-green-800' :
          healthStatus.overall === 'degraded' ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {getStatusIcon(healthStatus.overall)} {healthStatus.overall.toUpperCase()}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Frontend Health */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-md font-medium text-gray-900">Frontend</h4>
            <span className={`text-sm font-semibold ${getStatusColor(healthStatus.frontend.status)}`}>
              {getStatusIcon(healthStatus.frontend.status)} {healthStatus.frontend.status.toUpperCase()}
            </span>
          </div>
          
          {showDetails && (
            <div className="space-y-1 text-sm text-gray-600">
              <div>Version: {healthStatus.frontend.version}</div>
              <div>Uptime: {formatUptime(healthStatus.frontend.uptime)}</div>
              <div>Last Updated: {new Date(healthStatus.frontend.timestamp).toLocaleTimeString()}</div>
            </div>
          )}
        </div>

        {/* Backend Health */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-md font-medium text-gray-900">Backend API</h4>
            <span className={`text-sm font-semibold ${getStatusColor(healthStatus.backend.status)}`}>
              {loading ? 'ðŸ”„' : getStatusIcon(healthStatus.backend.status)} 
              {loading ? 'CHECKING' : healthStatus.backend.status.toUpperCase()}
            </span>
          </div>
          
          {showDetails && (
            <div className="space-y-1 text-sm text-gray-600">
              {healthStatus.backend.version && (
                <div>Version: {healthStatus.backend.version}</div>
              )}
              {healthStatus.backend.environment && (
                <div>Environment: {healthStatus.backend.environment}</div>
              )}
              {healthStatus.backend.database && (
                <div>Database: {healthStatus.backend.database}</div>
              )}
              {healthStatus.backend.timestamp && (
                <div>Last Check: {new Date(healthStatus.backend.timestamp).toLocaleTimeString()}</div>
              )}
              {backendError && (
                <div className="text-red-600">Error: {backendError}</div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Additional Details */}
      {showDetails && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <strong>API Base URL:</strong>
                <br />
                {import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}
              </div>
              <div>
                <strong>Health Check Interval:</strong>
                <br />
                {Math.floor((import.meta.env.VITE_HEALTH_CHECK_INTERVAL || 30000) / 1000)}s
              </div>
              <div>
                <strong>Environment:</strong>
                <br />
                {import.meta.env.MODE || 'development'}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HealthCheck;
