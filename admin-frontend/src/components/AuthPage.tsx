import { useState } from 'react';
import AuthLayout from './AuthLayout';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import type { LoginFormData, SignupFormData, User } from '../types/Auth';

interface AuthPageProps {
  onAuthSuccess: (user: User) => void;
}

const AuthPage = ({ onAuthSuccess }: AuthPageProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (data: LoginFormData) => {
    setIsLoading(true);
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock successful login
      const user: User = {
        id: '1',
        email: data.email,
        name: 'Admin User',
        role: 'admin',
        createdAt: new Date(),
      };
      
      onAuthSuccess(user);
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (data: Omit<SignupFormData, 'confirmPassword'>) => {
    setIsLoading(true);
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      // Mock successful signup
      const user: User = {
        id: '2',
        email: data.email,
        name: data.name,
        role: 'admin',
        createdAt: new Date(),
      };
      
      onAuthSuccess(user);
    } catch (error) {
      console.error('Signup failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      {isLogin ? (
        <LoginForm
          onLogin={handleLogin}
          onSwitchToSignup={() => setIsLogin(false)}
          isLoading={isLoading}
        />
      ) : (
        <SignupForm
          onSignup={handleSignup}
          onSwitchToLogin={() => setIsLogin(true)}
          isLoading={isLoading}
        />
      )}
    </AuthLayout>
  );
};

export default AuthPage;