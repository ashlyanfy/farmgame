const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

class ApiClient {
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  getToken(): string | null {
    if (!this.token) this.token = localStorage.getItem('auth_token');
    return this.token;
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = this.getToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers });

    if (!response.ok) {
      if (response.status === 401) {
        this.clearToken();
        window.location.reload();
      }
    const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }));
    const message = Array.isArray(errorData.detail)
        ? errorData.detail.map((e: any) => e.msg).join(', ')
        : (errorData.detail || 'Request failed');
    throw new Error(message);

    }

    return response.json();
  }

  get<T>(endpoint: string) { return this.request<T>(endpoint, { method: 'GET' }); }
  post<T>(endpoint: string, data?: any) { return this.request<T>(endpoint, { method: 'POST', body: data ? JSON.stringify(data) : undefined }); }
  put<T>(endpoint: string, data?: any) { return this.request<T>(endpoint, { method: 'PUT', body: data ? JSON.stringify(data) : undefined }); }
}

export const apiClient = new ApiClient();
