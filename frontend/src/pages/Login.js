import React, { useState } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    console.log('Logging in:', username, password);
    navigate('/');
  };

  return (
    <div className="login-wrapper">
      <form className="login-card" onSubmit={handleLogin}>
        <h2>Login</h2>
        <div className="form-group">
          <label>Username*</label>
          <input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Password*</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="login-btn">Login</button>
        <div className="signup-link">
          Don't have an account? <a href="/signup">Sign Up</a>
        </div>
      </form>
    </div>
  );
};

export default Login;
    