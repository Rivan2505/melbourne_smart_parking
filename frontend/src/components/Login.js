import React, { useState } from 'react';
import './Login.css';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Static credentials
  const ADMIN_USERNAME = 'admin';
  const ADMIN_PASSWORD = 'admin';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Add a small delay for better UX
    setTimeout(() => {
      if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        // Store authentication in localStorage
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('loginTime', new Date().getTime().toString());
        onLogin(true);
      } else {
        setError('Invalid username or password. Please try again.');
        setPassword(''); // Clear password on error
      }
      setLoading(false);
    }, 800);
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
    if (error) setError(''); // Clear error when user starts typing
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (error) setError(''); // Clear error when user starts typing
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Secure Access Portal</h1>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              className={`form-input ${error ? 'error' : ''}`}
              value={username}
              onChange={handleUsernameChange}
              placeholder="Enter User Name"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              className={`form-input ${error ? 'error' : ''}`}
              value={password}
              onChange={handlePasswordChange}
              placeholder="Enter Password"
              required
              disabled={loading}
            />
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <button 
            type="submit" 
            className="signin-button"
            disabled={loading || !username || !password}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;