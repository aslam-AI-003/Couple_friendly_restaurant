import React, { useState } from 'react';
import './Login.css';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Hardcoded credentials
  const validCredentials = {
    username: 'Couplefriendly',
    password: 'URcouplefriendly'
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    
    if (!username || !password) {
      setError('Please enter username and password');
      return;
    }

    setIsLoading(true);

    // Simulate login delay
    setTimeout(() => {
      if (username.toLowerCase() === validCredentials.username.toLowerCase() && password === validCredentials.password) {
        localStorage.setItem('cf_logged_in', 'true');
        localStorage.setItem('cf_user', username);
        onLogin();
      } else {
        setError('Invalid username or password!');
      }
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="login-page">
      <div className="login-bg">
        <div className="bg-shape shape-1"></div>
        <div className="bg-shape shape-2"></div>
        <div className="bg-shape shape-3"></div>
      </div>

      <div className="login-card">
        <div className="login-header">
          <img src="/logo.png" alt="Couple Friendly Hub" className="login-logo-img" />
          <h1>Couple Friendly Hub</h1>
          <p>POS & Billing System</p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="login-input">
            <span className="login-icon">👤</span>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => {
                const val = e.target.value.replace(/[^a-zA-Z]/g, '');
                setUsername(val);
              }}
              autoComplete="off"
            />
          </div>

          <div className="login-input">
            <span className="login-icon">🔒</span>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="off"
            />
          </div>

          {error && (
            <div className="login-error">
              <span>⚠️</span> {error}
            </div>
          )}

          <button 
            type="submit" 
            className="login-btn"
            disabled={isLoading}
          >
            {isLoading ? '🔄 Logging in...' : '🚀 Login'}
          </button>
        </form>

        <div className="login-footer">
          <p>© 2026 Couple Friendly Hub. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
