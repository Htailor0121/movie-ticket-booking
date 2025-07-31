import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/');
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  return (
    <div className="custom-navbar">
      <div className="logo" onClick={() => navigate('/')}>
        MovieTicket
      </div>
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/movies">Movies</Link></li>
        {/* <li><Link to="/bookings">Bookings</Link></li> */}
        <li><Link to="/profile">Profile</Link></li>

        {user ? (
          <>
            <li><button onClick={handleLogout} className="nav-button">Logout</button></li>
          </>
        ) : (
          <>
            <li><Link to="/login" className="nav-button">Login</Link></li>
            <li><Link to="/signup" className="nav-button">Sign Up</Link></li>
          </>
        )}
      </ul>
    </div>
  );
};

export default Navbar;
