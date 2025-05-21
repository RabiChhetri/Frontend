import React, { useEffect, useState } from 'react';
import Sidebar from '../Sidebar';
import '../../CSS/User.css';
import { FaReply, FaSpinner, FaCheck, FaSearch } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

export default function Admincontact() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [replyModalOpen, setReplyModalOpen] = useState(false);
  const [currentContact, setCurrentContact] = useState(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [sendingReply, setSendingReply] = useState(false);
  const contactsPerPage = 5;

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/contact/all', {
        headers: {
          'auth-token': localStorage.getItem('admin-token')
        }
      });
      if (!res.ok) throw new Error('Failed to fetch contacts');
      const data = await res.json();
      setContacts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Filter contacts by search
  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(search.toLowerCase()) ||
    contact.email.toLowerCase().includes(search.toLowerCase()) ||
    contact.message.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination logic
  const indexOfLastContact = currentPage * contactsPerPage;
  const indexOfFirstContact = indexOfLastContact - contactsPerPage;
  const currentContacts = filteredContacts.slice(indexOfFirstContact, indexOfLastContact);
  const totalPages = Math.ceil(filteredContacts.length / contactsPerPage);

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) setCurrentPage(page);
  };

  // Open reply modal
  const handleReplyClick = (contact) => {
    setCurrentContact(contact);
    setReplyMessage('');
    setReplyModalOpen(true);
  };

  // Send reply
  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!currentContact || !replyMessage.trim()) return;

    setSendingReply(true);
    try {
      const res = await fetch(`http://localhost:5000/api/contact/reply/${currentContact._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': localStorage.getItem('admin-token')
        },
        body: JSON.stringify({ replyMessage })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to send reply');
      }

      // Update the contact in the state
      setContacts(contacts.map(contact => 
        contact._id === currentContact._id 
          ? { ...contact, replied: true, replyMessage, replyDate: new Date() } 
          : contact
      ));
      
      // Close modal
      setReplyModalOpen(false);
      setCurrentContact(null);
    } catch (err) {
      alert('Error sending reply: ' + err.message);
    } finally {
      setSendingReply(false);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
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
          <h2 style={{ marginBottom: '1.5rem' }}>Contact Messages</h2>
          <motion.div 
            className="attractive-search"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <FaSearch className="search-icon" />
            <input
              className="search-input"
              type="text"
              placeholder="Search messages..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </motion.div>
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
                <p>Loading contact messages...</p>
              </motion.div>
            ) : error ? (
              <motion.div 
                className="loading-state"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <p style={{ color: 'red' }}>{error}</p>
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
                    <th>Name</th>
                    <th>Email</th>
                    <th>Message</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {currentContacts.length === 0 ? (
                      <motion.tr
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <td colSpan="6" style={{ textAlign: 'center' }}>No contact messages found.</td>
                      </motion.tr>
                    ) : (
                      currentContacts.map((contact, index) => (
                        <motion.tr 
                          key={contact._id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                          <td>{contact.name}</td>
                          <td>{contact.email}</td>
                          <td style={{ maxWidth: '250px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {contact.message}
                          </td>
                          <td>{formatDate(contact.date)}</td>
                          <td>
                            <span className={`status ${contact.replied ? 'confirmed' : 'pending'}`}>
                              {contact.replied ? 'Replied' : 'Pending'}
                            </span>
                          </td>
                          <td>
                            <motion.button 
                              className={`action-btn ${contact.replied ? 'edit-btn' : 'complete-btn'}`}
                              onClick={() => handleReplyClick(contact)}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              disabled={sendingReply}
                            >
                              {contact.replied ? <FaCheck /> : <FaReply />} 
                              {contact.replied ? 'View Reply' : 'Reply'}
                            </motion.button>
                          </td>
                        </motion.tr>
                      ))
                    )}
                  </AnimatePresence>
                </tbody>
              </motion.table>
            )}
          </div>
          {totalPages > 1 && (
            <motion.div 
              className="pagination-controls"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <motion.button 
                className="pagination-btn" 
                onClick={() => handlePageChange(currentPage - 1)} 
                disabled={currentPage === 1}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Previous
              </motion.button>
              {[...Array(totalPages)].map((_, idx) => (
                <motion.button
                  key={idx + 1}
                  className={`pagination-btn${currentPage === idx + 1 ? ' active' : ''}`}
                  onClick={() => handlePageChange(idx + 1)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {idx + 1}
                </motion.button>
              ))}
              <motion.button 
                className="pagination-btn" 
                onClick={() => handlePageChange(currentPage + 1)} 
                disabled={currentPage === totalPages}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Next
              </motion.button>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Reply Modal */}
      {replyModalOpen && (
        <div className="modal-backdrop">
          <motion.div 
            className="modal-content"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
          >
            <h3>{currentContact.replied ? 'View Reply' : 'Reply to Contact'}</h3>
            
            <div className="message-container" style={{ marginBottom: '1.5rem' }}>
              <h4>Original Message:</h4>
              <div style={{ background: '#f5f5f5', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
                <p><strong>From:</strong> {currentContact.name} ({currentContact.email})</p>
                <p><strong>Date:</strong> {formatDate(currentContact.date)}</p>
                <p><strong>Message:</strong></p>
                <p style={{ whiteSpace: 'pre-wrap' }}>{currentContact.message}</p>
              </div>
            </div>

            {currentContact.replied ? (
              <div className="reply-container">
                <h4>Your Reply:</h4>
                <div style={{ background: '#e6f7ff', padding: '1rem', borderRadius: '8px' }}>
                  <p><strong>Date:</strong> {formatDate(currentContact.replyDate)}</p>
                  <p style={{ whiteSpace: 'pre-wrap' }}>{currentContact.replyMessage}</p>
                </div>
                <div className="modal-actions">
                  <motion.button
                    type="button"
                    className="action-btn edit-btn"
                    onClick={() => setReplyModalOpen(false)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Close
                  </motion.button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSendReply}>
                <div className="form-group">
                  <label htmlFor="replyMessage">Your Reply:</label>
                  <textarea
                    id="replyMessage"
                    name="replyMessage"
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    required
                    rows="6"
                    style={{ width: '100%', padding: '0.8rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}
                  ></textarea>
                </div>
                <div className="modal-actions">
                  <motion.button
                    type="button"
                    className="action-btn delete-btn"
                    onClick={() => setReplyModalOpen(false)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={sendingReply}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="submit"
                    className="action-btn complete-btn"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={sendingReply}
                  >
                    {sendingReply ? (
                      <>
                        <FaSpinner className="spinner" /> Sending...
                      </>
                    ) : (
                      <>Send Reply</>
                    )}
                  </motion.button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
}