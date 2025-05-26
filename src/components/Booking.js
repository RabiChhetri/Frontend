import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../CSS/Book.css';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

// Initialize Stripe with your publishable key
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);
// Payment Form Component
const PaymentForm = ({ amount, formData, onSuccess, onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedPaymentOption, setSelectedPaymentOption] = useState('full');

  // Add dynamic styles based on selectedPaymentOption
  useEffect(() => {
    const styles = `
      .payment-options {
        display: flex;
        gap: 15px;
        margin-bottom: 20px;
      }

      .payment-option {
        flex: 1;
        padding: 15px;
        border: 2px solid #e0e0e0;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s ease;
        background-color: white;
      }

      .payment-option.selected {
        border-color: #8e44ad;
        background-color: #f8f4fc;
        box-shadow: 0 2px 4px rgba(142, 68, 173, 0.1);
      }

      .payment-option-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
      }

      .payment-option h4 {
        margin: 0;
        color: #2c3e50;
        font-size: 1.1rem;
      }

      .payment-option .amount {
        font-weight: bold;
        color: #8e44ad;
      }

      .payment-option p {
        margin: 0;
        font-size: 0.9rem;
        color: #666;
      }

      .amount-to-pay {
        font-size: 1.2rem;
        font-weight: bold;
        color: #8e44ad;
        text-align: center;
        margin: 20px 0;
        padding: 10px;
        background-color: #f8f4fc;
        border-radius: 6px;
      }

      .non-refundable-notice {
        margin-top: 8px;
        padding: 4px 8px;
        background-color: #fff3cd;
        border: 1px solid #ffeeba;
        border-radius: 4px;
        color: #856404;
        font-size: 0.85rem;
        text-align: center;
      }

      .payment-option.selected .non-refundable-notice {
        background-color: #fff3cd;
        border-color: #ffeeba;
      }

      .refund-policy {
        margin: 15px 0;
        padding: 15px;
        background-color: ${selectedPaymentOption === 'partial' ? '#fff3cd' : '#f8f9fa'};
        border-radius: 8px;
        border-left: 4px solid ${selectedPaymentOption === 'partial' ? '#856404' : '#8e44ad'};
        display: flex;
        align-items: flex-start;
        gap: 12px;
      }

      .refund-policy-icon {
        font-size: 20px;
        color: ${selectedPaymentOption === 'partial' ? '#856404' : '#8e44ad'};
      }

      .refund-policy-text {
        flex: 1;
      }

      .refund-policy-text strong {
        display: block;
        color: #2c3e50;
        margin-bottom: 5px;
        font-size: 0.95rem;
      }

      .refund-policy-text p {
        margin: 5px 0 0 0;
        color: ${selectedPaymentOption === 'partial' ? '#856404' : '#666'};
        font-size: 0.9rem;
        line-height: 1.4;
      }

      .card-element-container {
        margin: 20px 0;
        padding: 15px;
        border: 1px solid #e0e0e0;
        border-radius: 6px;
        background-color: white;
      }

      .payment-buttons {
        display: flex;
        gap: 15px;
        justify-content: flex-end;
        margin-top: 20px;
      }

      .payment-buttons button {
        padding: 10px 20px;
        border-radius: 6px;
        border: none;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
      }

      .payment-buttons button[type="button"] {
        background-color: #e0e0e0;
        color: #666;
      }

      .payment-buttons button[type="submit"] {
        background-color: #8e44ad;
        color: white;
      }

      .payment-buttons button:hover:not(:disabled) {
        transform: translateY(-1px);
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      }

      .payment-buttons button:disabled {
        opacity: 0.7;
        cursor: not-allowed;
      }

      .remaining-amount {
        margin-top: 8px;
        padding: 4px 8px;
        background-color: #e8eaf6;
        border-radius: 4px;
        color: #3f51b5;
        font-size: 0.85rem;
        text-align: center;
      }

      .payment-option.selected .remaining-amount {
        background-color: #c5cae9;
      }
    `;

    // Update the styles
    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    // Cleanup function to remove the style element when component unmounts
    return () => {
      document.head.removeChild(styleSheet);
    };
  }, [selectedPaymentOption]); // Re-run when selectedPaymentOption changes

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!stripe || !elements) {
      setLoading(false);
      return;
    }

    try {
      // Calculate final amount based on payment option
      const finalAmount = selectedPaymentOption === 'full' ? amount : Math.ceil(amount * 0.3);

      // Create booking first
      const token = localStorage.getItem('token');
      const bookingResponse = await fetch('http://localhost:5000/api/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': token
        },
        body: JSON.stringify({
          ...formData,
          paymentType: selectedPaymentOption
        }),
      });

      if (!bookingResponse.ok) {
        const errorData = await bookingResponse.json();
        throw new Error(errorData.message || 'Failed to create booking');
      }

      const bookingData = await bookingResponse.json();
      const bookingId = bookingData.appointment._id;

      // Get client secret
      const paymentResponse = await fetch('http://localhost:5000/api/payment/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': token
        },
        body: JSON.stringify({ 
          bookingId, 
          amount: finalAmount,
          paymentType: selectedPaymentOption 
        })
      });

      if (!paymentResponse.ok) {
        // Delete the booking if payment intent creation fails
        await fetch(`http://localhost:5000/api/book/${bookingId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'auth-token': token
          }
        });
        const errorData = await paymentResponse.json();
        throw new Error(errorData.message || 'Failed to create payment');
      }

      const paymentData = await paymentResponse.json();

      // Confirm payment
      const result = await stripe.confirmCardPayment(paymentData.clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: formData.fullName,
          },
        },
      });

      if (result.error) {
        // If payment fails, delete the booking
        await fetch(`http://localhost:5000/api/book/${bookingId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'auth-token': token
          }
        });
        throw new Error(result.error.message);
      }

      if (result.paymentIntent.status === 'succeeded') {
        // Record payment success in backend
        await fetch('http://localhost:5000/api/payment/payment-success', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'auth-token': token
          },
          body: JSON.stringify({
            bookingId,
            paymentIntentId: result.paymentIntent.id,
            paymentType: selectedPaymentOption
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
      
      <div className="payment-options">
        <div 
          className={`payment-option ${selectedPaymentOption === 'full' ? 'selected' : ''}`}
          onClick={() => setSelectedPaymentOption('full')}
        >
          <div className="payment-option-header">
            <h4>Full Payment</h4>
            <span className="amount">Rs.{amount}</span>
          </div>
          <p>Pay the full amount now</p>
        </div>
        
        <div 
          className={`payment-option ${selectedPaymentOption === 'partial' ? 'selected' : ''}`}
          onClick={() => setSelectedPaymentOption('partial')}
        >
          <div className="payment-option-header">
            <h4>Partial Payment</h4>
            <span className="amount">Rs.{Math.ceil(amount * 0.3)}</span>
          </div>
          <p>Pay 30% now, remaining at salon</p>
          <div className="remaining-amount">
            Remaining to pay at salon: Rs.{Math.ceil(amount * 0.7)}
          </div>
        </div>
      </div>

      <p className="amount-to-pay">Amount to pay: Rs.{selectedPaymentOption === 'full' ? amount : Math.ceil(amount * 0.3)}</p>
      
      <div className="refund-policy">
        <div className="refund-policy-icon">ℹ️</div>
        <div className="refund-policy-text">
          <strong>Cancellation & Refund Policy:</strong>
          {selectedPaymentOption === 'partial' ? (
            <p>Partial payments (30% advance) are non-refundable upon cancellation.</p>
          ) : (
            <p>If you need to cancel your appointment, you will receive 70% of the payment amount as a refund. The remaining 30% will be retained as a cancellation fee.</p>
          )}
        </div>
      </div>
      
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

    // Instead of creating booking, show payment form
    const selectedService = services.find(s => s._id === formData.service);
    setPaymentAmount(selectedService ? selectedService.price : 0);
    setShowPayment(true);
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
                formData={{
                  ...formData,
                  time: (() => {
                    const time24 = formData.time;
                    const [hours, minutes] = time24.split(':');
                    const ampm = hours >= 12 ? 'PM' : 'AM';
                    const hour12 = (hours % 12 || 12).toString().padStart(2, '0');
                    return `${hour12}:${minutes} ${ampm}`;
                  })()
                }}
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
            // Only allow numbers and check for 98/97 start
            if (value === '' || /^\d{0,10}$/.test(value)) {
              if (value.length === 0 || (value.length === 1 && (value === '9')) || 
                  (value.length === 2 && (value.startsWith('98') || value.startsWith('97'))) ||
                  (value.length > 2 && (value.startsWith('98') || value.startsWith('97')))) {
                handleChange(e);
              }
            }
          }}
          placeholder="Enter your 10-digit phone number"
          pattern="^(98|97)\d{8}$"
          title="Phone number must start with 98 or 97 and be 10 digits long"
          required
        />
        <small className="phone-helper-text">
          Phone number must start with 98 or 97 (e.g., 9812345678)
        </small>
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
