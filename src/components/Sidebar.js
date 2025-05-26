import React from 'react';
import './Sidebar.css';
import { FaCalendarAlt, FaUsers, FaCut, FaChartBar, FaCog, FaSignOutAlt, FaCrown, FaTimesCircle,FaEnvelope } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('admin-token');
    window.location.href = '/adminlog';
  };

  return (
    <div className="admin-dashboard-root">
      <aside className="admin-sidebar">
        <div className="sidebar-user">
          <div className="user-avatar">A</div>
          <div>
            <div className="user-name">Astar Salon</div>
            <div className="user-role">Administrator</div>
          </div>
        </div>
        <nav className="sidebar-nav">
          <ul>
            <li>
              <button
                className={`sidebar-nav-btn${location.pathname === '/admin/Analytics' ? ' active' : ''}`}
                onClick={() => navigate('/admin/Analytics')}
              >
                <FaChartBar className="nav-icon" /> Analytics
              </button>
            </li>
            <li>
              <button
                className={`sidebar-nav-btn${location.pathname === '/admin/appointment' ? ' active' : ''}`}
                onClick={() => navigate('/admin/appointment')}
              >
                <FaCalendarAlt className="nav-icon" /> Appointments
              </button>
            </li>
            <li>
              <button
                className={`sidebar-nav-btn${location.pathname === '/admin/Cancellations' ? ' active' : ''}`}
                onClick={() => navigate('/admin/Cancellations')}
              >
                <FaTimesCircle className="nav-icon" /> Cancellations
              </button>
            </li>
            <li>
              <button
                className={`sidebar-nav-btn${location.pathname === '/admin/Users' ? ' active' : ''}`}
                onClick={() => navigate('/admin/Users')}
              >
                <FaUsers className="nav-icon" /> Users
              </button>
            </li>
            <li>
              <button
                className={`sidebar-nav-btn${location.pathname === '/admin/Services' ? ' active' : ''}`}
                onClick={() => navigate('/admin/Services')}
              >
                <FaCut className="nav-icon" /> Services
              </button>
            </li>
            <li>
              <button
                className={`sidebar-nav-btn${location.pathname === '/admin/Rewards' ? ' active' : ''}`}
                onClick={() => navigate('/admin/Rewards')}
              >
                <FaCrown className="nav-icon" /> Rewards
              </button>
            </li>
            <li>
              <button
                className={`sidebar-nav-btn${location.pathname === '/admin/Admincontact' ? ' active' : ''}`}
                onClick={() => navigate('/admin/Admincontact')}
              >
                <FaEnvelope className="nav-icon" /> Contact
              </button>
            </li>
            
            <li>
              <button
                className={`sidebar-nav-btn${location.pathname === '/admin/Settings' ? ' active' : ''}`}
                onClick={() => navigate('/admin/Settings')}
              >
                <FaCog className="nav-icon" /> Settings
              </button>
            </li>
          </ul>
        </nav>
        <button className="sidebar-logout" onClick={handleLogout}><FaSignOutAlt /> Logout</button>
      </aside>
    </div>
  );
}
