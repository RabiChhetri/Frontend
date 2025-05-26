import React, { useEffect, useState } from 'react';
import '../../CSS/Appointment.css';
import Sidebar from '../Sidebar';
import axios from 'axios';
import { FaTrash, FaCalendarAlt, FaUser, FaSpinner, FaCheckCircle, FaSortUp, FaSortDown, FaEye, FaChartLine } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

function formatDate(dateString) {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

function formatTime(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
}

const serviceMapping = {
  haircut: 'HairCut',
  shaving: 'Shaving',
  haircut_shaving: 'HairCut and Shaving',
  hair_color: 'Hair Color',
  haircut_wash: 'HairCut and Wash'
};

// Capitalize each word in a string
function capitalizeWords(str) {
  return str.replace(/\b\w+/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
}

export default function Cancellations() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showRevenueModal, setShowRevenueModal] = useState(false);
  const itemsPerPage = 10;
  const [sortBy, setSortBy] = useState('cancelDate');
  const [sortDirection, setSortDirection] = useState('desc');
  const [services, setServices] = useState([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    checkAuthAndFetchData();
    // Fetch all services for mapping
    axios.get('http://localhost:5000/api/services')
      .then(res => setServices(res.data))
      .catch(() => setServices([]));
  }, [navigate]);

  const checkAuthAndFetchData = async () => {
    const token = localStorage.getItem('admin-token');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    fetchCancellations();
  };

  const fetchCancellations = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('admin-token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      console.log('Fetching cancellations with token:', token);
      const response = await axios.get('http://localhost:5000/api/book/admin/cancellations', {
        headers: { 'auth-token': token }
      });

      console.log('Cancellations response:', response.data);
      
      if (!response.data) {
        throw new Error('No data received from server');
      }

      setAppointments(response.data);
      setError(null);
    } catch (error) {
      console.error('Error details:', error.response || error);
      let errorMessage = 'Failed to fetch cancellations';
      
      if (error.response) {
        // Server responded with an error
        errorMessage = error.response.data?.message || error.response.data?.error || errorMessage;
        if (error.response.status === 401 || error.response.status === 403) {
          localStorage.removeItem('admin-token');
          navigate('/admin/login');
          return;
        }
      } else if (error.request) {
        // Request was made but no response
        errorMessage = 'Server is not responding. Please try again later.';
      } else {
        // Error in request setup
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      axios.delete(`http://localhost:5000/api/book/admin/${id}`)
      .then(() => {
        setAppointments(appointments.filter(appt => appt._id !== id));
      })
      .catch(() => alert('Failed to delete appointment'));
    }
  };

  const handleComplete = async (appt) => {
    if (window.confirm('Are you sure you want to mark this appointment as complete? This action cannot be undone.')) {
      const token = localStorage.getItem('admin-token');
      try {
        const res = await axios.post(
          `http://localhost:5000/api/book/admin/complete/${appt._id}`,
          {},
          { headers: { 'auth-token': token } }
        );
        alert(res.data.message);
        // Update the local state to mark the appointment as completed
        setAppointments(appointments.map(appointment => 
          appointment._id === appt._id 
            ? { ...appointment, completed: true }
            : appointment
        ));
      } catch (err) {
        alert(err.response?.data?.message || "Failed to complete appointment");
      }
    }
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDirection('asc');
    }
  };

  const filteredAppointments = appointments.filter(appt => 
    (appt.fullName && appt.fullName.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (appt.serviceName && appt.serviceName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const sortedAppointments = [...filteredAppointments].sort((a, b) => {
    if (sortBy === 'originalAppointmentDate') {
      return sortDirection === 'asc' 
        ? new Date(a.originalAppointmentDate) - new Date(b.originalAppointmentDate)
        : new Date(b.originalAppointmentDate) - new Date(a.originalAppointmentDate);
    } else if (sortBy === 'fullName') {
      const nameA = (a.fullName || '').toLowerCase();
      const nameB = (b.fullName || '').toLowerCase();
      return sortDirection === 'asc' 
        ? nameA.localeCompare(nameB)
        : nameB.localeCompare(nameA);
    } else if (sortBy === 'cancelDate') {
      return sortDirection === 'asc'
        ? new Date(a.cancelDate) - new Date(b.cancelDate)
        : new Date(b.cancelDate) - new Date(a.cancelDate);
    }
    return 0;
  });

  const paginatedAppointments = sortedAppointments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(sortedAppointments.length / itemsPerPage);

  const handleViewPayment = async (apptId) => {
    setShowPaymentModal(true);
    setPaymentLoading(true);
    setPaymentError('');
    setPaymentDetails(null);

    try {
      const token = localStorage.getItem('admin-token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      console.log('Fetching cancellation details for ID:', apptId);
      const response = await axios.get(`http://localhost:5000/api/book/admin/cancellations/${apptId}`, {
        headers: { 'auth-token': token }
      });

      console.log('Cancellation details response:', response.data);
      
      if (!response.data) {
        throw new Error('No data received from server');
      }

      setPaymentDetails(response.data);
      setPaymentError('');
    } catch (error) {
      console.error('Error fetching cancellation details:', error.response || error);
      let errorMessage = 'Failed to fetch cancellation details';
      
      if (error.response) {
        errorMessage = error.response.data?.message || error.response.data?.error || errorMessage;
        if (error.response.status === 401 || error.response.status === 403) {
          localStorage.removeItem('admin-token');
          navigate('/admin/login');
          return;
        }
      } else if (error.request) {
        errorMessage = 'Server is not responding. Please try again later.';
      } else {
        errorMessage = error.message;
      }
      
      setPaymentError(errorMessage);
      setPaymentDetails(null);
    } finally {
      setPaymentLoading(false);
    }
  };

  const calculateTotalRevenue = () => {
    const totalRetainedAmount = appointments.reduce((sum, appt) => sum + (appt.shopRetainedAmount || 0), 0);
    const totalCancellations = appointments.length;

    return {
      totalCancellations,
      totalRetainedAmount
    };
  };

  return (
    <div className="admin-dashboard-root">
      <Sidebar />
      <div className="admin-main-content">
        <motion.div 
          className="appointments-container"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="appointments-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <motion.div 
              className="search-container attractive-search"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <input
                type="text"
                placeholder="Search cancellations..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="search-input"
              />
            </motion.div>
            <motion.button
              className="revenue-btn"
              onClick={() => setShowRevenueModal(true)}
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              style={{
                padding: '10px 20px',
                backgroundColor: '#6b46c1',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <FaChartLine /> Total Revenue
            </motion.button>
          </div>

          {error && (
            <motion.div 
              className="error-message"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                padding: '1rem',
                margin: '1rem 0',
                backgroundColor: '#ffebee',
                color: '#c62828',
                borderRadius: '4px',
                textAlign: 'center'
              }}
            >
              {error}
            </motion.div>
          )}

          <div className="appointments-table-wrapper">
            {loading ? (
              <motion.div 
                className="loading-state"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '2rem'
                }}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <FaSpinner size={30} />
                </motion.div>
                <p>Loading cancellations...</p>
              </motion.div>
            ) : !error && appointments.length === 0 ? (
              <>
                <motion.table 
                  className="appointments-table"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <thead>
                    <tr style={{
                      backgroundColor: '#2d3748',
                      color: 'white',
                      whiteSpace: 'nowrap',
                      fontSize: '14px'
                    }}>
                      <th style={{
                        padding: '12px 15px',
                        fontWeight: '500',
                        textAlign: 'left',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}>
                        <FaUser /> User
                      </th>
                      <th style={{
                        padding: '12px 15px',
                        fontWeight: '500',
                        textAlign: 'left'
                      }}>Service</th>
                      <th style={{
                        padding: '12px 15px',
                        fontWeight: '500',
                        textAlign: 'left',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        cursor: 'pointer'
                      }} onClick={() => handleSort('originalAppointmentDate')}>
                        <FaCalendarAlt /> Date {sortBy === 'originalAppointmentDate' && (
                          sortDirection === 'asc' ? <FaSortUp /> : <FaSortDown />
                        )}
                      </th>
                      <th style={{
                        padding: '12px 15px',
                        fontWeight: '500',
                        textAlign: 'left',
                        cursor: 'pointer'
                      }} onClick={() => handleSort('cancelDate')}>
                        Cancelled {sortBy === 'cancelDate' && (
                          sortDirection === 'asc' ? <FaSortUp /> : <FaSortDown />
                        )}
                      </th>
                      <th style={{
                        padding: '12px 15px',
                        fontWeight: '500',
                        textAlign: 'right'
                      }}>Amount</th>
                      <th style={{
                        padding: '12px 15px',
                        fontWeight: '500',
                        textAlign: 'right'
                      }}>Refund (70%)</th>
                      <th style={{
                        padding: '12px 15px',
                        fontWeight: '500',
                        textAlign: 'right'
                      }}>Retained (30%)</th>
                      <th style={{
                        padding: '12px 15px',
                        fontWeight: '500',
                        textAlign: 'center'
                      }}>Actions</th>
                    </tr>
                  </thead>
                </motion.table>
                <motion.div 
                  className="no-data-message"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{
                    textAlign: 'center',
                    padding: '2rem',
                    color: '#666'
                  }}
                >
                  No cancellations found
                </motion.div>
              </>
            ) : (
              <>
                <motion.table 
                  className="appointments-table"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <thead>
                    <tr style={{
                      backgroundColor: '#2d3748',
                      color: 'white',
                      whiteSpace: 'nowrap',
                      fontSize: '14px'
                    }}>
                      <th style={{
                        padding: '12px 15px',
                        fontWeight: '500',
                        textAlign: 'left',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}>
                        <FaUser /> User
                      </th>
                      <th style={{
                        padding: '12px 15px',
                        fontWeight: '500',
                        textAlign: 'left'
                      }}>Service</th>
                      <th style={{
                        padding: '12px 15px',
                        fontWeight: '500',
                        textAlign: 'left',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        cursor: 'pointer'
                      }} onClick={() => handleSort('originalAppointmentDate')}>
                        <FaCalendarAlt /> Date {sortBy === 'originalAppointmentDate' && (
                          sortDirection === 'asc' ? <FaSortUp /> : <FaSortDown />
                        )}
                      </th>
                      <th style={{
                        padding: '12px 15px',
                        fontWeight: '500',
                        textAlign: 'left',
                        cursor: 'pointer'
                      }} onClick={() => handleSort('cancelDate')}>
                        Cancelled {sortBy === 'cancelDate' && (
                          sortDirection === 'asc' ? <FaSortUp /> : <FaSortDown />
                        )}
                      </th>
                      <th style={{
                        padding: '12px 15px',
                        fontWeight: '500',
                        textAlign: 'right'
                      }}>Amount</th>
                      <th style={{
                        padding: '12px 15px',
                        fontWeight: '500',
                        textAlign: 'right'
                      }}>Refund (70%)</th>
                      <th style={{
                        padding: '12px 15px',
                        fontWeight: '500',
                        textAlign: 'right'
                      }}>Retained (30%)</th>
                      <th style={{
                        padding: '12px 15px',
                        fontWeight: '500',
                        textAlign: 'center'
                      }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedAppointments.map((appt) => (
                      <motion.tr 
                        key={appt._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <td>{appt.fullName}</td>
                        <td>{appt.serviceName}</td>
                        <td>{new Date(appt.originalAppointmentDate).toLocaleDateString()}</td>
                        <td>{new Date(appt.cancelDate).toLocaleDateString()}</td>
                        <td>Rs.{appt.originalAmount}</td>
                        <td>Rs.{appt.refundAmount}</td>
                        <td>Rs.{appt.shopRetainedAmount}</td>
                        <td>
                          <button
                            className="view-btn"
                            onClick={() => handleViewPayment(appt._id)}
                          >
                            <FaEye /> View
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </motion.table>

                {totalPages > 1 && (
                  <div className="pagination">
                    <button 
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </button>
                    <span>{currentPage} of {totalPages}</span>
                    <button 
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          {showPaymentModal && (
            <div className="modal-overlay" onClick={() => setShowPaymentModal(false)}>
              <div className="modal-content" onClick={e => e.stopPropagation()}>
                <h2>Cancellation Details</h2>
                {paymentLoading ? (
                  <div className="loading-spinner">
                    <FaSpinner className="spinner" /> Loading...
                  </div>
                ) : paymentError ? (
                  <div className="error-message">{paymentError}</div>
                ) : paymentDetails ? (
                  <div className="payment-details">
                    <p>
                      <strong>User:</strong>
                      <span>{paymentDetails.fullName}</span>
                    </p>
                    <p>
                      <strong>Service:</strong>
                      <span>{paymentDetails.serviceName}</span>
                    </p>
                    <p>
                      <strong>Original Date:</strong>
                      <span>{new Date(paymentDetails.originalAppointmentDate).toLocaleDateString()}</span>
                    </p>
                    <p>
                      <strong>Cancelled On:</strong>
                      <span>{new Date(paymentDetails.cancelDate).toLocaleDateString()}</span>
                    </p>
                    <p>
                      <strong>Original Amount:</strong>
                      <span>Rs.{paymentDetails.originalAmount}</span>
                    </p>
                    <p>
                      <strong>Refund Amount:</strong>
                      <span>Rs.{paymentDetails.refundAmount}</span>
                    </p>
                    <p>
                      <strong>Shop Retained:</strong>
                      <span>Rs.{paymentDetails.shopRetainedAmount}</span>
                    </p>
                  </div>
                ) : null}
                <button className="close-btn" onClick={() => setShowPaymentModal(false)}>
                  Close
                </button>
              </div>
            </div>
          )}

          {showRevenueModal && (
            <div className="modal-overlay" 
              onClick={() => setShowRevenueModal(false)}
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                backdropFilter: 'blur(5px)'
              }}
            >
              <motion.div 
                className="modal-content" 
                onClick={e => e.stopPropagation()} 
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                transition={{ duration: 0.3 }}
                style={{ 
                  maxWidth: '600px',
                  background: 'linear-gradient(145deg, #ffffff, #f5f5f5)',
                  borderRadius: '20px',
                  padding: '30px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)'
                }}
              >
                <h2 style={{ 
                  borderBottom: '2px solid #6b46c1',
                  paddingBottom: '15px',
                  marginBottom: '30px',
                  textAlign: 'center',
                  color: '#2d3748',
                  fontSize: '28px',
                  fontWeight: '600'
                }}>
                  Total Revenue from Cancellations
                </h2>
                <div className="revenue-stats">
                  {loading ? (
                    <div className="loading-spinner" style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      padding: '40px'
                    }}>
                      <FaSpinner className="spinner" style={{
                        animation: 'spin 1s linear infinite',
                        fontSize: '30px',
                        color: '#6b46c1'
                      }}/> 
                      <span style={{ marginLeft: '10px', color: '#4a5568' }}>Loading...</span>
                    </div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <div className="stat-grid" style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gap: '30px',
                        marginBottom: '20px',
                        maxWidth: '500px',
                        margin: '0 auto'
                      }}>
                        <motion.div 
                          className="stat-item"
                          whileHover={{ scale: 1.02 }}
                          transition={{ duration: 0.2 }}
                          style={{ 
                            padding: '30px',
                            backgroundColor: '#fff',
                            borderRadius: '15px',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                            border: '1px solid rgba(107, 70, 193, 0.1)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <h3 style={{
                            color: '#4a5568',
                            marginBottom: '15px',
                            fontSize: '18px',
                            fontWeight: '500'
                          }}>Total Cancellations</h3>
                          <p style={{
                            color: '#2d3748',
                            fontSize: '32px',
                            fontWeight: '600',
                            margin: 0
                          }}>{calculateTotalRevenue().totalCancellations}</p>
                        </motion.div>

                        <motion.div 
                          className="stat-item"
                          whileHover={{ scale: 1.02 }}
                          transition={{ duration: 0.2 }}
                          style={{ 
                            padding: '30px',
                            backgroundColor: '#fff',
                            borderRadius: '15px',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                            border: '1px solid rgba(107, 70, 193, 0.1)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <h3 style={{
                            color: '#4a5568',
                            marginBottom: '15px',
                            fontSize: '18px',
                            fontWeight: '500'
                          }}>Total Shop Retained</h3>
                          <p style={{
                            color: '#2d3748',
                            fontSize: '32px',
                            fontWeight: '600',
                            margin: 0
                          }}>Rs.{calculateTotalRevenue().totalRetainedAmount}</p>
                          <span style={{
                            color: '#718096',
                            fontSize: '14px',
                            marginTop: '8px'
                          }}>(30%)</span>
                        </motion.div>
                      </div>
                    </motion.div>
                  )}
                </div>
                <motion.button 
                  className="close-btn"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowRevenueModal(false)}
                  style={{
                    marginTop: '30px',
                    padding: '12px 25px',
                    backgroundColor: '#6b46c1',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: '500',
                    display: 'block',
                    margin: '30px auto 0',
                    width: '200px',
                    boxShadow: '0 4px 6px rgba(107, 70, 193, 0.2)',
                    transition: 'all 0.3s ease'
                  }}
                >
                  Close
                </motion.button>
              </motion.div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
