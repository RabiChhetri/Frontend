import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Bookinglist.css';

export default function Bookinglist() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelPhoneNumber, setCancelPhoneNumber] = useState('');
  const [cancelMessage, setCancelMessage] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  const checkAuthAndBook = () => {
    if (!isAuthenticated) {
      alert('Please log in to book an appointment. You will be redirected to the login page.');
      // You can add navigation to login page here if needed
      return false;
    }
    return true;
  };

  const handleCancelClick = (booking) => {
    setSelectedBooking(booking);
    setCancelPhoneNumber(booking.phoneNumber || '');
    setShowCancelModal(true);
  };

  const handleCancelAppointment = async () => {
    if (!cancelPhoneNumber) {
      setCancelMessage('Please enter your phone number');
      return;
    }

    try {
      const response = await axios.delete('http://localhost:5000/api/book/cancel', {
        data: { phoneNumber: cancelPhoneNumber }
      });

      if (response.data.success) {
        setCancelMessage('Appointment cancelled successfully');
        setShowCancelModal(false);
        setCancelPhoneNumber('');
        setSelectedBooking(null);
        // Refresh the bookings list
        fetchBookings();
      }
    } catch (error) {
      setCancelMessage(error.response?.data?.message || 'Failed to cancel appointment');
    }
  };

  const formatServiceName = (service) => {
    const serviceMap = {
      'haircut': 'HairCut (Rs.200)',
      'shaving': 'Shaving (Rs.150)',
      'haircut_shaving': 'HairCut and Shaving (Rs.250)',
      'hair_color': 'Hair Color (Rs.500)',
      'haircut_wash': 'HairCut and Wash (Rs.350)'
    };
    return serviceMap[service] || service;
  };

  const calculateCompletionTime = (service, appointmentTime) => {
    const serviceDurations = {
      'haircut': 30, // minutes
      'shaving': 15,
      'haircut_shaving': 45,
      'hair_color': 60,
      'haircut_wash': 40
    };

    const duration = serviceDurations[service] || 30;
    const [hours, minutes] = appointmentTime.split(':');
    const date = new Date();
    date.setHours(parseInt(hours));
    date.setMinutes(parseInt(minutes));
    date.setMinutes(date.getMinutes() + duration);
    
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateString) => {
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const handleBooking = async (bookingData) => {
    // Check authentication before proceeding with booking
    if (!checkAuthAndBook()) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post("http://localhost:5000/api/book", bookingData, {
        headers: {
          'auth-token': token
        }
      });
      // Handle successful booking
      alert('Appointment booked successfully!');
      // Refresh the bookings list
      fetchBookings();
    } catch (error) {
      console.error("Error booking appointment", error);
      alert(error.response?.data?.error || 'Failed to book appointment');
    }
  };

  const fetchBookings = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/book");
      setBookings(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching bookings", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  if (loading) return (
    <div className="loading-container">
      <p className="loading-text">Loading appointments...</p>
    </div>
  );

  return (
    <div className="booking-list-container">
      <div className="booking-list-header">
        <h1 className="booking-list-title">Today's Schedule</h1>
        <div className="booking-stats">
          <span className="total-bookings">{bookings.length} appointments</span>
        </div>
      </div>
      
      {showCancelModal && (
        <div className="cancel-modal">
          <div className="cancel-modal-content">
            <h3>Cancel Appointment</h3>
            <p>Please confirm to cancel your appointment</p>
            <input
              type="text"
              placeholder="Enter your phone number"
              value={cancelPhoneNumber}
              onChange={(e) => setCancelPhoneNumber(e.target.value)}
              maxLength="10"
              pattern="[0-9]{10}"
            />
            {cancelMessage && (
              <p className={`cancel-message ${cancelMessage.includes('successfully') ? 'success' : 'error'}`}>
                {cancelMessage}
              </p>
            )}
            <div className="cancel-modal-buttons">
              <button onClick={handleCancelAppointment}>Cancel Appointment</button>
              <button onClick={() => {
                setShowCancelModal(false);
                setCancelPhoneNumber('');
                setCancelMessage('');
                setSelectedBooking(null);
              }}>Close</button>
            </div>
          </div>
        </div>
      )}
      
      {bookings.length === 0 ? (
        <div className="no-appointments">
          <p>No appointments scheduled for today</p>
        </div>
      ) : (
        <div className="booking-cards">
          {bookings.map((booking) => (
            <div key={booking._id} className="booking-card">
              <div className="booking-card-header">
                <div className="booking-header-content">
                  <h2 className="booking-name">👤 {booking.fullName}</h2>
                  <p className="booking-phone">{booking.phoneNumber}</p>
                  <p className="booking-date">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M6.75 2.5A.75.75 0 017.5 1.75h9a.75.75 0 010 1.5h-9A.75.75 0 016.75 2.5zM4 5.75A.75.75 0 014.75 5h14.5a.75.75 0 010 1.5H4.75A.75.75 0 014 5.75zM1 8.75A.75.75 0 011.75 8h20.5a.75.75 0 010 1.5H1.75A.75.75 0 011 8.75zM1.75 12a.75.75 0 000 1.5h20.5a.75.75 0 000-1.5H1.75z"/>
                    </svg>
                    {formatDate(booking.date)}
                  </p>
                </div>
              </div>

              <div className="booking-details">
                <div className="booking-service">
                  {formatServiceName(booking.service)}
                </div>

                <div className="booking-time-info">
                  <div className="time-block">
                    <span className="time-value">{booking.time}</span>
                    <span className="time-label">Appointment Time</span>
                  </div>
                  <div className="time-block">
                    <span className="time-value">{calculateCompletionTime(booking.service, booking.time)}</span>
                    <span className="time-label">Completion Time</span>
                  </div>
                </div>

                <button 
                  className="card-cancel-btn"
                  onClick={() => handleCancelClick(booking)}
                >
                  Cancel Appointment
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
