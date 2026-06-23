/**
 * Simple Health Check Component
 * Lightweight health monitoring without complex dependencies
 * Uses soft-coded configuration for maximum compatibility
 */

import React, { useState, useEffect } from 'react';

interface SimpleHealthStatus {
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
    message?: string;
  };
  overall: 'healthy' | 'degraded' | 'unhealthy';
}

interface SimpleHealthCheckProps {
  showDetails?: boolean;
  compact?: boolean;
  onStatusChange?: (status: SimpleHealthStatus) => void;
}

const SimpleHealthCheck: React.FC<SimpleHealthCheckProps> = ({
  showDetails: _showDetails = false,
  compact = false,
  onStatusChange,
}) => {
  const [healthStatus, setHealthStatus] = useState<SimpleHealthStatus>({
    frontend: {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      uptime: 0,
    },
    backend: {
      status: 'unknown',
      message: 'Checking...'
    },
    overall: 'degraded'
  });

  const [startTime] = useState(Date.now());
  const [loading, setLoading] = useState(false);

  // Soft-coded configuration
  const config = {
    healthCheckInterval: parseInt(import.meta.env.VITE_HEALTH_CHECK_INTERVAL || '30000'),
    apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1',
    enableHealthCheck: import.meta.env.VITE_ENABLE_HEALTH_CHECK !== 'false',
    maxRetries: 3,
    timeout: 5000,
  };

  const checkBackendHealth = async () => {
    if (!config.enableHealthCheck) {
      return {
        status: 'unknown' as const,
        message: 'Health check disabled'
      };
    }

    try {
      setLoading(true);
      
      const healthUrl = config.apiBaseUrl.replace('/api/v1', '/health/');
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), config.timeout);

      const response = await fetch(healthUrl, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        return {
          status: 'healthy' as const,
          timestamp: new Date().toISOString(),
          version: data.version || 'unknown',
          environment: data.environment || 'unknown',
          message: data.message || 'API is healthy'
        };
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error: any) {
      console.warn('Backend health check failed:', error.message);
      return {
        status: 'unhealthy' as const,
        timestamp: new Date().toISOString(),
        message: `Backend unavailable: ${error.message}`
      };
    } finally {
      setLoading(false);
    }
  };

  // Run health check on mount and on interval
  useEffect(() => {
    let mounted = true;

    const runCheck = async () => {
      const backendResult = await checkBackendHealth();
      if (!mounted) return;

      const uptime = Math.floor((Date.now() - startTime) / 1000);
      const overallStatus: 'healthy' | 'degraded' | 'unhealthy' =
        backendResult.status === 'healthy' ? 'healthy' :
        backendResult.status === 'unhealthy' ? 'unhealthy' : 'degraded';

      const updated: SimpleHealthStatus = {
        frontend: {
          status: 'healthy',
          timestamp: new Date().toISOString(),
          version: import.meta.env.VITE_APP_VERSION || '1.0.0',
          uptime,
        },
        backend: backendResult,
        overall: overallStatus,
      };

      setHealthStatus(updated);
      onStatusChange?.(updated);
    };

    runCheck();
    const interval = setInterval(runCheck, config.healthCheckInterval);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getStatusIcon = (status: string): string => {
    switch (status) {
      case 'healthy': return 'âœ…';
      case 'degraded': return 'âš ï¸';
      case 'unhealthy': return 'âŒ';
      default: return 'â“';
    }
  };

  if (compact) {
    return (
      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium">Status:</span>
        <span className="text-sm font-semibold">
          {getStatusIcon(healthStatus.overall)} {healthStatus.overall.toUpperCase()}
          {loading && ' ðŸ”„'}
        </span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">System Health</h3>
      <div className="space-y-2">
        <div>Frontend: {getStatusIcon(healthStatus.frontend.status)} {healthStatus.frontend.status}</div>
        <div>Backend: {getStatusIcon(healthStatus.backend.status)} {healthStatus.backend.status}</div>
        <div>Overall: {getStatusIcon(healthStatus.overall)} {healthStatus.overall}</div>
      </div>
    </div>
  );
};

export default SimpleHealthCheck;
