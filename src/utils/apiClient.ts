
interface ApiClientConfig {
  baseURL?: string;
  timeout?: number;
  retries?: number;
  retryDelay?: number;
}

interface RequestConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: any;
  timeout?: number;
}

class ApiClient {
  private baseURL: string;
  private timeout: number;
  private retries: number;
  private retryDelay: number;

  constructor(config: ApiClientConfig = {}) {
    this.baseURL = config.baseURL || '';
    this.timeout = config.timeout || 10000;
    this.retries = config.retries || 3;
    this.retryDelay = config.retryDelay || 1000;
  }

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async fetchWithTimeout(url: string, config: RequestInit, timeout: number): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...config,
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  async request<T>(endpoint: string, config: RequestConfig = {}): Promise<T> {
    const {
      method = 'GET',
      headers = {},
      body,
      timeout = this.timeout
    } = config;

    const url = `${this.baseURL}${endpoint}`;
    
    const requestConfig: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };

    if (body) {
      requestConfig.body = JSON.stringify(body);
    }

    let lastError: Error;

    for (let attempt = 0; attempt <= this.retries; attempt++) {
      try {
        const response = await this.fetchWithTimeout(url, requestConfig, timeout);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
      } catch (error) {
        lastError = error as Error;
        
        // Don't retry on client errors (4xx) or if it's the last attempt
        if (attempt === this.retries || 
            (error as any)?.response?.status >= 400 && (error as any)?.response?.status < 500) {
          break;
        }

        // Exponential backoff
        await this.delay(this.retryDelay * Math.pow(2, attempt));
      }
    }

    throw lastError!;
  }

  // Convenience methods
  get<T>(endpoint: string, config?: Omit<RequestConfig, 'method'>): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'GET' });
  }

  post<T>(endpoint: string, data?: any, config?: Omit<RequestConfig, 'method' | 'body'>): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'POST', body: data });
  }

  put<T>(endpoint: string, data?: any, config?: Omit<RequestConfig, 'method' | 'body'>): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'PUT', body: data });
  }

  delete<T>(endpoint: string, config?: Omit<RequestConfig, 'method'>): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'DELETE' });
  }
}

// Export a default instance
export const apiClient = new ApiClient({
  timeout: 10000,
  retries: 3,
  retryDelay: 1000
});

export default ApiClient;
