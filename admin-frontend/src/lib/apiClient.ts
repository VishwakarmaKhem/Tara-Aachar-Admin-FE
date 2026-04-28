import { getToken } from '../services/authService';
import { logger } from '../utils/logger';

const BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: unknown;
  isFormData?: boolean;
  params?: Record<string, string | number>;
};

async function request<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  const { method = 'GET', body, isFormData = false, params } = options;

  // Build URL with query params
  let url = `${BASE_URL}${endpoint}`;
  if (params) {
    const query = new URLSearchParams(
      Object.entries(params).reduce((acc, [k, v]) => {
        acc[k] = String(v);
        return acc;
      }, {} as Record<string, string>)
    );
    url += `?${query.toString()}`;
  }

  // Build headers
  const token = getToken();
  const headers: Record<string, string> = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(!isFormData ? { 'Content-Type': 'application/json' } : {}),
  };

  try {
    const response = await fetch(url, {
      method,
      headers,
      body: isFormData
        ? (body as FormData)
        : body
        ? JSON.stringify(body)
        : undefined,
    });

    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch {
        // ignore JSON parse error
      }
      throw new Error(errorMessage);
    }

    const result = await response.json();
    return {
      success: true,
      message: result.message || 'Success',
      data: result.data,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    logger.error(`[API] ${method} ${endpoint} failed:`, errorMessage);
    return {
      success: false,
      message: errorMessage,
      error: errorMessage,
    };
  }
}

export const apiClient = {
  get: <T>(endpoint: string, params?: Record<string, string | number>) =>
    request<T>(endpoint, { method: 'GET', params }),

  post: <T>(endpoint: string, body: unknown) =>
    request<T>(endpoint, { method: 'POST', body }),

  put: <T>(endpoint: string, body: unknown, params?: Record<string, string | number>) =>
    request<T>(endpoint, { method: 'PUT', body, params }),

  delete: <T>(endpoint: string, params?: Record<string, string | number>) =>
    request<T>(endpoint, { method: 'DELETE', params }),

  upload: <T>(endpoint: string, formData: FormData, params?: Record<string, string | number>) =>
    request<T>(endpoint, { method: 'POST', body: formData, isFormData: true, params }),
};
