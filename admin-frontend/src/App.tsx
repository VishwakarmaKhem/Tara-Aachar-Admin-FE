import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import AdminPanel from './components/AdminPanel'
import AuthPage from './components/AuthPage'
import type { User } from './types/Auth'
import { getToken, getEmail, isAuthenticated, logout } from './services/authService'

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session from cookies on mount / reload
  useEffect(() => {
    const token = getToken();
    const email = getEmail();

    if (token && email && isAuthenticated()) {
      const restoredUser: User = {
        id: email.split('@')[0],
        email: email,
        name: email.split('@')[0],
        role: 'admin',
        createdAt: new Date(),
      };
      setUser(restoredUser);
    }
    setIsLoading(false);
  }, []);

  const handleAuthSuccess = (authenticatedUser: User) => {
    console.log('Auth success - setting user:', authenticatedUser);
    setUser(authenticatedUser);
  };

  const handleLogout = () => {
    console.log('Logging out user');
    logout();
    setUser(null);
  };

  if (isLoading) {
    return null; // or a loading spinner
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/login" 
          element={!user ? <AuthPage onAuthSuccess={handleAuthSuccess} /> : <Navigate to="/admin?view=list" replace />} 
        />
        <Route 
          path="/admin" 
          element={user ? <AdminPanel user={user} onLogout={handleLogout} /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/admin/edit/:productId" 
          element={user ? <AdminPanel user={user} onLogout={handleLogout} /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/" 
          element={<Navigate to={user ? "/admin?view=list" : "/login"} replace />} 
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
