import React, { useEffect, useState } from 'react';
import '../../CSS/Rewards.css';
import Sidebar from '../Sidebar';
import { FaUser, FaStar, FaSortUp, FaSortDown, FaSpinner } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

function capitalizeWords(str) {
  return str.replace(/\b\w+/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
}

export default function Rewards() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [sortBy, setSortBy] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/auth/users', {
        headers: {
          'auth-token': localStorage.getItem('admin-token')
        }
      });
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
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

  // Filter and sort users
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(search.toLowerCase()) ||
    (user.phoneNumber && user.phoneNumber.includes(search))
  );

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (sortBy === 'name') {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      if (nameA < nameB) return sortDirection === 'asc' ? -1 : 1;
      if (nameA > nameB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    } else if (sortBy === 'points') {
      return sortDirection === 'asc'
        ? (a.rewardPoints || 0) - (b.rewardPoints || 0)
        : (b.rewardPoints || 0) - (a.rewardPoints || 0);
    }
    return 0;
  });

  // Pagination logic
  const totalPages = Math.ceil(sortedUsers.length / itemsPerPage);
  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const paginatedUsers = sortedUsers.slice(start, end);

  // Claim reward handler
  const handleClaim = async (userId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/book/admin/reward/claim/${userId}`, {
        method: 'POST',
        headers: {
          'auth-token': localStorage.getItem('admin-token')
        }
      });
      if (!res.ok) throw new Error('Failed to claim reward');
      setUsers(users => users.map(u => u._id === userId ? { ...u, rewardPoints: 0 } : u));
    } catch (err) {
      alert('Error claiming reward: ' + err.message);
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
          <motion.div 
            className="attractive-search"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <input
              className="search-input"
              type="text"
              placeholder="Search by name or number..."
              value={search}
              onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
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
                <p>Loading users...</p>
              </motion.div>
            ) : error ? (
              <motion.div className="loading-state" style={{ color: 'red' }}>{error}</motion.div>
            ) : (
              <motion.table 
                className="appointments-table"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <thead>
                  <tr>
                    <th style={{cursor:'pointer', whiteSpace: 'nowrap'}} onClick={() => handleSort('name')}>
                      <FaUser /> Name
                      {sortBy === 'name' && (
                        sortDirection === 'asc' ? <FaSortUp className="sort-icon active" /> : <FaSortDown className="sort-icon active" />
                      )}
                      {sortBy !== 'name' && <FaSortUp className="sort-icon" style={{opacity:0.3}} />}
                    </th>
                    <th style={{whiteSpace: 'nowrap'}}>Number</th>
                    <th style={{cursor:'pointer', whiteSpace: 'nowrap'}} onClick={() => handleSort('points')}>
                      <FaStar style={{color:'#FFD700'}} /> Points
                      {sortBy === 'points' && (
                        sortDirection === 'asc' ? <FaSortUp className="sort-icon active" /> : <FaSortDown className="sort-icon active" />
                      )}
                      {sortBy !== 'points' && <FaSortUp className="sort-icon" style={{opacity:0.3}} />}
                    </th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {paginatedUsers.length === 0 ? (
                      <motion.tr
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <td colSpan="4" style={{ textAlign: 'center' }}>No users found.</td>
                      </motion.tr>
                    ) : (
                      paginatedUsers.map((user, index) => (
                        <motion.tr 
                          key={user._id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                          <td>{capitalizeWords(user.name)}</td>
                          <td>{user.phoneNumber}</td>
                          <td>{user.rewardPoints || 0}</td>
                          <td>
                            <motion.button 
                              className={`action-btn claim-btn`} 
                              onClick={() => handleClaim(user._id)}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              disabled={user.rewardPoints < 500}
                            >
                              <FaStar style={{color:'#fff', marginRight:6}} /> Claim
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
        </motion.div>
      </div>
    </div>
  );
}
