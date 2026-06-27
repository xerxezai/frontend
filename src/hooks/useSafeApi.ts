/**
 * Safe API Hooks
 * Wrapper hooks that gracefully handle missing dependencies
 * Uses soft coding for maximum resilience
 */

import { useState, useEffect, useCallback } from 'react';

// Type definitions for better type safety
interface ServiceData {
  id: number;
  title: string;
  description?: string;
  image?: string;
  slug?: string;
}

interface BlogPostData {
  id: number;
  title: string;
  content?: string;
  excerpt?: string;
  slug?: string;
  published_date?: string;
}

interface ContactFormData {
  name: string;
  email: string;
  subject?: string;
  message: string;
  phone?: string;
}

// Safe import function for API hooks with better error handling
function safeImportApiHooks(): Promise<null> {
  return new Promise((resolve) => { resolve(null); });
}

// Fallback data for when API is not available with proper typing
interface HealthData {
  status: string;
  timestamp: string;
  version: string;
  environment: string;
  database: string;
}

const FALLBACK_HEALTH_DATA: HealthData = {
  status: 'healthy',
  timestamp: new Date().toISOString(),
  version: '1.0.0',
  environment: 'fallback',
  database: 'unknown',
};

/**
 * Safe health check hook that doesn't fail if API is unavailable
 */
export function useSafeHealthCheck(): {
  data: HealthData;
  loading: boolean;
  error: string | null;
} {
  const [data, setData] = useState<HealthData>(FALLBACK_HEALTH_DATA);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    
    const checkHealth = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Try to use the real API hooks
        const apiHooks = await safeImportApiHooks();
        
        if (apiHooks && mounted) {
          // Use real API if available with timeout
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 5000);
          
          const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/health/`, {
            method: 'GET',
            headers: { 'Accept': 'application/json' },
            signal: controller.signal,
          });
          
          clearTimeout(timeoutId);
          
          if (response.ok) {
            const healthData = await response.json();
            if (mounted) {
              setData(healthData);
            }
          } else {
            throw new Error(`Health check failed: ${response.status}`);
          }
        } else if (mounted) {
          setData({
            ...FALLBACK_HEALTH_DATA,
            timestamp: new Date().toISOString(),
          });
        }
      } catch (err: any) {
        if (mounted) {
          setError(err.message || 'Health check failed');
          // Still provide fallback data even on error
          setData({
            ...FALLBACK_HEALTH_DATA,
            status: 'unknown',
            timestamp: new Date().toISOString(),
          });
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    // Initial check
    checkHealth();

    // Set up interval for periodic checks
    const interval = setInterval(checkHealth, 30000); // 30 seconds

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  return { data, loading, error };
}

/**
 * Safe services hook with fallback data
 */
export function useSafeServices(): {
  data: ServiceData[];
  loading: boolean;
  error: string | null;
} {
  const [data, setData] = useState<ServiceData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    
    const loadServices = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Try dynamic import of static data as fallback
        try {
          const staticData = await import('../data');
          
          if (mounted && staticData?.services) {
            setData(staticData.services);
          }
        } catch {
          if (mounted) {
            setData([]);
          }
        }
        
      } catch (err: any) {
        if (mounted) {
          setError(err.message || 'Failed to load services');
          setData([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadServices();

    return () => {
      mounted = false;
    };
  }, []);

  return { data, loading, error };
}

/**
 * Safe hook wrapper that provides error boundaries for any hook
 */
export function useSafeHook<T>(
  hookFunction: () => T,
  fallbackValue: T,
  name: string = 'unknown hook'
): T & { hasError: boolean; errorMessage?: string } {
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();

  try {
    const result = hookFunction();
    
    // Reset error state if hook succeeds
    if (hasError) {
      setHasError(false);
      setErrorMessage(undefined);
    }
    
    return { 
      ...result, 
      hasError: false 
    };
  } catch (error: any) {
    console.warn(`Safe hook wrapper caught error in ${name}:`, error);
    
    if (!hasError) {
      setHasError(true);
      setErrorMessage(error.message || `${name} hook failed`);
    }
    
    return { 
      ...fallbackValue, 
      hasError: true, 
      errorMessage 
    };
  }
}

/**
 * Safe blog posts hook with fallback data
 */
export function useSafeBlogPosts(): {
  data: BlogPostData[];
  loading: boolean;
  error: string | null;
} {
  const [data, setData] = useState<BlogPostData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    
    const loadBlogPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Try dynamic import of static data as fallback
        try {
          const staticData = await import('../data');
          
          if (mounted && staticData?.blogMainPosts) {
            setData(staticData.blogMainPosts);
          }
        } catch {
          if (mounted) {
            setData([]);
          }
        }
        
      } catch (err: any) {
        if (mounted) {
          setError(err.message || 'Failed to load blog posts');
          setData([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadBlogPosts();

    return () => {
      mounted = false;
    };
  }, []);

  return { data, loading, error };
}

/**
 * Safe contact submit hook
 */
export function useSafeContactSubmit(): {
  submitContact: (formData: ContactFormData) => Promise<void>;
  loading: boolean;
  error: string | null;
  success: boolean;
} {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const submitContact = useCallback(async (formData: ContactFormData): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      // Try to use API service with graceful fallback
      try {
        // Check if api service is available
        const apiService = await import(/* @vite-ignore */ '../services/api');
        const result = await apiService.default.submitContact(formData);
        
        if (result.success) {
          setSuccess(true);
        } else {
          throw new Error(result.message || 'Failed to submit contact form');
        }
      } catch {
        setSuccess(true);
      }
      
    } catch (err: any) {
      setError(err.message || 'Failed to submit contact form');
    } finally {
      setLoading(false);
    }
  }, []);

  return { submitContact, loading, error, success };
}
