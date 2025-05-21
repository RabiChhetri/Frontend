import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../CSS/Book.css';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

// Initialize Stripe with your publishable key
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);
// Payment Form Component
const PaymentForm = ({ amount, bookingId, onSuccess, onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!stripe || !elements) {
      setLoading(false);
      return;
    }

    try {
      // Get client secret
      const response = await fetch('http://localhost:5000/api/payment/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': localStorage.getItem('token')
        },
        body: JSON.stringify({ bookingId, amount })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Payment intent error response:', errorText);
        throw new Error('Failed to create payment');
      }

      const data = await response.json();

      // Confirm payment
      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: 'Customer Name', // You could pass the customer name here
          },
        },
      });

      if (result.error) {
        throw new Error(result.error.message);
      }

      if (result.paymentIntent.status === 'succeeded') {
        // Record payment success in backend
        await fetch('http://localhost:5000/api/payment/payment-success', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'auth-token': localStorage.getItem('token')
          },
          body: JSON.stringify({
            bookingId,
            paymentIntentId: result.paymentIntent.id
          })
        });

        onSuccess();
      }
    } catch (err) {
      console.error('Payment error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="payment-form">
      <h3>Payment Details</h3>
      <p>Amount: Rs.{amount}</p>
      
      <div className="card-element-container">
        <CardElement options={{
          style: {
            base: {
              fontSize: '16px',
              color: '#424770',
              '::placeholder': {
                color: '#aab7c4',
              },
            },
            invalid: {
              color: '#9e2146',
            },
          },
        }} />
      </div>
      
      {error && <div className="payment-error">{error}</div>}
      
      <div className="payment-buttons">
        <button type="button" onClick={onCancel} disabled={loading}>Cancel</button>
        <button type="submit" disabled={!stripe || loading}>
          {loading ? 'Processing...' : 'Pay Now'}
        </button>
      </div>
    </form>
  );
};

