import type { User } from '../types/Auth';

const API_BASE_URL = 'https://tara-aachar-admin-be.onrender.com/api/v1/auth';

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    token: string;
    user?: User;
  };
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

// Cookie helpers
const setCookie = (name: string, value: string, days: number = 1): void => {
  const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Strict`;
};

const getCookie = (name: string): string | null => {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
};

const deleteCookie = (name: string): void => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Strict`;
};

// Register new user
export const register = async (data: RegisterData): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: data.email,
        password: data.password,
        phoneNumber: Number(data.phoneNumber),
      }),
    });

    if (!response.ok) {
      try {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      } catch (e) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    }

    const result = await response.json();
    
    // Store token and email in cookies
    const token = result.data?.token;
    if (token) {
      setCookie('authToken', token);
      setCookie('authEmail', data.email);
    }

    return {
      success: result.success || true,
      message: result.message || 'Registration successful',
      data: {
        token: token || '',
        user: {
          id: result.data?.sub || '',
          email: result.data?.email || data.email,
          name: (result.data?.email || data.email).split('@')[0],
          role: result.data?.userType === 'ADMIN' ? 'admin' : 'user',
          createdAt: new Date(),
        },
      },
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Registration failed';
    console.error('Register error:', error);
    return {
      success: false,
      message: errorMessage,
      error: errorMessage,
    };
  }
};

// Login user
export const login = async (data: LoginData): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: data.email,
        password: data.password,
      }),
    });

    if (!response.ok) {
      try {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      } catch (e) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    }

    const result = await response.json();
    
    // Store token and email in cookies
    const token = result.data?.token;
    if (token) {
      setCookie('authToken', token);
      setCookie('authEmail', result.data?.email || data.email);
    }

    return {
      success: result.success || true,
      message: result.message || 'Login successful',
      data: {
        token: token || '',
        user: {
          id: result.data?.sub || '',
          email: result.data?.email || data.email,
          name: (result.data?.email || data.email).split('@')[0],
          role: result.data?.userType === 'ADMIN' ? 'admin' : 'user',
          createdAt: new Date(),
        },
      },
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Login failed';
    console.error('Login error:', error);
    return {
      success: false,
      message: errorMessage,
      error: errorMessage,
    };
  }
};

// Logout user
export const logout = (): void => {
  deleteCookie('authToken');
  deleteCookie('authEmail');
};

// Get stored token
export const getToken = (): string | null => {
  return getCookie('authToken');
};

// Get stored email
export const getEmail = (): string | null => {
  return getCookie('authEmail');
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !!getCookie('authToken');
};
