import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import Register from './Register';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showRegister, setShowRegister] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      alert('Please fill in both email and password.');
      return;
    }

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      console.log('[DEBUG] Login response:', data);

      if (res.ok) {
        // Store login state
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('user', JSON.stringify(data.user));

        // Call parent onLogin and redirect
        onLogin();
        navigate('/paneloverview');
      } else {
        alert(data.message || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      alert('Something went wrong. Please try again.');
    }
  };

  return (
    <>
      <div className="login-container">
        <div className="login-box">
          <div className="login-header">
            <img src="/cropped-stellar-colored.png" alt="Stellar Logo" className="login-logo" />
            <img src="/eins-logo.png" alt="Eins Logo" className="login-logo" style={{ width: '80px' }} />
          </div>

          <h2 className="login-title">Login to Dashboard</h2>

          <input
            type="email"
            className="login-input"
            placeholder="Input email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            className="login-input"
            placeholder="Enter login password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="login-button" onClick={handleLogin}>
            Login
          </button>
          <button
            className="login-button"
            style={{ backgroundColor: '#6c757d', marginTop: '10px' }}
            onClick={() => setShowRegister(true)}
          >
            Register
          </button>
        </div>
      </div>

      {showRegister && (
        <div className="modal-overlay">
          <div className="modal-content">
            <Register onBack={() => setShowRegister(false)} />
          </div>
        </div>
      )}
    </>
  );
}
