import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Logout() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Get the user ID from localStorage
      const userId = localStorage.getItem('userId');
      
      if (userId) {
        // Notify the server about logout
        await fetch('http://localhost:5000/api/totaluser/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId }),
        });
      }

      // Clear the active status update interval
      const intervalId = localStorage.getItem('activeStatusInterval');
      if (intervalId) {
        clearInterval(Number(intervalId));
      }

      // Clear all localStorage data
      localStorage.clear();

      // Redirect to login page
      navigate('/');
    } catch (error) {
      console.error('Error during logout:', error);
      // Still clear local data and redirect even if server call fails
      localStorage.clear();
      navigate('/');
    }
  };

  useEffect(() => {
    handleLogout();
  }, []);

  return null; // This component doesn't render anything
} 