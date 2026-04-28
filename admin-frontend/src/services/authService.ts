import type { User } from '../types/Auth';
import { logger } from '../utils/logger';

const BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: { token: string; user?: User };
  error?: string;
}

export interface RegisterData {
  email: string;
  password: string;
  phoneNumber: string | number;
}

export interface LoginData {
  email: string;
  password: string;
}

// ─── Cookie helpers ───────────────────────────────────────────────────────────

const setCookie = (name: string, value: string, days = 1): void => {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Strict`;
};

const getCookie = (name: string): string | null => {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
};

const deleteCookie = (name: string): void => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Strict`;
};

// ─── Shared fetch helper ──────────────────────────────────────────────────────

const authFetch = async (
  endpoint: string,
  body: object
): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${BASE_URL}/auth/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      let message = `HTTP error! status: ${response.status}`;
      try {
        const err = await response.json();
        message = err.message || message;
      } catch { /* ignore */ }
      throw new Error(message);
    }

    const result = await response.json();
    const token: string = result.data?.token;
    const email: string = result.data?.email ?? (body as LoginData).email;

    if (token) {
      setCookie('authToken', token);
      setCookie('authEmail', email);
    }

    return {
      success: true,
      message: result.message || 'Success',
      data: {
        token,
        user: {
          id: result.data?.sub || '',
          email,
          name: email.split('@')[0],
          role: result.data?.userType === 'ADMIN' ? 'admin' : 'user',
          createdAt: new Date(),
        },
      },
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Auth failed';
    logger.error(`[Auth] ${endpoint} failed:`, errorMessage);
    return { success: false, message: errorMessage, error: errorMessage };
  }
};

// ─── Public API ───────────────────────────────────────────────────────────────

export const register = (data: RegisterData): Promise<AuthResponse> =>
  authFetch('register', {
    email: data.email,
    password: data.password,
    phoneNumber: Number(data.phoneNumber),
  });

export const login = (data: LoginData): Promise<AuthResponse> =>
  authFetch('login', data);

export const logout = (): void => {
  deleteCookie('authToken');
  deleteCookie('authEmail');
};

export const getToken = (): string | null => getCookie('authToken');
export const getEmail = (): string | null => getCookie('authEmail');
export const isAuthenticated = (): boolean => !!getCookie('authToken');
