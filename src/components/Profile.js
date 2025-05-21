import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../CSS/Profile.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCrown, faCalendar, faClock, faScissors, faTimes, faBell } from '@fortawesome/free-solid-svg-icons';

export default function Profile() {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState({
    name: "",
    recentAppointments: [],
    rewardPoints: 0
  });
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState([]);
  const [reminderVisible, setReminderVisible] = useState(false);
  const [reminderData, setReminderData] = useState(null);

  // Function to check if a reminder should be shown
  const checkForUpcomingAppointment = () => {
    const now = new Date();
    const thirtyMinutesFromNow = new Date(now.getTime() + 30 * 60 * 1000);
    
    // Find appointments that are coming up in the next 30 minutes
    const upcomingAppointments = userProfile.recentAppointments.filter(apt => {
      // Parse the time string (e.g., "1:30 PM")
      const [timePart, meridian] = apt.time.split(' ');
      const [hours, minutes] = timePart.split(':').map(Number);
      
      // Convert to 24-hour format
      let hour24 = hours;
      if (meridian.toUpperCase() === 'PM' && hours !== 12) hour24 += 12;
      if (meridian.toUpperCase() === 'AM' && hours === 12) hour24 = 0;
      
      // Create a date object for the appointment time
      const appointmentDate = new Date(apt.date);
      appointmentDate.setHours(hour24, minutes, 0, 0);
      
      // Check if the appointment is within the next 30 minutes
      return appointmentDate > now && appointmentDate <= thirtyMinutesFromNow;
    });
    
    if (upcomingAppointments.length > 0) {
      // Check if this reminder has been dismissed
      const dismissedReminders = JSON.parse(localStorage.getItem('dismissedReminders') || '{}');
      const appointmentId = upcomingAppointments[0].id;
      
      if (!dismissedReminders[appointmentId]) {
        setReminderData(upcomingAppointments[0]);
        setReminderVisible(true);
      }
    }
  };

  // Function to dismiss a reminder
  const dismissReminder = () => {
    if (reminderData) {
      // Store the dismissed reminder ID in localStorage
      const dismissedReminders = JSON.parse(localStorage.getItem('dismissedReminders') || '{}');
      dismissedReminders[reminderData.id] = true;
      localStorage.setItem('dismissedReminders', JSON.stringify(dismissedReminders));
    }
    setReminderVisible(false);
  };

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/log');
      return;
    }

    // Fetch all services for mapping
    fetch('http://localhost:5000/api/services')
      .then(res => res.json())
      .then(data => setServices(data))
      .catch(() => setServices([]));

    // Fetch user details and appointments
    const fetchUserData = async () => {
      try {
        // Fetch user details
        const userResponse = await fetch('http://localhost:5000/api/auth/getuser', {
          method: 'POST',
          headers: {
            'auth-token': token
          }
        });

        if (userResponse.ok) {
          const userData = await userResponse.json();

          // Fetch user-specific appointments
          const appointmentsResponse = await fetch('http://localhost:5000/api/book/user-appointments', {
            method: 'GET',
            headers: {
              'auth-token': token
            }
          });

          let appointments = [];
          if (appointmentsResponse.ok) {
            const appointmentsData = await appointmentsResponse.json();
            const today = new Date();
            today.setHours(0, 0, 0, 0); // Set to start of today
            
            // Create date for tomorrow to compare
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);

            appointments = appointmentsData
              .filter(apt => {
                const appointmentDate = new Date(apt.date);
                appointmentDate.setHours(0, 0, 0, 0); // Set to start of appointment date
                // Only show appointments for today
                return appointmentDate >= today && appointmentDate < tomorrow;
              })
              .map(apt => {
                // Map service ID to name and price
                const serviceObj = services.find(s => s._id === apt.service);
                const serviceDisplay = serviceObj ? `${serviceObj.name} (Rs.${serviceObj.price})` : apt.service;
                return {
                  id: apt._id,
                  service: serviceDisplay,
                  date: new Date(apt.date).toLocaleDateString(),
                  time: apt.time
                };
              });
          }

          // Update user profile with real data
          setUserProfile(prev => ({
            ...prev,
            name: userData.name,
            recentAppointments: appointments,
            rewardPoints: userData.rewardPoints || 0
          }));
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    // Wait for services to be fetched before mapping appointments
    if (services.length > 0) {
      fetchUserData();
    }
  }, [navigate, services]);

  // Check for upcoming appointments when user profile is updated
  useEffect(() => {
    if (!loading && userProfile.recentAppointments.length > 0) {
      checkForUpcomingAppointment();
      
      // Set up an interval to check for upcoming appointments every minute
      const intervalId = setInterval(checkForUpcomingAppointment, 60000);
      
      return () => clearInterval(intervalId);
    }
  }, [loading, userProfile]);

  if (loading) {
    return (
      <div className="profile-loading">
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="profile-container">
      {/* Appointment Reminder Notification */}
      {reminderVisible && reminderData && (
        <div className="reminder-notification">
          <div className="reminder-icon">
            <FontAwesomeIcon icon={faBell} />
          </div>
          <div className="reminder-content">
            <h3>Appointment Reminder</h3>
            <p>You have an upcoming appointment for {reminderData.service} at {reminderData.time}.</p>
          </div>
          <button className="reminder-close" onClick={dismissReminder}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
      )}

      {/* Welcome Section */}
      <div className="welcome-section">
        <h1>Welcome, {userProfile.name}</h1>
        <p className="welcome-subtitle">Manage your appointments</p>
      </div>

      {/* Rewards Status Section */}
      <div className="profile-section rewards-section">
        <div className="section-header">
          <FontAwesomeIcon icon={faCrown} className="section-icon" />
          <h2>Rewards Status</h2>
        </div>
        <div className="rewards-content">
          <div className="points-info">
            <h3>Current Points</h3>
            <div className="points-value">{userProfile.rewardPoints}</div>
          </div>
          <div className="progress-container">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${(userProfile.rewardPoints / 500) * 100}%` }}
              ></div>
            </div>
            <div className="points-needed">
              {500 - userProfile.rewardPoints} points needed for next reward
            </div>
          </div>
          <p className="rewards-description">
            Earn points for each appointment. Redeem points for a free haircut!
          </p>
        </div>
      </div>

      {/* Recent Appointments Section */}
      <div className="profile-section appointments-section">
        <div className="section-header">
          <FontAwesomeIcon icon={faCalendar} className="section-icon" />
          <h2>Recent Appointments</h2>
        </div>
        <div className="appointments-list">
          {userProfile.recentAppointments.length === 0 ? (
            <div className="no-appointments">
              <p>No recent appointments found</p>
            </div>
          ) : (
            userProfile.recentAppointments.map((appointment) => (
              <div key={appointment.id} className="appointment-card">
                <div className="appointment-icon">
                  <FontAwesomeIcon icon={faScissors} />
                </div>
                <div className="appointment-details">
                  <h3>{appointment.service}</h3>
                  <div className="appointment-time">
                    <FontAwesomeIcon icon={faClock} />
                    <span>{appointment.date}</span>
                    <span>{appointment.time}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
