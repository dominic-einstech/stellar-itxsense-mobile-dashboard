import React, { useEffect, useState, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import Tickets from './components/Tickets';
import TicketDetails from './components/TicketDetails';
import Navbar from './components/Navbar';
import './App.css';

// Wrapper to allow hooks outside <Router>
function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();
  const inactivityTimer = useRef(null);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
  };

  // Reset inactivity timer
  const resetTimer = () => {
    if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    inactivityTimer.current = setTimeout(() => {
      if (localStorage.getItem('isLoggedIn') === 'true') {
        alert('You have been logged out due to inactivity.');
        handleLogout();
      }
    }, 5 * 60 * 1000); // 5 minutes
  };

  // Set up activity listeners
  useEffect(() => {
    const activityEvents = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];

    activityEvents.forEach(event =>
      window.addEventListener(event, resetTimer)
    );

    resetTimer(); // start timer on mount

    return () => {
      activityEvents.forEach(event =>
        window.removeEventListener(event, resetTimer)
      );
      if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    };
  }, []);

  // Monitor login state from localStorage
  useEffect(() => {
    const interval = setInterval(() => {
      const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
      setIsLoggedIn(loggedIn);
    }, 200);
    return () => clearInterval(interval);
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
    resetTimer(); // start/reset timer when logged in
  };

  // Hide navbar on login & register pages
  const hideNavbar = location.pathname === '/' || location.pathname === '/register';

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route
          path="/"
          element={
            isLoggedIn ? <Navigate to="/home" replace /> : <Login onLogin={handleLogin} />
          }
        />
        <Route
          path="/register"
          element={<Register onBack={() => window.location.href = '/'} />}
        />
        <Route
          path="/home"
          element={isLoggedIn ? <Home onLogout={handleLogout} /> : <Navigate to="/" replace />}
        />
        <Route
          path="/tickets"
          element={isLoggedIn ? <Tickets /> : <Navigate to="/" replace />}
        />
        <Route
          path="/ticket/:id"
          element={isLoggedIn ? <TicketDetails /> : <Navigate to="/" replace />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default AppWrapper;
