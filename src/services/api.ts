/**
 * API Service Layer
 * Centralized API communication with backend using soft coding approach
 * Handles authentication, error management, and request configuration
 */

// Fallback types in case the main types file is not available
interface ServiceDataType {
  id: number;
  title: string;
  description?: string;
  image?: string;
  slug?: string;
}

interface BlogDataType {
  id: number;
  title: string;
  content?: string;
  excerpt?: string;
  image?: string;
  featured_image?: string;
  slug?: string;
  published_date?: string;
  created_at?: string;
  author_name?: string;
  category_name?: string;
  tag_names?: string[];
  view_count?: number;
  read_time?: number;
  is_published?: boolean;
}

interface ProjectDataType {
  id: number;
  title: string;
  description?: string;
  image?: string;
  slug?: string;
  technologies?: string[];
}

// Note: Using fallback types defined above. 
// If ../types module exists, it should export these interfaces.

interface ApiConfig {
  baseUrl: string;
  timeout: number;
  retryAttempts: number;
  headers: Record<string, string>;
}

interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  pagination?: {
    count: number;
    next: string | null;
    previous: string | null;
    page_size: number;
  };
}

interface ApiError {
  success: false;
  message: string;
  status: number;
  details?: any;
}

interface AuthTokens {
  access?: string;
  refresh?: string;
}

class ApiService {
  private config: ApiConfig;
  private authTokens: AuthTokens = {};

  constructor() {
    this.config = {
      baseUrl:
        import.meta.env.VITE_API_BASE_URL ||
        'https://backend-production-b9f2.up.railway.app/api/v1',
      timeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '30000'),
      retryAttempts: parseInt(
        import.meta.env.VITE_API_RETRY_ATTEMPTS || '3'
      ),
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    };

