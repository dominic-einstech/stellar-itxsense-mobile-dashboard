import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

export default function Home({ onLogout }) {

  const [busStopCode, setBusStopCode] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    alert(`Searching for Bus Stop: ${busStopCode}`);
  };

  const handleReset = () => {
    setBusStopCode('');
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div className="home-container">
      {/* Logout Button */}
      <div className="logout-bar">
        <button className="logout-btn" onClick={onLogout}>Logout</button>

      </div>

      <h1 className="home-title">OVERVIEW</h1>
      <p className="home-timestamp">{new Date().toLocaleString()}</p>

      <div className="home-grid">
        <div className="home-card">
          <h3>Total Screens</h3>
          <p className="home-value">171</p>
        </div>
        <div className="home-card">
          <h3>Total Panels</h3>
          <p className="home-value">160</p>
        </div>
        <div className="home-card small">
          <h3>Digital Panels</h3>
          <p className="home-value">10</p>
        </div>
        <div className="home-card small">
          <h3>Hybrid Panels</h3>
          <p className="home-value">150</p>
        </div>
        <div className="home-card small">
          <h3>Software Reports</h3>
          <p className="home-value">5</p>
        </div>
        <div className="home-card small">
          <h3>Hardware Reports</h3>
          <p className="home-value">11</p>
        </div>
      </div>

      <div className="search-section">
        <input
          type="text"
          placeholder="Enter Bus Stop Number"
          value={busStopCode}
          onChange={(e) => setBusStopCode(e.target.value)}
        />
        <button className="btn search-btn" onClick={handleSearch}>Search</button>
        <button className="btn reset-btn" onClick={handleReset}>Reset</button>
      </div>

      <div className="results-section">
        <h2>Search Results</h2>
        <p>FSAP details and navigation will appear here.</p>
      </div>
    </div>
  );
}
