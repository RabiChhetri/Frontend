import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phoneNumber: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();

  // Destructure formData for easier access
  const { name, email, password, phoneNumber } = formData;

  const validateForm = () => {
    if (!name || !email || !password || !phoneNumber) {
      setError('All fields are required');
      return false;
    }
    if (phoneNumber.length !== 10) {
      setError('Phone number must be 10 digits');
      return false;
    }
    if (password.length < 5) {
      setError('Password must be at least 5 characters');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setShowOtpInput(true);
        alert('Registration successful! Please check your email for OTP verification.');
      } else {
        if (data.error && data.error.includes('E11000 duplicate key error')) {
          if (data.error.includes('phoneNumber')) {
            setError('This phone number is already registered. Please use a different number.');
          } else if (data.error.includes('email')) {
            setError('This email is already registered. Please use a different email.');
          } else {
            setError('This information is already registered.');
          }
        } else {
          setError(data.error || data.errors?.[0]?.msg || 'Registration failed. Please try again.');
        }
      }
    } catch (err) {
      setError('Error connecting to the server. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Email verified successfully! You can now login.');
        navigate('/log');
      } else {
        setError(data.error || 'Invalid OTP');
      }
    } catch (err) {
      setError('Error verifying OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/resend-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('New OTP sent to your email!');
      } else {
        setError(data.error || 'Error sending OTP');
      }
    } catch (err) {
      setError('Error sending OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="register-container">
        <div className="register-form">
          <h2>Register Now</h2>
          {error && <p className="error-message">{error}</p>}
          {!showOtpInput ? (
            <form onSubmit={handleSubmit}>
              <div className="register-input-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="register-input-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  placeholder="Enter your 10-digit phone number"
                  value={phoneNumber}
                  onChange={handleChange}
                  pattern="[0-9]{10}"
                  maxLength="10"
                  required
                />
              </div>
              <div className="register-input-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="register-input-group">
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder="Enter password (minimum 8 characters)"
                  value={password}
                  onChange={handleChange}
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
          ) : (
            <form onSubmit={handleOtpSubmit}>
              <div className="register-input-group">
                <label>Enter OTP</label>
                <input
                  type="text"
                  placeholder="Enter OTP sent to your email"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
              </div>
              <button className="register-btn" type="submit" disabled={loading}>
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>
              <button
                type="button"
                className="register-btn"
                onClick={handleResendOtp}
                disabled={loading}
                style={{ marginTop: '10px' }}
              >
                Resend OTP
              </button>
            </form>
          )}
          <p className="register-link">
            Already have an account? <Link to="/log">Log In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
