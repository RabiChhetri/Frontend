import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Adminlog.css';

export default function Adminlog() {
  const [credentials, setCredentials] = useState({ name: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: credentials.name,
          password: credentials.password
        })
      });

      const json = await response.json();

      if (json.success) {
        // Save the auth token and admin info
        localStorage.setItem('admin-token', json.authToken);
        localStorage.setItem('adminName', json.admin.name);
        localStorage.setItem('adminRole', 'admin');
        
        // Set the auth-token header for future requests
        localStorage.setItem('auth-token', json.authToken);
        
        navigate('/admin/Analytics');
      } else {
        setError(json.error || 'Invalid credentials');
      }
    } catch (error) {
      setError('Something went wrong. Please try again.');
      console.error('Error:', error);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Admin Log In</h1>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              value={credentials.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={credentials.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="login-button">
            Log In
          </button>
        </form>
        <div className="login-footer">
          <p>Don't have an account for Customer? <Link to="/register">Register</Link></p>
        </div>
      </div>
    </div>
  );
}
