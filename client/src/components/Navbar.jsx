import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Code, User, Bell, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showSettings, setShowSettings] = React.useState(false);
  const isWorkspace = location.pathname.startsWith('/problem/');

  const handleAction = (type) => {
    alert(`${type} feature coming soon!`);
  };

  const handleLogout = () => {
    logout();
    setShowSettings(false);
    navigate('/login');
  };

  return (
    <nav className={`navbar ${isWorkspace ? 'workspace-navbar' : ''}`}>
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <Code size={28} className="logo-icon" />
          <span>PrepStack</span>
        </Link>
        
        {!isWorkspace && (
          <>
            <div className="nav-links">
              <Link to="/problems" className="nav-link">Problems</Link>
              <Link to="/explore" className="nav-link">Explore</Link>
            </div>

            <div className="nav-actions">
              <button className="nav-btn" onClick={() => handleAction('Notifications')}><Bell size={20} /></button>
              
              <div className="settings-wrapper">
                <button className="nav-btn" onClick={() => setShowSettings(!showSettings)}>
                  <Settings size={20} />
                </button>
                {showSettings && (
                  <div className="settings-dropdown glass">
                    <div className="dropdown-header">Settings</div>
                    <button className="dropdown-item" onClick={() => handleAction('Profile')}>Profile</button>
                    <button className="dropdown-item" onClick={() => handleAction('Preferences')}>Preferences</button>
                    {user && (
                      <button className="dropdown-item logout" onClick={handleLogout}>
                        <LogOut size={16} /> Logout
                      </button>
                    )}
                  </div>
                )}
              </div>
              
              {user ? (
                <div className="user-profile">
                  <span className="username-tag">{user.username}</span>
                </div>
              ) : (
                <div className="auth-links">
                  <Link to="/login" className="nav-link">Login</Link>
                  <Link to="/register" className="nav-btn register-link-btn">Register</Link>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
