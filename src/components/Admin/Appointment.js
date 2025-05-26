import React, { useEffect, useState } from 'react';
import '../../CSS/Appointment.css';
import Sidebar from '../Sidebar';
import axios from 'axios';
import { FaTrash, FaCalendarAlt, FaClock, FaUser, FaSpinner, FaCheckCircle, FaSortUp, FaSortDown, FaEye } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

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

export default function Appointment() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [sortBy, setSortBy] = useState('date');
  const [sortDirection, setSortDirection] = useState('asc');
  const [services, setServices] = useState([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentError, setPaymentError] = useState('');

  useEffect(() => {
    fetchAppointments();
    // Fetch all services for mapping
    axios.get('http://localhost:5000/api/services')
      .then(res => setServices(res.data))
      .catch(() => setServices([]));
  }, []);

  const fetchAppointments = () => {
    setLoading(true);
    axios.get('http://localhost:5000/api/book')
      .then(res => {
        setAppointments(res.data);
        setLoading(false);
      })
      .catch(() => {
        setAppointments([]);
        setLoading(false);
      });
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

  // Sorting logic
  function handleSort(column) {
    if (sortBy === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDirection('asc');
    }
  }

  const filteredAppointments = appointments.filter(appt => 
    appt.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    serviceMapping[appt.service]?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (appt.phoneNumber && appt.phoneNumber.includes(searchTerm))
  );

  // Sort filteredAppointments by sortBy and sortDirection
  const sortedAppointments = [...filteredAppointments].sort((a, b) => {
    // First sort by completion status
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1; // Incomplete appointments come first
    }

    // Then apply the regular sorting logic
    if (sortBy === 'date') {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      if (dateA.getTime() === dateB.getTime()) {
        // If dates are equal, sort by start time in the same direction
        const tA = new Date(a.startTime);
        const tB = new Date(b.startTime);
        return sortDirection === 'asc' ? tA - tB : tB - tA;
      }
      return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
    } else if (sortBy === 'fullName') {
      const nameA = a.fullName.toLowerCase();
      const nameB = b.fullName.toLowerCase();
      if (nameA < nameB) return sortDirection === 'asc' ? -1 : 1;
      if (nameA > nameB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    } else if (sortBy === 'startTime') {
      // Compare by time (hours and minutes only)
      const tA = new Date(a.startTime);
      const tB = new Date(b.startTime);
      const timeA = tA.getHours() * 60 + tA.getMinutes();
      const timeB = tB.getHours() * 60 + tB.getMinutes();
      if (timeA === timeB) {
        // If times are equal, sort by date in the same direction
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
      }
      return sortDirection === 'asc' ? timeA - timeB : timeB - timeA;
    }
    return 0;
  });

  // Pagination logic
  let paginatedAppointments = [];
  let totalPages = 1;
  
  // Combine all appointments and paginate them
  const allAppointments = [...sortedAppointments];
  totalPages = Math.ceil(allAppointments.length / itemsPerPage);
  
  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  paginatedAppointments = allAppointments.slice(start, end);

  // Helper to get service name by id
  const getServiceName = (id) => {
    const service = services.find(s => s._id === id);
    return service ? service.name : id;
  };

  const handleViewPayment = async (apptId) => {
    setShowPaymentModal(true);
    setPaymentLoading(true);
    setPaymentError('');
    setPaymentDetails(null);
    try {
      const res = await axios.get(`http://localhost:5000/api/book/${apptId}`);
      setPaymentDetails(res.data);
    } catch (err) {
      setPaymentError('Failed to fetch payment details');
    } finally {
      setPaymentLoading(false);
    }
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
          <div className="appointments-header">
            <motion.div 
              className="search-container attractive-search"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <input
                type="text"
                placeholder="Search appointments..."
                value={searchTerm}
                onChange={(e) => {
                  const formatted = capitalizeWords(e.target.value);
                  setSearchTerm(formatted);
                  setCurrentPage(1);
                }}
                className="search-input"
              />
            </motion.div>
          </div>
          <div className="appointments-table-wrapper">
            {loading ? (
              <motion.div 
                className="loading-state"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <FaSpinner className="spinner" />
                </motion.div>
                <p>Loading appointments...</p>
              </motion.div>
            ) : (
              <motion.table 
                className="appointments-table"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <thead>
                  <tr>
                    <th style={{cursor:'pointer', whiteSpace: 'nowrap'}} onClick={() => handleSort('fullName')}>
                      <FaUser /> Customer
                      {sortBy === 'fullName' && (
                        sortDirection === 'asc' ? <FaSortUp className="sort-icon active" /> : <FaSortDown className="sort-icon active" />
                      )}
                      {sortBy !== 'fullName' && <FaSortUp className="sort-icon" style={{opacity:0.3}} />}
                    </th>
                    <th style={{whiteSpace: 'nowrap'}}>Phone Number</th>
                    <th>Service</th>
                    <th style={{whiteSpace: 'nowrap'}}>Seat</th>
                    <th style={{cursor:'pointer', whiteSpace: 'nowrap'}} onClick={() => handleSort('date')}>
                      <FaCalendarAlt /> Date
                      {sortBy === 'date' && (
                        sortDirection === 'asc' ? <FaSortUp className="sort-icon active" /> : <FaSortDown className="sort-icon active" />
                      )}
                      {sortBy !== 'date' && <FaSortUp className="sort-icon" style={{opacity:0.3}} />}
                    </th>
                    <th style={{cursor:'pointer', whiteSpace: 'nowrap'}} onClick={() => handleSort('startTime')}>
                      <FaClock /> Start Time
                      {sortBy === 'startTime' && (
                        sortDirection === 'asc' ? <FaSortUp className="sort-icon active" /> : <FaSortDown className="sort-icon active" />
                      )}
                      {sortBy !== 'startTime' && <FaSortUp className="sort-icon" style={{opacity:0.3}} />}
                    </th>
                    <th style={{whiteSpace: 'nowrap'}}><FaClock /> End Time</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {paginatedAppointments.map((appt, index) => (
                      <motion.tr 
                        key={appt._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <td>{capitalizeWords(appt.fullName)}</td>
                        <td>{appt.phoneNumber}</td>
                        <td>{getServiceName(appt.service)}</td>
                        <td>{`Seat ${appt.seatNumber}`}</td>
                        <td>{formatDate(appt.date)}</td>
                        <td>{formatTime(appt.startTime)}</td>
                        <td>{formatTime(appt.endTime)}</td>
                        <td>
                          <motion.button 
                            className="action-btn delete-btn" 
                            onClick={() => handleDelete(appt._id)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            disabled={appt.completed}
                          >
                            <FaTrash /> Delete
                          </motion.button>
                          <motion.button 
                            className="action-btn complete-btn" 
                            onClick={() => handleComplete(appt)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            disabled={appt.completed}
                          >
                            <FaCheckCircle /> {appt.completed ? 'Completed' : 'Complete'}
                          </motion.button>
                          <motion.button
                            className="action-btn view-btn"
                            onClick={() => handleViewPayment(appt._id)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <FaEye /> View
                          </motion.button>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </motion.table>
            )}
          </div>
          {/* Pagination Controls */}
          {totalPages > 1 && (
            <motion.div 
              className="pagination-controls"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <motion.button
                className="pagination-btn"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Previous
              </motion.button>
              {Array.from({ length: totalPages }, (_, i) => (
                <motion.button
                  key={i + 1}
                  className={`pagination-btn${currentPage === i + 1 ? ' active' : ''}`}
                  onClick={() => setCurrentPage(i + 1)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {i + 1}
                </motion.button>
              ))}
              <motion.button
                className="pagination-btn"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Next
              </motion.button>
            </motion.div>
          )}
          {/* Payment Details Modal */}
          {showPaymentModal && (
            <div className="modal-overlay" onClick={() => setShowPaymentModal(false)}>
              <div className="modal-content" onClick={e => e.stopPropagation()}>
                <h2>Payment Details</h2>
                {paymentLoading ? (
                  <div style={{ textAlign: 'center', padding: '20px' }}><FaSpinner className="spinner" /> Loading...</div>
                ) : paymentError ? (
                  <div style={{ color: 'red' }}>{paymentError}</div>
                ) : paymentDetails ? (
                  <div>
                    <p><strong>Customer:</strong> {capitalizeWords(paymentDetails.fullName)}</p>
                    <p><strong>Payment Status:</strong> {paymentDetails.completed ? 'completed' : paymentDetails.paymentType === 'partial' ? 'pending' : paymentDetails.paymentStatus || 'N/A'}</p>
                    <p><strong>Amount Paid:</strong> {paymentDetails.completed ? `Rs.${paymentDetails.paymentType === 'partial' ? Math.ceil(paymentDetails.paymentAmount * (10/3)) : paymentDetails.paymentAmount}` : paymentDetails.paymentAmount ? `Rs.${paymentDetails.paymentAmount}` : 'N/A'}</p>
                    {paymentDetails.paymentType === 'partial' && !paymentDetails.completed && (
                      <p><strong>Remaining Amount:</strong> Rs.{Math.ceil(paymentDetails.paymentAmount * (7/3))}</p>
                    )}
                    {paymentDetails.paymentType === 'partial' && paymentDetails.completed && (
                      <p><strong>Remaining Amount:</strong> Rs.0</p>
                    )}
                    <p><strong>Payment Date:</strong> {paymentDetails.paymentDate ? formatDate(paymentDetails.paymentDate) + ' ' + formatTime(paymentDetails.paymentDate) : 'N/A'}</p>
                  </div>
                ) : null}
                <button className="action-btn complete-btn" onClick={() => setShowPaymentModal(false)} style={{ marginTop: 20 }}>Close</button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
