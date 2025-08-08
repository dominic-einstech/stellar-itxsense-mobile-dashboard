import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import Navigation from './Navigation';

export default function Home({ onLogout }) {
  const [busStopCode, setBusStopCode] = useState('');
  const [totalScreens, setTotalScreens] = useState(0);
  const [totalPanels, setTotalPanels] = useState(0);
  const [digitalPanels, setDigitalPanels] = useState(0);
  const [hybridPanels, setHybridPanels] = useState(0);
  const [searchResult, setSearchResult] = useState(null);

  const resultsRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPanelData = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/api/panel-docs?page=1&pageSize=all&type=All&search=`
        );
        if (!response.ok) throw new Error('Failed to fetch panels');

        const data = await response.json();

        const panels = (data.data || []).filter(panel => {
          const viewerId = panel["Viewer ID"];
          return viewerId && viewerId.trim() !== '';
        });

        let screenCount = 0;
        let digitalCount = 0;
        let hybridCount = 0;

        panels.forEach(panel => {
          const type = panel["Panel Type"]?.toLowerCase();
          if (type === 'digital') {
            digitalCount++;
            screenCount += 2;
          } else if (type === 'hybrid') {
            hybridCount++;
            screenCount += 1;
          }
        });

        setTotalScreens(screenCount);
        setTotalPanels(panels.length);
        setDigitalPanels(digitalCount);
        setHybridPanels(hybridCount);
      } catch (error) {
        console.error('Error fetching panel data:', error);
      }
    };

    fetchPanelData();
  }, []);

  const handleSearch = async () => {
    if (!busStopCode.trim()) return alert('Please enter a Bus Stop Code');

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/panel-docs?page=1&pageSize=all&type=All&search=${busStopCode}`
      );
      if (!response.ok) throw new Error('Failed to fetch search result');

      const data = await response.json();
      if (!data.data.length) {
        alert('No results found');
        return;
      }

      setSearchResult(data.data[0]); // store full object
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (error) {
      console.error('Error searching:', error);
    }
  };

  const handleReset = () => {
    setBusStopCode('');
    setSearchResult(null);
  };

  const handleLogoutClick = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div className="home-container">
      {/* Header */}
      <div className="home-header">
        <div className="home-logos">
          <img src="/cropped-stellar-colored.png" alt="Stellar Logo" className="logo" />
          <img src="/eins-logo.png" alt="Eins Logo" className="logo" />
        </div>
        <div className="home-title-container">
          <h1 className="home-title">FSAP Condition Monitoring</h1>
        </div>
      </div>

      {/* Logout button */}
      <div className="logout-bar">
        <button className="logout-btn" onClick={onLogout || handleLogoutClick}>Logout</button>
      </div>

      {/* Overview section */}
      <h1 className="home-section-title">OVERVIEW</h1>
      <p className="home-timestamp">{new Date().toLocaleString()}</p>

      <div className="home-grid">
        <div className="home-card">
          <h3>Total Screens</h3>
          <p className="home-value">{totalScreens}</p>
        </div>
        <div className="home-card">
          <h3>Total Panels</h3>
          <p className="home-value">{totalPanels}</p>
        </div>
        <div className="home-card small">
          <h3>Digital Panels</h3>
          <p className="home-value">{digitalPanels}</p>
        </div>
        <div className="home-card small">
          <h3>Hybrid Panels</h3>
          <p className="home-value">{hybridPanels}</p>
        </div>
      </div>

      {/* Search section */}
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

      {/* Results section */}
      {searchResult && (
        <div ref={resultsRef} className="results-section">
          <Navigation searchResult={searchResult} />
        </div>
      )}
    </div>
  );
}
