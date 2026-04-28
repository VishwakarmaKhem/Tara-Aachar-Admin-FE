import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import AdminPanel from './components/AdminPanel';
import AuthPage from './components/AuthPage';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingSpinner from './components/LoadingSpinner';
import { useAuth } from './hooks/useAuth';
import type { User } from './types/Auth';

function App() {
  const { user, isLoading, setUser, logout } = useAuth();

  if (isLoading) {
    return <LoadingSpinner fullScreen message="Restoring session..." />;
  }

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route
            path="/login"
            element={
              !user
                ? <AuthPage onAuthSuccess={(u: User) => setUser(u)} />
                : <Navigate to="/admin" replace />
            }
          />
          <Route
            path="/admin"
            element={
              user
                ? <AdminPanel user={user} onLogout={logout} />
                : <Navigate to="/login" replace />
            }
          />
          <Route
            path="/admin/edit/:productId"
            element={
              user
                ? <AdminPanel user={user} onLogout={logout} />
                : <Navigate to="/login" replace />
            }
          />
          <Route
            path="/"
            element={<Navigate to={user ? '/admin' : '/login'} replace />}
          />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