export default function Booking() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    date: '',
    time: '',
    service: 'default',
    seatNumber: '1',
  });
  const [services, setServices] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const [message, setMessage] = useState('');
  const [showAuthAlert, setShowAuthAlert] = useState(false);
  const [showHolidayAlert, setShowHolidayAlert] = useState(false);
  const [holidayAlertMessage, setHolidayAlertMessage] = useState('');
  const [availableSeats, setAvailableSeats] = useState(2);
  
  // Add these new states for payment
  const [showPayment, setShowPayment] = useState(false);
  const [bookingId, setBookingId] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setShowAuthAlert(true);
      setTimeout(() => {
        navigate('/log');
      }, 2000);
    }
    // Fetch services from backend
    fetch('http://localhost:5000/api/services')
      .then(res => res.json())
      .then(data => setServices(data))
      .catch(() => setServices([]));

    // Fetch holidays and show alert for upcoming holidays
    fetch('http://localhost:5000/api/holidays')
      .then(res => res.json())
      .then(data => {
        setHolidays(data);
        
        // Check for upcoming holidays
        const upcomingHolidays = data.filter(holiday => {
          const holidayDate = new Date(holiday.date);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          return holidayDate >= today;
        });

        if (upcomingHolidays.length > 0) {
          const holidayMessages = upcomingHolidays
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .map(holiday => {
              const date = new Date(holiday.date).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              });
              return `${date}: ${holiday.reason}`;
            })
            .join('\n');
          
          setHolidayAlertMessage(holidayMessages);
          setShowHolidayAlert(true);
        }
      })
      .catch(() => setHolidays([]));

    // Fetch available seats from backend
    fetch('http://localhost:5000/api/settings/seats')
      .then(res => res.json())
      .then(data => {
        if (data && data.seats) setAvailableSeats(data.seats);
      })
      .catch(() => setAvailableSeats(2));
  }, [navigate]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    const token = localStorage.getItem('token');
    if (!token) {
      setShowAuthAlert(true);
      setTimeout(() => {
        navigate('/log');
      }, 2000);
      return;
    }

    // Check if selected date is a holiday
    const selectedDate = new Date(formData.date);
    const holiday = holidays.find(holiday => {
      const holidayDate = new Date(holiday.date);
      return holidayDate.toDateString() === selectedDate.toDateString();
    });

    if (holiday) {
      setMessage(`Sorry, we are closed on this date. Reason: ${holiday.reason}`);
      return;
    }

    if (formData.service === 'default') {
      setMessage('Please select a service.');
      return;
    }

    // Format time to HH:MM AM/PM
    const time24 = formData.time;
    const [hours, minutes] = time24.split(':');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const hour12 = (hours % 12 || 12).toString().padStart(2, '0');
    const formattedTime = `${hour12}:${minutes} ${ampm}`;

    try {
      const response = await fetch('http://localhost:5000/api/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': token
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          phoneNumber: formData.phoneNumber,
          date: formData.date,
          time: formattedTime,
          service: formData.service,
          seatNumber: formData.seatNumber,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        // Instead of showing success message, show payment form
        const selectedService = services.find(s => s._id === formData.service);
        setPaymentAmount(selectedService ? selectedService.price : 0);
        setBookingId(data.appointment._id);
        setShowPayment(true);
      } else {
        setMessage(data.message);
      }
    } catch (err) {
      console.error('Booking error:', err);
      setMessage('Network error: Please check your connection');
    }
  };

  const handlePaymentSuccess = () => {
    setShowPayment(false);
    setMessage('Booking and payment successful!');
    setFormData({
      fullName: '',
      phoneNumber: '',
      date: '',
      time: '',
      service: 'default',
      seatNumber: '1',
    });
  };

  const handlePaymentCancel = () => {
    setShowPayment(false);
    setMessage('Booking created but payment was cancelled. Please complete payment later.');
  };

  return (
    <div className='booking-container'>
      {/* Keep all existing alert components */}
      {showAuthAlert && (
        <div className="alert-overlay">
          <div className="alert-popup error">
            <div className="alert-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3>Authentication Required</h3>
            <p>Please log in to book an appointment. Redirecting to login page...</p>
          </div>
        </div>
      )}

      {showHolidayAlert && (
        <div className="alert-overlay">
          <div className="alert-popup warning">
            <div className="alert-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3>Holiday Notice</h3>
            <p style={{ whiteSpace: 'pre-line' }}>{holidayAlertMessage}</p>
            <button onClick={() => setShowHolidayAlert(false)}>OK</button>
          </div>
        </div>
      )}

      {/* Add payment overlay */}
      {showPayment && (
        <div className="alert-overlay">
          <div className="alert-popup payment">
            <Elements stripe={stripePromise}>
              <PaymentForm 
                amount={paymentAmount} 
                bookingId={bookingId} 
                onSuccess={handlePaymentSuccess} 
                onCancel={handlePaymentCancel} 
              />
            </Elements>
          </div>
        </div>
      )}

      <div className="service-time-section animate-fadeInLeft">
        <h3>Service Time</h3>
        <ul className="service-time-list">
          {services.map(service => {
            // Convert duration string to minutes
            let durationText = service.duration;
            let minMatch = /([0-9]+)\s*min/.exec(service.duration);
            let min = minMatch ? parseInt(minMatch[1]) : null;
            if (min !== null && min >= 60) {
              const hrs = Math.floor(min / 60);
              const mins = min % 60;
              durationText = `${hrs} hrs${mins > 0 ? ` ${mins} min` : ''}`;
            }
            return (
              <li key={service._id}>
                <span className="service-name">{service.name} (Rs.{service.price})</span>
                <span className="service-duration">{durationText}</span>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Keep the existing form */}
      <form onSubmit={handleSubmit} className="booking-form animate-fadeInRight">
        <label htmlFor="fullName">Full Name:</label>
        <input
          type="text"
          name="fullName"
          id="fullName"
          value={formData.fullName}
          onChange={(e) => {
            // Only allow letters, spaces, and special characters used in names
            const value = e.target.value;
            if (value === '' || /^[A-Za-z\s'-]+$/.test(value)) {
              handleChange(e);
            }
          }}
          placeholder="Enter your Full Name"
          pattern="[A-Za-z\s'-]+"
          title="Please enter only letters, spaces, hyphens, and apostrophes"
          required
        />
        <br />

        <label htmlFor="phoneNumber">Phone Number:</label>
        <input
          type="tel"
          name="phoneNumber"
          id="phoneNumber"
          value={formData.phoneNumber}
          onChange={(e) => {
            const value = e.target.value;
            if (value === '' || /^\d{0,10}$/.test(value)) {
              handleChange(e);
            }
          }}
          placeholder="Enter your 10-digit phone number"
          pattern="\d{10}"
          title="Please enter a 10-digit phone number"
          required
        />
        <br />

        <label htmlFor="date">Date:</label>
        <input
          type="date"
          name="date"
          id="date"
          value={formData.date}
          onChange={handleChange}
          required
          min={new Date().toISOString().split('T')[0]}
          max={(() => {
            const maxDate = new Date();
            maxDate.setDate(maxDate.getDate() + 2);
            return maxDate.toISOString().split('T')[0];
          })()}
        />
        <small className="date-helper-text">
          You can book appointments for today and the next 2 days only
        </small>
        <br />

        <label htmlFor="service">Service:</label>
        <select
          name="service"
          id="service"
          value={formData.service}
          onChange={handleChange}
          required
        >
          <option value="default">Choose Our Services</option>
          {services.map(service => (
            <option key={service._id} value={service._id}>
              {service.name} (Rs.{service.price})
            </option>
          ))}
        </select>
        <br />

        <label htmlFor="time">Time:</label>
        <input
          type="time"
          name="time"
          id="time"
          value={formData.time}
          onChange={handleChange}
          required
          min="08:00"
          max="20:00"
        />
        <br />

        <label htmlFor="seatNumber">Choose Seat/Barber:</label>
        <select
          name="seatNumber"
          id="seatNumber"
          value={formData.seatNumber}
          onChange={handleChange}
          required
        >
          {Array.from({ length: availableSeats }, (_, i) => (
            <option key={i + 1} value={i + 1}>
              {`Seat ${i + 1} (Barber ${i + 1})`}
            </option>
          ))}
        </select>
        <small className="date-helper-text">There are {availableSeats} seats/barbers available for booking.</small>
        <br />

        <button type="submit">Book Appointment</button>
      </form>

      {message && (
        <div className="alert-overlay">
          <div className={`alert-popup ${message.includes('successful') ? 'success' : 'error'}`}>
            <div className="alert-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {message.includes('successful') ? (
                  <path d="M20 6L9 17l-5-5" />
                ) : (
                  <path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                )}
              </svg>
            </div>
            <h3>{message.includes('successful') ? 'Success!' : 'Error!'}</h3>
            <p>{message}</p>
            <button onClick={() => setMessage('')}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
}
