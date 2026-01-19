import type { User } from '../types/Product';
import './Header.css';

interface HeaderProps {
  user: User;
  onLogout: () => void;
}

const Header = ({ user, onLogout }: HeaderProps) => {
  return (
    <header className="admin-header">
      <div className="header-content">
        <div className="header-main">
          <h1 className="header-title">🥒 Aachar Admin Panel</h1>
          <p className="header-subtitle">Manage your pickle product catalog</p>
        </div>
        
        <div className="header-user">
          <div className="user-info">
            <div className="user-avatar">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="user-details">
              <span className="user-name">{user.name}</span>
              <span className="user-role">{user.role}</span>
            </div>
          </div>
          
          <button className="logout-btn" onClick={onLogout} title="Logout">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.59L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;