import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import '../CSS/Bookinglist.css';
import { useNavigate } from 'react-router-dom';

export default function Bookinglist() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelPassword, setCancelPassword] = useState('');
  const [cancelMessage, setCancelMessage] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [currentViewDate, setCurrentViewDate] = useState(new Date());
  const [services, setServices] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
    // Fetch services from backend
    axios.get('http://localhost:5000/api/services')
      .then(res => setServices(res.data))
      .catch(() => setServices([]));
  }, []);

  const handleCancelClick = (booking) => {
    if (!isAuthenticated) {
      alert('Please log in to cancel appointments');
      navigate('/log');
      return;
    }

    // Prevent cancellation if appointment is completed
    if (booking.completed) {
      alert('Cannot cancel a completed appointment');
      return;
    }

    setSelectedBooking(booking);
    setCancelPassword('');
    setCancelMessage('');
    setShowCancelModal(true);
  };

  // Update the handleCancelAppointment function
  const handleCancelAppointment = async () => {
    if (!cancelPassword) {
      setCancelMessage('Please enter your login password');
      return;
    }
  
    if (!selectedBooking) {
      setCancelMessage('No appointment selected');
      return;
    }
  
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`http://localhost:5000/api/book/${selectedBooking._id}`, {
        headers: {
          'auth-token': token
        }
      });
  
      if (response.data.message === "Booking cancelled successfully") {
        // Show different messages based on payment type
        let cancelMessage = '';
        if (response.data.paymentType === 'partial') {
          cancelMessage = 'Appointment cancelled successfully. No refund will be issued for partial payments.';
        } else if (response.data.refundAmount) {
          cancelMessage = `Appointment cancelled successfully. A refund of Rs.${response.data.refundAmount.toFixed(2)} (70%) will be processed to your original payment method.`;
        } else {
          cancelMessage = 'Appointment cancelled successfully.';
        }
        
        setCancelMessage(cancelMessage);
        setTimeout(() => {
          setShowCancelModal(false);
          setCancelPassword('');
          setSelectedBooking(null);
          // Refresh the bookings list
          fetchBookings();
        }, 5000); // Show message for 5 seconds
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to cancel appointment';
      setCancelMessage(errorMessage);
    }
  };

  // Update the cancel modal to include payment type specific information
  {showCancelModal && (
    <div className="cancel-modal">
      <div className="cancel-modal-content">
        <h3>Cancel Appointment</h3>
        <p>Please enter your login password to cancel the appointment</p>
        <div className="refund-policy-info">
          {selectedBooking?.paymentType === 'partial' ? (
            <p><strong>Cancellation Policy:</strong> No refund will be issued for partial payments.</p>
          ) : (
            <p><strong>Refund Policy:</strong> You will receive 70% of your payment as refund. 30% will be retained by the salon.</p>
          )}
        </div>
        <input
          type="password"
          placeholder="Enter your login password"
          value={cancelPassword}
          onChange={(e) => setCancelPassword(e.target.value)}
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
            setCancelPassword('');
            setCancelMessage('');
            setSelectedBooking(null);
          }}>Close</button>
        </div>
      </div>
    </div>
  )}
  
  // Helper to get service object by id
  const getServiceById = (id) => services.find(s => s._id === id) || {};

  const formatServiceName = (serviceId) => {
    const service = getServiceById(serviceId);
    return service.name && service.price ? `${service.name} (Rs.${service.price})` : serviceId;
  };

  const calculateCompletionTime = (serviceId, appointmentTime) => {
    const service = getServiceById(serviceId);
    let duration = 30;
    if (service.duration) {
      if (service.duration.includes('min')) {
        duration = parseInt(service.duration);
      } else if (service.duration.includes('hr')) {
        duration = parseInt(service.duration) * 60;
      }
    }
    // Parse the appointment time properly
    const [time, period] = appointmentTime.split(' ');
    const [hours, minutes] = time.split(':');
    let hour = parseInt(hours);
    if (period && period.toUpperCase() === 'PM' && hour !== 12) {
      hour += 12;
    } else if (period && period.toUpperCase() === 'AM' && hour === 12) {
      hour = 0;
    }
    const date = new Date();
    date.setHours(hour);
    date.setMinutes(parseInt(minutes));
    date.setMinutes(date.getMinutes() + duration);
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
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

  const isWithinBookingHours = () => {
    const now = new Date();
    const currentHour = now.getHours();
    return currentHour >= 8 && currentHour < 20; // 8 AM to 8 PM
  };

  // Convert time string to Date object for sorting
  const timeStringToDate = (timeStr, dateStr) => {
    const [time, period] = timeStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    if (period.toUpperCase() === 'PM' && hours !== 12) hours += 12;
    if (period.toUpperCase() === 'AM' && hours === 12) hours = 0;
    const date = new Date(dateStr);
    date.setHours(hours, minutes, 0, 0);
    return date;
  };

  // Sort bookings by time
  const sortBookings = useCallback((bookingsArray) => {
    return [...bookingsArray].sort((a, b) => {
      const dateA = timeStringToDate(a.time, a.date);
      const dateB = timeStringToDate(b.time, b.date);
      return dateA - dateB;
    });
  }, []);

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      const now = new Date();
      let targetDate = new Date(now);

      // If current time is after 8 PM (20:00), show tomorrow's appointments
      if (now.getHours() >= 20) {
        targetDate.setDate(targetDate.getDate() + 1);
      }

      const dateParam = targetDate.toISOString().split('T')[0];
      const res = await axios.get(`http://localhost:5000/api/book?date=${dateParam}`);
      // Sort the bookings before setting state
      const sortedBookings = sortBookings(res.data);
      setBookings(sortedBookings);
      setCurrentViewDate(targetDate);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching bookings", error);
      setLoading(false);
    }
  }, [sortBookings]);

  useEffect(() => {
    fetchBookings(); // Initial fetch

    // Set up interval to check and update appointments
    const interval = setInterval(() => {
      const now = new Date();
      const currentHour = now.getHours();
      
      // Refresh at 8 PM to switch to next day's appointments
      if (currentHour === 20 && now.getMinutes() === 0) {
        fetchBookings();
      }
      
      // Also refresh every 5 minutes to keep appointments up to date
      fetchBookings();
    }, 5 * 60 * 1000); // Check every 5 minutes

    return () => clearInterval(interval);
  }, [fetchBookings]);

  const shouldDisplayAppointment = (booking) => {
    const now = new Date();
    const bookingDate = new Date(booking.date);
    const currentHour = now.getHours();
    
    // Don't show completed appointments
    if (booking.completed) {
      return false;
    }
    
    // After 8 PM, only show tomorrow's appointments
    if (currentHour >= 20) {
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      return bookingDate.toDateString() === tomorrow.toDateString();
    }
    
    // During business hours (8 AM - 8 PM), show today's appointments
    return bookingDate.toDateString() === now.toDateString();
  };

  if (loading) return (
    <div className="loading-container">
      <p className="loading-text">Loading appointments...</p>
    </div>
  );

  return (
    <div className="booking-list-container">
      <div className="booking-list-header">
        <h1 className="booking-list-title">
          {isWithinBookingHours() 
            ? `Today's Schedule (${formatDate(currentViewDate)})` 
            : `Tomorrow's Schedule (${formatDate(currentViewDate)})`
          }
        </h1>
        <div className="booking-stats">
          <span className="total-bookings">
            {bookings.filter(shouldDisplayAppointment).length} appointments
          </span>
        </div>
      </div>
      
      {showCancelModal && (
        <div className="cancel-modal">
          <div className="cancel-modal-content">
            <h3>Cancel Appointment</h3>
            <p>Please enter your login password to cancel the appointment</p>
            <input
              type="password"
              placeholder="Enter your login password"
              value={cancelPassword}
              onChange={(e) => setCancelPassword(e.target.value)}
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
                setCancelPassword('');
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
          {bookings
            .filter(shouldDisplayAppointment)
            .map((booking) => (
              <div key={booking._id} className="booking-card">
                <div className="booking-card-header">
                  <div className="booking-header-content">
                    <h2 className="booking-name">👤 {booking.fullName}</h2>
                    {/* <p className="booking-phone">{booking.phoneNumber}</p> */}
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
                  <div className="booking-seat-info">
                    <span className="seat-label">Seat {booking.seatNumber}</span>
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
