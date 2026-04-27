import { useState } from 'react';
import AuthLayout from './AuthLayout';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import type { User } from '../types/Auth';

interface AuthPageProps {
  onAuthSuccess: (user: User) => void;
}

const AuthPage = ({ onAuthSuccess }: AuthPageProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleLoginSuccess = (_token: string, email: string) => {
    setIsLoading(true);
    try {
      const user: User = {
        id: email.split('@')[0],
        email: email,
        name: email.split('@')[0],
        role: 'admin',
        createdAt: new Date(),
      };
      onAuthSuccess(user);
    } catch (error) {
      console.error('Auth success handling failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignupSuccess = (_token: string, email: string) => {
    setIsLoading(true);
    try {
      const user: User = {
        id: email.split('@')[0],
        email: email,
        name: email.split('@')[0],
        role: 'admin',
        createdAt: new Date(),
      };
      onAuthSuccess(user);
    } catch (error) {
      console.error('Auth success handling failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      {isLogin ? (
        <LoginForm
          onLoginSuccess={handleLoginSuccess}
          onSwitchToSignup={() => setIsLogin(false)}
          isLoading={isLoading}
        />
      ) : (
        <SignupForm
          onSignupSuccess={handleSignupSuccess}
          onSwitchToLogin={() => setIsLogin(true)}
          isLoading={isLoading}
        />
      )}
    </AuthLayout>
  );
};

export default AuthPage;
