import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminAuthWrapper = ({ children }) => {
  const navigate = useNavigate();
  const [lastActivity, setLastActivity] = useState(Date.now());
  
  // Function to handle user activity
  const updateActivity = () => {
    setLastActivity(Date.now());
  };

  // Set up event listeners for user activity
  useEffect(() => {
    // Only set up the listeners if the admin is logged in
    const adminToken = localStorage.getItem('admin-token');
    if (!adminToken) {
      navigate('/adminlog');
      return;
    }

    // Add event listeners for user activity
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => {
      window.addEventListener(event, updateActivity);
    });

    // Set up interval to check for inactivity
    const inactivityCheckInterval = setInterval(() => {
      const currentTime = Date.now();
      const inactiveTime = currentTime - lastActivity;
      
      // If inactive for more than 5 minutes (300000 ms), log out
      if (inactiveTime > 300000) {
        // Clear admin data from localStorage
        localStorage.removeItem('admin-token');
        localStorage.removeItem('adminName');
        localStorage.removeItem('adminRole');
        localStorage.removeItem('auth-token');
        
        // Navigate to login page
        navigate('/adminlog');
        
        // Show alert
        alert('You have been logged out due to inactivity.');
      }
    }, 10000); // Check every 10 seconds

    // Clean up event listeners and interval
    return () => {
      events.forEach(event => {
        window.removeEventListener(event, updateActivity);
      });
      clearInterval(inactivityCheckInterval);
    };
  }, [lastActivity, navigate]);

  return <>{children}</>;
};

export default AdminAuthWrapper;