import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Log() {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [message, setMessage] = useState(""); // State for displaying messages
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/auth', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const json = await response.json();

      if (response.ok) {
        localStorage.setItem('token', json.authToken);
        alert("Login Successful!"); // Show alert on successful login
        setMessage("Login Successful! Redirecting...");

        setTimeout(() => {
          navigate('/Profile'); // Redirect to Booking.js
        }, 1500);
      } else {
        alert(json.error || 'Invalid credentials'); // Show alert for errors
        setMessage(json.error || 'Invalid credentials');
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while logging in"); // Show alert if there's an error
      setMessage("An error occurred while logging in");
    }
  };

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Log In</h2>
        {message && <p className="message">{message}</p>} {/* Display success/error message */}
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email</label>
            <input 
              type="email" 
              name="email"
              value={credentials.email}
              onChange={onChange}
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input 
              type="password"
              name="password"
              value={credentials.password}
              onChange={onChange}
              placeholder="Enter your password"
              required
            />
          </div>
          <button type="submit" className="login-btn">Log In</button>
        </form>
        <p className="register-link">
          Don't have an account? <Link to="/register">Register</Link>
        </p>

        <p className="register-link">
          <Link to="/adminlog"> Login as Adim</Link>
        </p>
      </div>
    </div>
  );
}
