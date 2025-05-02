import React, { useState, useEffect } from 'react';
import Sidebar from '../Sidebar';
import '../../CSS/Settings.css';
import { FaTrash, FaRegCalendarAlt, FaChair } from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function Settings() {
  const [holidays, setHolidays] = useState([]);
  const [newHoliday, setNewHoliday] = useState({ date: '', reason: '' });
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [availableSeats, setAvailableSeats] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Fetch holidays
    fetch('http://localhost:5000/api/holidays')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setHolidays(data);
        }
      })
      .catch(err => {
        console.error('Error fetching holidays:', err);
        setError('Failed to fetch holidays');
      });

    // Fetch available seats
    fetch('http://localhost:5000/api/settings/seats')
      .then(res => res.json())
      .then(data => {
        setAvailableSeats(data.seats || 0);
      })
      .catch(err => {
        console.error('Error fetching seats:', err);
        setError('Failed to fetch available seats');
      });

    // Apply theme
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const handleAddHoliday = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    try {
      const response = await fetch('http://localhost:5000/api/holidays', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newHoliday)
      });

      const data = await response.json();
      
      if (response.ok) {
        setHolidays(prev => [...prev, data].sort((a, b) => new Date(a.date) - new Date(b.date)));
        setNewHoliday({ date: '', reason: '' });
        setSuccess('Holiday added successfully');
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.message || 'Failed to add holiday');
      }
    } catch (error) {
      console.error('Error adding holiday:', error);
      setError('Failed to add holiday. Please try again.');
    }
  };

  const handleDeleteHoliday = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/holidays/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setHolidays(prev => prev.filter(holiday => holiday._id !== id));
        setSuccess('Holiday deleted successfully');
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(''), 3000);
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to delete holiday');
      }
    } catch (error) {
      console.error('Error deleting holiday:', error);
      setError('Failed to delete holiday. Please try again.');
    }
  };

  const handleUpdateSeats = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    // Get admin token (fallback to user token if needed)
    const token = localStorage.getItem('admin-token') || localStorage.getItem('token');

    try {
      const response = await fetch('http://localhost:5000/api/settings/seats', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': token
        },
        body: JSON.stringify({ seats: availableSeats })
      });

      const data = await response.json();
      
      if (response.ok) {
        setSuccess('Available seats updated successfully');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.message || 'Failed to update seats');
      }
    } catch (error) {
      console.error('Error updating seats:', error);
      setError('Failed to update seats. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="admin-dashboard-root">
      <Sidebar />
      <div className="admin-main-content">
        <div className="admin-content">
          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}
          
          {/* Seat Management Section */}
          <motion.div 
            className="seats-modern-card"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, type: 'spring' }}
          >
            <motion.div 
              className="seats-modern-icon-bg"
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5, type: 'spring' }}
            >
              <FaChair />
            </motion.div>
            <motion.h2 
              className="seats-modern-title"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              Manage Available Seats
            </motion.h2>
            <form onSubmit={handleUpdateSeats} className="seats-modern-form">
              <label htmlFor="seats" className="seats-modern-label">Number of Available Seats</label>
              <div className="seats-modern-stepper">
                <button type="button" className="seats-stepper-btn" onClick={() => setAvailableSeats(Math.max(0, availableSeats - 1))} disabled={availableSeats <= 0}>-</button>
                <input
                  type="number"
                  id="seats"
                  value={availableSeats}
                  onChange={e => setAvailableSeats(Math.max(0, parseInt(e.target.value) || 0))}
                  min="0"
                  className="seats-modern-input"
                />
                <button type="button" className="seats-stepper-btn" onClick={() => setAvailableSeats(availableSeats + 1)}>+</button>
              </div>
              <motion.button
                type="submit"
                className="seats-modern-btn"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                disabled={isLoading}
              >
                {isLoading ? 'Updating...' : 'Update Seats'}
              </motion.button>
              {success && <div className="alert alert-success" style={{marginTop: 12}}>{success}</div>}
              {error && <div className="alert alert-error" style={{marginTop: 12}}>{error}</div>}
            </form>
          </motion.div>

          {/* Holiday Management Section */}
          <div className="settings-section">
            <form onSubmit={handleAddHoliday} className="holiday-form">
              <div className="form-group">
                <label htmlFor="date">Select Date</label>
                <input
                  type="date"
                  id="date"
                  value={newHoliday.date}
                  onChange={(e) => setNewHoliday({...newHoliday, date: e.target.value})}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="reason">Holiday Reason</label>
                <input
                  type="text"
                  id="reason"
                  value={newHoliday.reason}
                  onChange={(e) => setNewHoliday({...newHoliday, reason: e.target.value})}
                  placeholder="Enter holiday reason"
                  required
                />
              </div>
              <button type="submit">Add Holiday</button>
            </form>

            <div className="holidays-list">
              <h4 className="holidays-title"><FaRegCalendarAlt className="holidays-title-icon" /> Upcoming Holidays</h4>
              {holidays.length === 0 ? (
                <p>No holidays scheduled</p>
              ) : (
                holidays
                  .sort((a, b) => new Date(a.date) - new Date(b.date))
                  .map(holiday => (
                    <div key={holiday._id} className="holiday-card glass-card">
                      <div className="holiday-accent-bar"></div>
                      <div className="holiday-card-left">
                        <span className="holiday-icon"><FaRegCalendarAlt /></span>
                        <div>
                          <span className="holiday-date">{formatDate(holiday.date)}</span>
                          <span className="holiday-reason">{holiday.reason}</span>
                        </div>
                      </div>
                      <button className="delete-btn holiday-delete-btn glass-btn" onClick={() => handleDeleteHoliday(holiday._id)}>
                        <FaTrash />
                        <span className="delete-text">Delete</span>
                      </button>
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
