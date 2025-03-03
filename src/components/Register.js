import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous error and start loading state
    setError('');
    setLoading(true);

    const userData = {
      name,
      email,
      password,
    };

    try {
      const response = await fetch('http://localhost:5000/api/signuser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      // If registration is successful, handle it
      if (response.ok) {
        alert('Registration successful! Redirecting to login page...');
        navigate('/log');  // Redirect to login page

      } else {
        // If there's an error in registration, show error message
        setError(data.error || 'Something went wrong');
        alert(data.error || 'Something went wrong');
      }

    } catch (err) {
      // Catch error if unable to connect to the server
      setError('Error connecting to the server');
      alert('Error connecting to the server');
    } finally {
      // Always set loading to false regardless of success or failure
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="register-container">
        <div className="register-form">
          <h2>Register Now</h2>
          {error && <p className="error-message">{error}</p>}
          <form onSubmit={handleSubmit}>
            <div className="register-input-group">
              <label>Full Name</label>
              <input
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="register-input-group">
              <label>Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="register-input-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button className="register-btn" type="submit" disabled={loading}>
              {loading ? 'Registering...' : 'Sign Up'}
            </button>
          </form>
          <p className="register-link">
            Already have an account? <Link to="/log">Log In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
