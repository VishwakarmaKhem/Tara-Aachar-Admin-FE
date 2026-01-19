import { ReactNode } from 'react';
import './AuthLayout.css';

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="auth-layout">
      <div className="auth-background">
        <div className="auth-overlay"></div>
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
          <div className="shape shape-4"></div>
          <div className="shape shape-5"></div>
        </div>
      </div>
      
      <div className="auth-container">
        <div className="auth-brand">
          <div className="brand-icon">🥒</div>
          <h1 className="brand-title">Aachar Admin</h1>
          <p className="brand-subtitle">Manage your pickle empire</p>
        </div>
        
        <div className="auth-content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;