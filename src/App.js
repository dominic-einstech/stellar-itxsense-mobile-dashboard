import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import Tickets from './components/Tickets'; // ✅ Import your tickets page
import Navbar from './components/Navbar';
import './App.css';

// Wrapper to use hooks outside <Router>
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

  useEffect(() => {
    const interval = setInterval(() => {
      const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
      setIsLoggedIn(loggedIn);
    }, 200);
    return () => clearInterval(interval);
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
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
        {/* ✅ New Tickets page */}
        <Route
          path="/tickets"
          element={isLoggedIn ? <Tickets /> : <Navigate to="/" replace />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default AppWrapper;
