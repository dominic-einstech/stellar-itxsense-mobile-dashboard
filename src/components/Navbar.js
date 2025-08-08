import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <div className="bottom-navbar">
      <button onClick={() => navigate('/home')}>Home</button>
      <button onClick={() => navigate('/tickets')}>Tickets</button> {/* ✅ FIXED */}
      <button onClick={() => navigate('/account')}>Maintenance</button>
    </div>
  );
}
