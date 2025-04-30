import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    if (password.length < 8) {
      setError('Password must be at least 8 characters long. Please enter a stronger password.');
      return false;
    }
    if (!email.includes('@gmail.com')) {
      setError('Please use a Gmail account (@gmail.com) for registration.');
      return false;
    }
    if (phoneNumber.length !== 10) {
      setError('Phone number must be exactly 10 digits long.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    // Clear previous error and start loading state
    setError('');
    setLoading(true);

    const userData = {
      name,
      email,
      password,
      phoneNumber
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
        setError(data.error || data.errors?.[0]?.msg || 'Something went wrong');
        alert(data.error || data.errors?.[0]?.msg || 'Something went wrong');
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
              <label>Phone Number</label>
              <input
                type="tel"
                placeholder="Enter your 10-digit phone number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                pattern="[0-9]{10}"
                maxLength="10"
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
                placeholder="Enter password (minimum 8 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength="8"
                required
              />
              {password.length > 0 && password.length < 8 && (
                <small style={{ color: 'red' }}>Password must be at least 8 characters long</small>
              )}
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
