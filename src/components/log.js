import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Log() {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [message, setMessage] = useState(""); // State for displaying messages
  const navigate = useNavigate();

  const updateActiveStatus = async (userId) => {
    try {
      console.log('Updating active status for user:', userId); // Debug log
      const response = await fetch('http://localhost:5000/api/totaluser/active', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          timestamp: Date.now()
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Active status update response:', data); // Debug log
    } catch (error) {
      console.error('Error updating active status:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(""); // Clear any previous messages
    
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const json = await response.json();
      console.log('Login response:', json);

      if (response.ok) {
        localStorage.setItem('token', json.authToken);
        localStorage.setItem('user', JSON.stringify(json.user));
        
        if (json.user && json.user._id) {
          await updateActiveStatus(json.user._id);
          
          const intervalId = setInterval(() => {
            updateActiveStatus(json.user._id);
          }, 60000);

          localStorage.setItem('activeStatusInterval', intervalId);
          localStorage.setItem('userId', json.user._id);
        }
        
        setMessage("Login Successful! Redirecting...");
        alert("Login Successful!");

        setTimeout(() => {
          navigate('/Profile');
        }, 1500);
      } else {
        if (response.status === 403) {
          setMessage(json.message || "Please verify your email first");
          alert(json.message || "Please verify your email first");
          // Optionally redirect to verification page
          // navigate('/verify-email');
        } else {
          setMessage(json.error || 'Invalid credentials');
          alert(json.error || 'Invalid credentials');
        }
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("An error occurred while logging in");
      alert("An error occurred while logging in");
    }
  };

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Log In</h2>
        {message && <p className={`message ${message.includes("Successful") ? "success" : "error"}`}>{message}</p>}
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
          <div className="forgot-password">
            <Link to="/ForgotPassword">Forgot Password?</Link>
          </div>
          <button type="submit" className="login-btn">Log In</button>
        </form>
        <p className="register-link">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
        <p className="register-link">
          <Link to="/adminlog">Login as Admin</Link>
        </p>
      </div>
    </div>
  );
}
