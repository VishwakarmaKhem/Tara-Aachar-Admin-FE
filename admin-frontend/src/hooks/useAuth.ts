import { useState, useEffect } from 'react';
import type { User } from '../types/Auth';
import { getToken, getEmail, isAuthenticated, logout as logoutService } from '../services/authService';

interface UseAuthResult {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
}

export const useAuth = (): UseAuthResult => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    const email = getEmail();

    if (token && email && isAuthenticated()) {
      setUser({
        id: email.split('@')[0],
        email,
        name: email.split('@')[0],
        role: 'admin',
        createdAt: new Date(),
      });
    }

    setIsLoading(false);
  }, []);

  const logout = () => {
    logoutService();
    setUser(null);
  };

  return { user, isLoading, setUser, logout };
};
