import { useEffect, useState } from 'react';
import apiService from '../services/api'

interface HealthStatus {
  status: string;
  version: string;
  environment: string;
  database: string;
}

export const APIHealthCheck = () => {
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    checkHealth();
  }, []);

  const checkHealth = async () => {
    setLoading(true);
    try {
      const response = await apiService.healthCheck();
      if (response.success) {
        setHealth(response.data);
        setIsConnected(true);
        setError(null);
      } else {
        setError(response.message);
        setIsConnected(false);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to connect to backend');
      setIsConnected(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`api-health-check ${isConnected ? 'connected' : 'disconnected'}`}>
      <div className="status-indicator">
        <span className={`indicator ${isConnected ? 'online' : 'offline'}`}></span>
        <h3>Backend Connection</h3>
      </div>

      {loading && <p>Checking connection...</p>}

      {error && (
        <div className="error-message">
          <p>Connection Error: {error}</p>
          <button onClick={checkHealth}>Retry</button>
        </div>
      )}

      {health && isConnected && (
        <div className="health-details">
          <p><strong>Status:</strong> {health.status}</p>
          <p><strong>Version:</strong> {health.version}</p>
          <p><strong>Environment:</strong> {health.environment}</p>
          <p><strong>Database:</strong> {health.database}</p>
          <small>Last checked: {new Date().toLocaleTimeString()}</small>
        </div>
      )}

      <div className="api-config">
        <p><strong>API Base URL:</strong> {apiService.getConfig().baseUrl}</p>
        <p><strong>Authenticated:</strong> {apiService.isAuthenticated() ? 'Yes' : 'No'}</p>
      </div>
    </div>
  );
};

export default APIHealthCheck;
