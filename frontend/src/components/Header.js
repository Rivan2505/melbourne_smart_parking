import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

const Header = ({onLogout}) => {
  const location = useLocation();
  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      onLogout();
    }
  };
  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <span className="car-icon">🚗</span>
          <span className="logo-text">Melbourne Smart Parking</span>
        </div>
        <nav className="nav-links">
          <Link 
            to="/" 
            className={location.pathname === '/' ? 'active' : ''}
          >
            Home
          </Link>
          <Link 
            to="/data-insights" 
            className={location.pathname === '/data-insights' ? 'active' : ''}
          >
            Data Insights
          </Link>
          <Link 
            to="/real-time-parking" 
            className={location.pathname === '/real-time-parking' ? 'active' : ''}
          >
            Real-time Parking
          </Link>
          <Link 
            to="/eco-commuting" 
            className={location.pathname === '/eco-commuting' ? 'active' : ''}
          >
            Eco Commuting
          </Link>
          <button 
            className="logout-button"
            onClick={handleLogout}
            title="Logout"
          >
            🔓 Logout
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
