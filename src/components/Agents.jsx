import React, { useState } from 'react';
import { Plus, Users, Edit, Trash2, Phone, Bike, CreditCard, Search, Filter, UserCheck, UserX } from 'lucide-react';
import '../styles/Home.css';

const Agents = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingAgent, setEditingAgent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [agents, setAgents] = useState([
    {
      id: 'AGT001',
      name: 'Rajesh Kumar',
      phone: '+91 98765 43210',
      bikeNumber: 'MH01-AB-1234',
      aadharNumber: '1234-5678-9012',
      status: 'active',
      joinDate: '2024-01-01',
      totalDeliveries: 45,
      rating: 4.8
    },
    {
      id: 'AGT002',
      name: 'Priya Sharma',
      phone: '+91 87654 32109',
      bikeNumber: 'DL02-CD-5678',
      aadharNumber: '2345-6789-0123',
      status: 'active',
      joinDate: '2024-01-15',
      totalDeliveries: 32,
      rating: 4.6
    },
    {
      id: 'AGT003',
      name: 'Amit Patel',
      phone: '+91 76543 21098',
      bikeNumber: 'GJ03-EF-9012',
      aadharNumber: '3456-7890-1234',
      status: 'inactive',
      joinDate: '2023-12-01',
      totalDeliveries: 28,
      rating: 4.2
    }
  ]);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    bikeNumber: '',
    aadharNumber: ''
  });

  const [formErrors, setFormErrors] = useState({});

  const statusOptions = [
    { value: 'all', label: 'All Agents', color: 'secondary' },
    { value: 'active', label: 'Active', color: 'success' },
    { value: 'inactive', label: 'Inactive', color: 'danger' }
  ];

  const filteredAgents = agents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agent.phone.includes(searchTerm) ||
                         agent.bikeNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agent.aadharNumber.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || agent.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!/^[+]?[0-9\s\-()]{10,15}$/.test(formData.phone.replace(/\s/g, ''))) {
      errors.phone = 'Please enter a valid phone number';
    }
    
    if (!formData.bikeNumber.trim()) {
      errors.bikeNumber = 'Bike number is required';
    } else if (!/^[A-Z]{2}[0-9]{2}-[A-Z]{2}-[0-9]{4}$/.test(formData.bikeNumber)) {
      errors.bikeNumber = 'Please enter valid bike number (e.g., MH01-AB-1234)';
    }
    
    if (!formData.aadharNumber.trim()) {
      errors.aadharNumber = 'Aadhar number is required';
    } else if (!/^[0-9]{4}-[0-9]{4}-[0-9]{4}$/.test(formData.aadharNumber)) {
      errors.aadharNumber = 'Please enter valid Aadhar number (e.g., 1234-5678-9012)';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddAgent = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const newAgent = {
      id: `AGT${String(agents.length + 1).padStart(3, '0')}`,
      ...formData,
      status: 'active',
      joinDate: new Date().toISOString().split('T')[0],
      totalDeliveries: 0,
      rating: 5.0
    };

    setAgents(prevAgents => [...prevAgents, newAgent]);
    setFormData({ name: '', phone: '', bikeNumber: '', aadharNumber: '' });
    setFormErrors({});
    setShowAddForm(false);
  };

  const handleEditAgent = (agent) => {
    setEditingAgent(agent);
    setFormData({
      name: agent.name,
      phone: agent.phone,
      bikeNumber: agent.bikeNumber,
      aadharNumber: agent.aadharNumber
    });
    setFormErrors({});
    setShowEditForm(true);
  };

  const handleUpdateAgent = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setAgents(prevAgents =>
      prevAgents.map(agent =>
        agent.id === editingAgent.id
          ? { ...agent, ...formData }
          : agent
      )
    );

    setFormData({ name: '', phone: '', bikeNumber: '', aadharNumber: '' });
    setFormErrors({});
    setShowEditForm(false);
    setEditingAgent(null);
  };

  const handleDeleteAgent = (id) => {
    if (window.confirm('Are you sure you want to delete this agent?')) {
      setAgents(prevAgents => prevAgents.filter(agent => agent.id !== id));
    }
  };

  const handleToggleStatus = (id) => {
    setAgents(prevAgents =>
      prevAgents.map(agent =>
        agent.id === id
          ? { ...agent, status: agent.status === 'active' ? 'inactive' : 'active' }
          : agent
      )
    );
  };

  const handleCloseForms = () => {
    setShowAddForm(false);
    setShowEditForm(false);
    setEditingAgent(null);
    setFormData({ name: '', phone: '', bikeNumber: '', aadharNumber: '' });
    setFormErrors({});
  };


  const getStatusBadge = (status) => {
    return status === 'active' ? (
      <span className="badge bg-success d-flex align-items-center gap-1">
        <UserCheck size={8} />
        Active
      </span>
    ) : (
      <span className="badge bg-danger d-flex align-items-center gap-1">
        <UserX size={8} />
        Inactive
      </span>
    );
  };

  return (
    <div>
      <div className="sticky-top bg-white border-bottom shadow-sm">
        <div className="container-fluid d-flex justify-content-between align-items-center py-3 px-3">
          <h5 className="mb-0">
            <Users className="me-2" size={20} />
            Delivery Agents Management
          </h5>
          <button
            className="btn btn-primary"
            onClick={() => setShowAddForm(true)}
          >
            <Plus className="me-2" size={16} />
            Add Agent
          </button>
        </div>
      </div>

      <div className="container-fluid py-4 sticky-content">
        {/* Search and Filter */}
        <div className="row mb-4 mx-3">
          <div className="col-md-6">
            <div className="input-group">
              <span className="input-group-text">
                <Search size={16} />
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Search agents by name, phone, bike number, or Aadhar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="input-group">
              <span className="input-group-text">
                <Filter size={16} />
              </span>
              <select
                className="form-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Agents List */}
        <div className="mx-3">
          {filteredAgents.length === 0 ? (
            <div className="card bg-white shadow-sm">
              <div className="card-body text-center py-5">
                <Users size={64} className="text-muted mb-3" />
                <h5 className="text-muted">No agents found</h5>
                <p className="text-muted">Click "Add Agent" to start adding delivery agents</p>
              </div>
            </div>
          ) : (
            <div className="row g-3">
              {filteredAgents.map((agent) => (
                <div key={agent.id} className="col-xl-3 col-lg-4 col-md-6 col-sm-6">
                  <div className="card bg-white shadow-sm h-100">
                    <div className="card-header bg-white border-bottom py-2 px-3">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <h6 className="mb-0 fw-bold text-primary fs-6">{agent.id}</h6>
                          <small className="text-muted small">Joined: {agent.joinDate}</small>
                        </div>
                        <div className="d-flex align-items-center gap-1">
                          <div className="form-check form-switch">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              checked={agent.status === 'active'}
                              onChange={() => handleToggleStatus(agent.id)}
                              style={{ transform: 'scale(0.7)' }}
                            />
                          </div>
                          {getStatusBadge(agent.status)}
                        </div>
                      </div>
                    </div>
                    <div className="card-body p-3">
                      <div className="text-center mb-2">
                        <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-1" style={{ width: '40px', height: '40px' }}>
                          <Users size={18} className="text-primary" />
                        </div>
                        <h6 className="mb-1 fs-6">{agent.name}</h6>
                      </div>
                      
                      <div className="mb-2">
                        <div className="d-flex align-items-center mb-1">
                          <Phone size={12} className="me-2 text-secondary" />
                          <div>
                            <small className="text-muted d-block small">Phone</small>
                            <span className="fw-medium small">{agent.phone}</span>
                          </div>
                        </div>
                        <div className="d-flex align-items-center mb-1">
                          <Bike size={12} className="me-2 text-secondary" />
                          <div>
                            <small className="text-muted d-block small">Bike</small>
                            <span className="fw-medium small">{agent.bikeNumber}</span>
                          </div>
                        </div>
                        <div className="d-flex align-items-center">
                          <CreditCard size={12} className="me-2 text-secondary" />
                          <div>
                            <small className="text-muted d-block small">Aadhar</small>
                            <span className="fw-medium small">{agent.aadharNumber}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-center">
                        <div className="bg-light rounded p-2">
                          <div className="fw-bold fs-5 text-primary">{agent.totalDeliveries}</div>
                          <small className="text-muted small">Deliveries</small>
                          <div className="mt-1">
                            <span className="badge bg-warning text-dark small">
                              ⭐ {agent.rating}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="card-footer bg-white border-top py-2 px-3">
                      <div className="d-flex gap-1">
                        <button
                          className="btn btn-outline-secondary btn-sm flex-fill"
                          onClick={() => handleEditAgent(agent)}
                        >
                          <Edit size={12} className="me-1" />
                          Edit
                        </button>
                        <button
                          className="btn btn-outline-danger btn-sm flex-fill"
                          onClick={() => handleDeleteAgent(agent.id)}
                        >
                          <Trash2 size={12} className="me-1" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Agent Modal */}
      {showAddForm && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <Users className="me-2" size={20} />
                  Add New Delivery Agent
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseForms}
                ></button>
              </div>
              <form onSubmit={handleAddAgent}>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="name" className="form-label">
                        <Users className="me-2" size={16} />
                        Full Name *
                      </label>
                      <input
                        type="text"
                        className={`form-control ${formErrors.name ? 'is-invalid' : ''}`}
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter agent's full name"
                      />
                      {formErrors.name && (
                        <div className="invalid-feedback">{formErrors.name}</div>
                      )}
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="phone" className="form-label">
                        <Phone className="me-2" size={16} />
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        className={`form-control ${formErrors.phone ? 'is-invalid' : ''}`}
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+91 98765 43210"
                      />
                      {formErrors.phone && (
                        <div className="invalid-feedback">{formErrors.phone}</div>
                      )}
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="bikeNumber" className="form-label">
                        <Bike className="me-2" size={16} />
                        Bike Number *
                      </label>
                      <input
                        type="text"
                        className={`form-control ${formErrors.bikeNumber ? 'is-invalid' : ''}`}
                        id="bikeNumber"
                        name="bikeNumber"
                        value={formData.bikeNumber}
                        onChange={handleInputChange}
                        placeholder="MH01-AB-1234"
                        style={{ textTransform: 'uppercase' }}
                      />
                      {formErrors.bikeNumber && (
                        <div className="invalid-feedback">{formErrors.bikeNumber}</div>
                      )}
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="aadharNumber" className="form-label">
                        <CreditCard className="me-2" size={16} />
                        Aadhar Number *
                      </label>
                      <input
                        type="text"
                        className={`form-control ${formErrors.aadharNumber ? 'is-invalid' : ''}`}
                        id="aadharNumber"
                        name="aadharNumber"
                        value={formData.aadharNumber}
                        onChange={handleInputChange}
                        placeholder="1234-5678-9012"
                      />
                      {formErrors.aadharNumber && (
                        <div className="invalid-feedback">{formErrors.aadharNumber}</div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleCloseForms}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    <Plus className="me-2" size={16} />
                    Add Agent
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Agent Modal */}
      {showEditForm && editingAgent && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <Edit className="me-2" size={20} />
                  Edit Delivery Agent
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseForms}
                ></button>
              </div>
              <form onSubmit={handleUpdateAgent}>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="editName" className="form-label">
                        <Users className="me-2" size={16} />
                        Full Name *
                      </label>
                      <input
                        type="text"
                        className={`form-control ${formErrors.name ? 'is-invalid' : ''}`}
                        id="editName"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter agent's full name"
                      />
                      {formErrors.name && (
                        <div className="invalid-feedback">{formErrors.name}</div>
                      )}
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="editPhone" className="form-label">
                        <Phone className="me-2" size={16} />
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        className={`form-control ${formErrors.phone ? 'is-invalid' : ''}`}
                        id="editPhone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+91 98765 43210"
                      />
                      {formErrors.phone && (
                        <div className="invalid-feedback">{formErrors.phone}</div>
                      )}
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="editBikeNumber" className="form-label">
                        <Bike className="me-2" size={16} />
                        Bike Number *
                      </label>
                      <input
                        type="text"
                        className={`form-control ${formErrors.bikeNumber ? 'is-invalid' : ''}`}
                        id="editBikeNumber"
                        name="bikeNumber"
                        value={formData.bikeNumber}
                        onChange={handleInputChange}
                        placeholder="MH01-AB-1234"
                        style={{ textTransform: 'uppercase' }}
                      />
                      {formErrors.bikeNumber && (
                        <div className="invalid-feedback">{formErrors.bikeNumber}</div>
                      )}
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="editAadharNumber" className="form-label">
                        <CreditCard className="me-2" size={16} />
                        Aadhar Number *
                      </label>
                      <input
                        type="text"
                        className={`form-control ${formErrors.aadharNumber ? 'is-invalid' : ''}`}
                        id="editAadharNumber"
                        name="aadharNumber"
                        value={formData.aadharNumber}
                        onChange={handleInputChange}
                        placeholder="1234-5678-9012"
                      />
                      {formErrors.aadharNumber && (
                        <div className="invalid-feedback">{formErrors.aadharNumber}</div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleCloseForms}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    <Edit className="me-2" size={16} />
                    Update Agent
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Agents;
