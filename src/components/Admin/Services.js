import React, { useState, useEffect } from 'react';
import Sidebar from '../Sidebar';
import '../../CSS/Service.css';
import { FaSortUp, FaSortDown, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

export default function Services() {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const servicesPerPage = 6;
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editService, setEditService] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', price: '', duration: '' });
  const [editError, setEditError] = useState('');
  const [editLoading, setEditLoading] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [addForm, setAddForm] = useState({ name: '', price: '', duration: '' });
  const [addError, setAddError] = useState('');
  const [addLoading, setAddLoading] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      try {
        const res = await fetch('http://localhost:5000/api/services');
        const data = await res.json();
        setServices(data);
        setError('');
      } catch (err) {
        setError('Failed to fetch services');
      }
      setLoading(false);
    };
    fetchServices();
  }, []);

  // Sorting logic for columns
  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  // Filter services by search
  const filteredServices = services.filter(service =>
    service.name.toLowerCase().includes(search.toLowerCase()) ||
    service.duration.toLowerCase().includes(search.toLowerCase()) ||
    service.price.toString().includes(search)
  );

  // Sort services by selected column
  const sortedServices = [...filteredServices].sort((a, b) => {
    if (sortBy === 'name') {
      if (a.name.toLowerCase() < b.name.toLowerCase()) return sortOrder === 'asc' ? -1 : 1;
      if (a.name.toLowerCase() > b.name.toLowerCase()) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    } else if (sortBy === 'price') {
      return sortOrder === 'asc' ? a.price - b.price : b.price - a.price;
    } else if (sortBy === 'duration') {
      // Extract minutes from duration string
      const getMinutes = (d) => {
        const minMatch = /([0-9]+)\s*min/.exec(d);
        if (minMatch) return parseInt(minMatch[1]);
        const hrMatch = /([0-9]+)\s*hr/.exec(d);
        if (hrMatch) return parseInt(hrMatch[1]) * 60;
        return 0;
      };
      return sortOrder === 'asc'
        ? getMinutes(a.duration) - getMinutes(b.duration)
        : getMinutes(b.duration) - getMinutes(a.duration);
    }
    return 0;
  });

  // Pagination logic
  const indexOfLastService = currentPage * servicesPerPage;
  const indexOfFirstService = indexOfLastService - servicesPerPage;
  const currentServices = sortedServices.slice(indexOfFirstService, indexOfLastService);
  const totalPages = Math.ceil(sortedServices.length / servicesPerPage);

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) setCurrentPage(page);
  };

  const openEditModal = (service) => {
    setEditService(service);
    setEditForm({ name: service.name, price: service.price, duration: service.duration });
    setEditError('');
    setEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
    setEditService(null);
    setEditForm({ name: '', price: '', duration: '' });
    setEditError('');
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    setEditError('');
    try {
      const res = await fetch(`http://localhost:5000/api/services/${editService._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': localStorage.getItem('admin-token')
        },
        body: JSON.stringify({
          name: editForm.name,
          price: editForm.price,
          duration: editForm.duration
        })
      });
      if (!res.ok) {
        const data = await res.json();
        setEditError(data.message || 'Failed to update service');
        setEditLoading(false);
        return;
      }
      // Update the service in the list
      const updated = await res.json();
      setServices(services.map(s => s._id === updated._id ? updated : s));
      closeEditModal();
    } catch (err) {
      setEditError('Network error');
    }
    setEditLoading(false);
  };

  const openAddModal = () => {
    setAddForm({ name: '', price: '', duration: '' });
    setAddError('');
    setAddModalOpen(true);
  };

  const closeAddModal = () => {
    setAddModalOpen(false);
    setAddForm({ name: '', price: '', duration: '' });
    setAddError('');
  };

  const handleAddChange = (e) => {
    setAddForm({ ...addForm, [e.target.name]: e.target.value });
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setAddLoading(true);
    setAddError('');
    try {
      const res = await fetch('http://localhost:5000/api/services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': localStorage.getItem('admin-token')
        },
        body: JSON.stringify(addForm)
      });
      if (!res.ok) {
        const data = await res.json();
        setAddError(data.message || 'Failed to add service');
        setAddLoading(false);
        return;
      }
      const newService = await res.json();
      setServices([...services, newService]);
      closeAddModal();
    } catch (err) {
      setAddError('Network error');
    }
    setAddLoading(false);
  };

  const openDeleteModal = (service) => {
    setServiceToDelete(service);
    setDeleteError('');
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setServiceToDelete(null);
    setDeleteError('');
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    setDeleteError('');
    try {
      const res = await fetch(`http://localhost:5000/api/services/${serviceToDelete._id}`, {
        method: 'DELETE',
        headers: {
          'auth-token': localStorage.getItem('admin-token')
        }
      });
      if (!res.ok) {
        const data = await res.json();
        setDeleteError(data.message || 'Failed to delete service');
        setDeleteLoading(false);
        return;
      }
      setServices(services.filter(s => s._id !== serviceToDelete._id));
      closeDeleteModal();
    } catch (err) {
      setDeleteError('Network error');
    }
    setDeleteLoading(false);
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
          <div className="services-header">
            <motion.div 
              className="attractive-search"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <input
                className="search-input"
                type="text"
                placeholder="Search services..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </motion.div>
            <motion.button
              className="add-service-btn"
              onClick={openAddModal}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaPlus /> Add Service
            </motion.button>
          </div>
          <div className="appointments-table-wrapper">
            {loading ? (
              <div>Loading...</div>
            ) : error ? (
              <div style={{ color: 'red' }}>{error}</div>
            ) : (
              <motion.table 
                className="appointments-table"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <thead>
                  <tr>
                    <th style={{cursor: 'pointer'}} onClick={() => handleSort('name')}>
                      <span style={{display: 'flex', alignItems: 'center'}}>
                        SERVICE
                        <span className="sort-icon" style={{marginLeft: 6}}>
                          {sortBy === 'name' && sortOrder === 'asc' ? (
                            <FaSortUp className="sort-icon" style={{color: '#6c7a89'}} />
                          ) : sortBy === 'name' && sortOrder === 'desc' ? (
                            <FaSortDown className="sort-icon active" />
                          ) : (
                            <FaSortUp className="sort-icon" style={{opacity:0.3}} />
                          )}
                        </span>
                      </span>
                    </th>
                    <th style={{cursor: 'pointer', textAlign: 'center'}} onClick={() => handleSort('price')}>
                      <span style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                        PRICE
                        <span className="sort-icon" style={{marginLeft: 6}}>
                          {sortBy === 'price' && sortOrder === 'asc' ? (
                            <FaSortUp className="sort-icon" style={{color: '#6c7a89'}} />
                          ) : sortBy === 'price' && sortOrder === 'desc' ? (
                            <FaSortDown className="sort-icon active" />
                          ) : (
                            <FaSortUp className="sort-icon" style={{opacity:0.3}} />
                          )}
                        </span>
                      </span>
                    </th>
                    <th style={{cursor: 'pointer', textAlign: 'center'}} onClick={() => handleSort('duration')}>
                      <span style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                        DURATION
                        <span className="sort-icon" style={{marginLeft: 6}}>
                          {sortBy === 'duration' && sortOrder === 'asc' ? (
                            <FaSortUp className="sort-icon" style={{color: '#6c7a89'}} />
                          ) : sortBy === 'duration' && sortOrder === 'desc' ? (
                            <FaSortDown className="sort-icon active" />
                          ) : (
                            <FaSortUp className="sort-icon" style={{opacity:0.3}} />
                          )}
                        </span>
                      </span>
                    </th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {currentServices.length === 0 ? (
                      <motion.tr
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <td colSpan="4" style={{ textAlign: 'center' }}>No services found.</td>
                      </motion.tr>
                    ) : (
                      currentServices.map((service, index) => (
                        <motion.tr 
                          key={service._id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                          <td>{service.name}</td>
                          <td>Rs.{service.price}</td>
                          <td>{service.duration}</td>
                          <td>
                            <motion.button 
                              className="action-btn edit-btn"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => openEditModal(service)}
                            >
                              <FaEdit /> Edit
                            </motion.button>
                            <motion.button 
                              className="action-btn delete-btn"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => openDeleteModal(service)}
                            >
                              <FaTrash /> Delete
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
        {/* Add Service Modal */}
        {addModalOpen && (
          <div className="modal-overlay enhanced-modal-overlay">
            <motion.div 
              className="modal-content enhanced-modal-content"
              initial={{ scale: 0.8, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <button className="modal-close-btn" onClick={closeAddModal} title="Close">&times;</button>
              <h2 className="modal-title">Add New Service</h2>
              <form onSubmit={handleAddSubmit} className="edit-service-form enhanced-edit-form">
                <label className="modal-label">Name:</label>
                <input className="modal-input" name="name" value={addForm.name} onChange={handleAddChange} required />
                <label className="modal-label">Price:</label>
                <input className="modal-input" name="price" type="number" min="0" value={addForm.price} onChange={handleAddChange} required />
                <label className="modal-label">Duration:</label>
                <input className="modal-input" name="duration" value={addForm.duration} onChange={handleAddChange} required />
                {addError && <div className="modal-error" style={{ color: 'red', marginTop: 8 }}>{addError}</div>}
                <div className="modal-actions enhanced-modal-actions">
                  <button type="button" className="modal-btn cancel-btn" onClick={closeAddModal} disabled={addLoading}>Cancel</button>
                  <button type="submit" className="modal-btn save-btn" disabled={addLoading}>{addLoading ? 'Adding...' : 'Add'}</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
        {/* Delete Confirmation Modal */}
        {deleteModalOpen && (
          <div className="modal-overlay enhanced-modal-overlay">
            <motion.div 
              className="modal-content enhanced-modal-content"
              initial={{ scale: 0.8, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <button className="modal-close-btn" onClick={closeDeleteModal} title="Close">&times;</button>
              <h2 className="modal-title">Delete Service</h2>
              <p>Are you sure you want to delete the service "{serviceToDelete?.name}"?</p>
              {deleteError && <div className="modal-error" style={{ color: 'red', marginTop: 8 }}>{deleteError}</div>}
              <div className="modal-actions enhanced-modal-actions">
                <button type="button" className="modal-btn cancel-btn" onClick={closeDeleteModal} disabled={deleteLoading}>Cancel</button>
                <button type="button" className="modal-btn delete-btn" onClick={handleDelete} disabled={deleteLoading}>
                  {deleteLoading ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
        {/* Edit Modal */}
        {editModalOpen && (
          <div className="modal-overlay enhanced-modal-overlay">
            <motion.div 
              className="modal-content enhanced-modal-content"
              initial={{ scale: 0.8, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <button className="modal-close-btn" onClick={closeEditModal} title="Close">&times;</button>
              <h2 className="modal-title">Edit Service</h2>
              <form onSubmit={handleEditSubmit} className="edit-service-form enhanced-edit-form">
                <label className="modal-label">Name:</label>
                <input className="modal-input" name="name" value={editForm.name} onChange={handleEditChange} required />
                <label className="modal-label">Price:</label>
                <input className="modal-input" name="price" type="number" min="0" value={editForm.price} onChange={handleEditChange} required />
                <label className="modal-label">Duration:</label>
                <input className="modal-input" name="duration" value={editForm.duration} onChange={handleEditChange} required />
                {editError && <div className="modal-error" style={{ color: 'red', marginTop: 8 }}>{editError}</div>}
                <div className="modal-actions enhanced-modal-actions">
                  <button type="button" className="modal-btn cancel-btn" onClick={closeEditModal} disabled={editLoading}>Cancel</button>
                  <button type="submit" className="modal-btn save-btn" disabled={editLoading}>{editLoading ? 'Saving...' : 'Save'}</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