    // Load stored auth tokens
    this.loadAuthTokens();
  }
  /**
   * Load authentication tokens from localStorage
   */
  private loadAuthTokens(): void {
    try {
      const tokens = localStorage.getItem('auth_tokens');
      if (tokens) {
        this.authTokens = JSON.parse(tokens);
      }
    } catch (error) {
      console.warn('Failed to load auth tokens:', error);
      this.clearAuthTokens();
    }
  }

  /**
   * Save authentication tokens to localStorage
   */
  private saveAuthTokens(tokens: AuthTokens): void {
    try {
      this.authTokens = tokens;
      localStorage.setItem('auth_tokens', JSON.stringify(tokens));
    } catch (error) {
      console.error('Failed to save auth tokens:', error);
    }
  }

  /**
   * Clear authentication tokens
   */
  private clearAuthTokens(): void {
    this.authTokens = {};
    localStorage.removeItem('auth_tokens');
  }

  /**
   * Get authorization headers
   */
  private getAuthHeaders(): Record<string, string> {
    const headers: Record<string, string> = { ...this.config.headers };
    
    if (this.authTokens.access) {
      headers.Authorization = `Bearer ${this.authTokens.access}`;
    }
    
    return headers;
  }

  /**
   * Generic HTTP request method with retry logic and better timeout handling
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    retryCount = 0
  ): Promise<ApiResponse<T> | ApiError> {
    try {
      const url = `${this.config.baseUrl}${endpoint}`;
      const headers = this.getAuthHeaders();
      
      // Create abort controller for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

      const response = await fetch(url, {
        ...options,
        headers: {
          ...headers,
          ...options.headers,
        },
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        if (response.status === 401) {
          // Unauthorized - clear tokens and redirect to login
          this.clearAuthTokens();
          window.dispatchEvent(new CustomEvent('auth_expired'));
        }

        const errorData = await response.json().catch(() => ({}));
        return {
          success: false,
          message: errorData.message || `HTTP Error: ${response.status}`,
          status: response.status,
          details: errorData,
        };
      }

      const data = await response.json();
      return {
        success: true,
        data: data.results || data,
        pagination: data.count ? {
          count: data.count,
          next: data.next,
          previous: data.previous,
          page_size: data.page_size || 20,
        } : undefined,
      };

    } catch (error: any) {
      console.error(`API Request Error [${endpoint}]:`, error);

      // Retry logic for network errors with exponential backoff
      if (retryCount < this.config.retryAttempts && 
          (error.name === 'TypeError' || error.name === 'AbortError' || error.name === 'NetworkError')) {
        const delay = 1000 * Math.pow(2, retryCount); // exponential backoff
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.request(endpoint, options, retryCount + 1);
      }

      return {
        success: false,
        message: error.message || 'Network or server error',
        status: 0,
        details: error,
      };
    }
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T> | ApiError> {
    let url = endpoint;
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
      url += `?${searchParams.toString()}`;
    }

    return this.request<T>(url, {
      method: 'GET',
    });
  }

  /**
   * POST request
   */
  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T> | ApiError> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * PUT request
   */
  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T> | ApiError> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string): Promise<ApiResponse<T> | ApiError> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    });
  }

  // ============= AUTHENTICATION METHODS =============

  /**
   * User login
   */
  async login(credentials: { username: string; password: string }): Promise<ApiResponse<{
    token: string;
    user: any;
  }> | ApiError> {
    const response = await this.post<{ token: string; user: any }>('/auth/login/', credentials);
    
    if (response.success) {
      this.saveAuthTokens({ access: response.data.token });
    }
    
    return response;
  }

  /**
   * User registration
   */
  async register(userData: {
    username: string;
    email: string;
    password: string;
    first_name?: string;
    last_name?: string;
  }): Promise<ApiResponse<{ token: string; user: any }> | ApiError> {
    return this.post<{ token: string; user: any }>('/auth/register/', userData);
  }

  /**
   * User logout
   */
  async logout(): Promise<ApiResponse<any> | ApiError> {
    const response = await this.post('/auth/logout/');
    this.clearAuthTokens();
    return response;
  }

  /**
   * Get user profile
   */
  async getProfile(): Promise<ApiResponse<any> | ApiError> {
    return this.get('/auth/profile/');
  }

  /**
   * Update user profile
   */
  async updateProfile(data: any): Promise<ApiResponse<any> | ApiError> {
    return this.put('/auth/profile/', data);
  }

  // ============= CONTENT METHODS =============

  /**
   * Get services
   */
  async getServices(params?: {
    page?: number;
    search?: string;
    ordering?: string;
  }): Promise<ApiResponse<ServiceDataType[]> | ApiError> {
    return this.get<ServiceDataType[]>('/services/', params);
  }

  /**
   * Get single service
   */
  async getService(id: number): Promise<ApiResponse<ServiceDataType> | ApiError> {
    return this.get<ServiceDataType>(`/services/${id}/`);
  }

  /**
   * Get blog posts
   */
  async getBlogPosts(params?: {
    page?: number;
    search?: string;
    category?: string;
    ordering?: string;
  }): Promise<ApiResponse<BlogDataType[]> | ApiError> {
    return this.get<BlogDataType[]>('/blog/posts/', params);
  }

  /**
   * Get single blog post
   */
  async getBlogPost(id: number): Promise<ApiResponse<BlogDataType> | ApiError> {
    return this.get<BlogDataType>(`/blog/posts/${id}/`);
  }

  /**
   * Get blog categories
   */
  async getBlogCategories(): Promise<ApiResponse<any[]> | ApiError> {
    return this.get<any[]>('/blog/categories/');
  }

  /**
   * Get projects
   */
  async getProjects(params?: {
    page?: number;
    search?: string;
    category?: string;
    ordering?: string;
  }): Promise<ApiResponse<ProjectDataType[]> | ApiError> {
    return this.get<ProjectDataType[]>('/projects/', params);
  }

  /**
   * Get single project
   */
  async getProject(id: number): Promise<ApiResponse<ProjectDataType> | ApiError> {
    return this.get<ProjectDataType>(`/projects/${id}/`);
  }

  /**
   * Submit contact form
   */
  async submitContact(data: {
    name: string;
    email: string;
    subject?: string;
    message: string;
    phone?: string;
  }): Promise<ApiResponse<any> | ApiError> {
    return this.post('/contact/', data);
  }

  // ============= SYSTEM METHODS =============

  /**
   * Health check with proper error handling and fallbacks
   */
  async healthCheck(): Promise<ApiResponse<{
    status: string;
    version: string;
    environment: string;
    database: string;
  }> | ApiError> {
    // Use base URL without /api/v1 for health check
    const healthUrl = this.config.baseUrl.replace('/api/v1', '') + '/health/';
    
    try {
      // Create abort controller for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch(healthUrl, {
        headers: { 'Accept': 'application/json' },
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);

      const data = await response.json();
      
      if (response.ok) {
        return { success: true, data };
      } else {
        return {
          success: false,
          message: data.message || 'Health check failed',
          status: response.status,
        };
      }
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Health check failed',
        status: 0,
      };
    }
  }

  /**
   * Get API root information
   */
  async getApiRoot(): Promise<ApiResponse<any> | ApiError> {
    return this.get('/');
  }

  // ============= UTILITY METHODS =============

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.authTokens.access;
  }

  /**
   * Get current auth tokens
   */
  getAuthTokens(): AuthTokens {
    return { ...this.authTokens };
  }

  /**
   * Update API configuration
   */
  updateConfig(config: Partial<ApiConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Get current API configuration
   */
  getConfig(): ApiConfig {
    return { ...this.config };
  }
}

// Create singleton instance
const apiService = new ApiService();

// Export both the instance and the class
export { apiService as default, ApiService };
export type { ApiResponse, ApiError, AuthTokens };