import { useState } from 'react'
import './App.css'
import AdminPanel from './components/AdminPanel'
import AuthPage from './components/AuthPage'
import type { User } from './types/Auth'

function App() {
  const [user, setUser] = useState<User | null>(null);

  const handleAuthSuccess = (authenticatedUser: User) => {
    setUser(authenticatedUser);
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (!user) {
    return <AuthPage onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <div className="app">
      <AdminPanel user={user} onLogout={handleLogout} />
    </div>
  )
}

export default App
