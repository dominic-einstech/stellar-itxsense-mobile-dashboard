import React, { useState } from 'react';
import './Register.css';

export default function Register({ onBack }) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    if (!email || !password || !name) {
      alert('Please fill in all fields.');
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, password }),
      });

      const data = await response.json();
      if (response.ok) {
        alert('✅ Registration successful');
        onBack(); // return to login
      } else {
        alert(data.message || '❌ Registration failed');
      }
    } catch (err) {
      console.error('❌ Registration error:', err);
      alert('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h2 className="register-title">Register New User</h2>

        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="register-input"
        />

        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="register-input"
        />

        <input
          type="password"
          placeholder="Set Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="register-input"
        />

        <button onClick={handleRegister} className="register-button">
          Register
        </button>

        <button
          type="button"
          onClick={() => {
            console.log('Going back to login...');
            onBack();
          }}
          className="register-back"
        >
          Back to Login
        </button>
      </div>
    </div>
  );
}
