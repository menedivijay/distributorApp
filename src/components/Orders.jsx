import React, { useState } from 'react';
import { Package, Calendar, Clock, User, MapPin, Search, Filter, CheckCircle, Truck, Users } from 'lucide-react';
import '../styles/Home.css';

const Orders = () => {
  const [orders, setOrders] = useState([
    {
      id: 'ORD001',
      customerName: 'John Doe',
      customerPhone: '+91 98765 43210',
      customerAddress: '123 Main Street, Mumbai, Maharashtra 400001',
      orderDate: '2024-01-15',
      orderTime: '10:30 AM',
      status: 'pending',
      deliveryDate: null,
      totalAmount: 1250.00,
      items: [
        { id: 'ITEM001', name: 'Diwali Gift Box', quantity: 2, price: 500.00 },
        { id: 'ITEM002', name: 'Sweets Combo', quantity: 1, price: 250.00 }
      ],
      paymentMethod: 'Cash on Delivery',
      notes: 'Please deliver in the evening',
      assignedAgent: null
    },
    {
      id: 'ORD002',
      customerName: 'Priya Sharma',
      customerPhone: '+91 87654 32109',
      customerAddress: '456 Park Avenue, Delhi, Delhi 110001',
      orderDate: '2024-01-15',
      orderTime: '11:45 AM',
      status: 'ready',
      deliveryDate: '2024-01-16',
      totalAmount: 850.00,
      items: [
        { id: 'ITEM003', name: 'Fireworks Pack', quantity: 1, price: 350.00 },
        { id: 'ITEM004', name: 'Decorative Lights', quantity: 2, price: 250.00 }
      ],
      paymentMethod: 'Online Payment',
      notes: '',
      assignedAgent: null
    },
    {
      id: 'ORD003',
      customerName: 'Raj Patel',
      customerPhone: '+91 76543 21098',
      customerAddress: '789 Garden Road, Bangalore, Karnataka 560001',
      orderDate: '2024-01-14',
      orderTime: '09:15 AM',
      status: 'delivered',
      deliveryDate: '2024-01-15',
      totalAmount: 2100.00,
      items: [
        { id: 'ITEM005', name: 'Premium Gift Hamper', quantity: 1, price: 1500.00 },
        { id: 'ITEM006', name: 'Chocolate Box', quantity: 3, price: 200.00 }
      ],
      paymentMethod: 'Card Payment',
      notes: 'Delivered successfully',
      assignedAgent: null
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const [deliveryDate, setDeliveryDate] = useState('');
  const [assignedAgent, setAssignedAgent] = useState('');

  // Mock agents data (in real app, this would come from props or API)
  const [agents] = useState([
    {
      id: 'AGT001',
      name: 'Rajesh Kumar',
      phone: '+91 98765 43210',
      bikeNumber: 'MH01-AB-1234',
      status: 'active'
    },
    {
      id: 'AGT002',
      name: 'Priya Sharma',
      phone: '+91 87654 32109',
      bikeNumber: 'DL02-CD-5678',
      status: 'active'
    },
    {
      id: 'AGT003',
      name: 'Amit Patel',
      phone: '+91 76543 21098',
      bikeNumber: 'GJ03-EF-9012',
      status: 'inactive'
    }
  ]);

  const statusOptions = [
    { value: 'all', label: 'All Orders', color: 'secondary' },
    { value: 'pending', label: 'Pending', color: 'warning' },
    { value: 'ready', label: 'Ready', color: 'info' },
    { value: 'delivered', label: 'Delivered', color: 'success' }
  ];

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customerPhone.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusUpdate = (orderId, newStatus) => {
    if (newStatus === 'ready' || newStatus === 'delivered') {
      setSelectedOrder(orderId);
      setShowDeliveryModal(true);
      return;
    }
    
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId
          ? { ...order, status: newStatus }
          : order
      )
    );
  };

  const handleDeliveryDateConfirm = () => {
    if (!deliveryDate) {
      alert('Please select a delivery date');
      return;
    }

    if (!assignedAgent) {
      alert('Please select a delivery agent');
      return;
    }

    const selectedAgent = agents.find(agent => agent.id === assignedAgent);

    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === selectedOrder
          ? { 
              ...order, 
              status: 'ready', 
              deliveryDate: deliveryDate,
              assignedAgent: {
                id: selectedAgent.id,
                name: selectedAgent.name,
                phone: selectedAgent.phone,
                bikeNumber: selectedAgent.bikeNumber
              }
            }
          : order
      )
    );

    setShowDeliveryModal(false);
    setSelectedOrder(null);
    setDeliveryDate('');
    setAssignedAgent('');
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: 'warning', icon: Clock, text: 'Pending' },
      ready: { color: 'info', icon: Package, text: 'Ready' },
      delivered: { color: 'success', icon: CheckCircle, text: 'Delivered' }
    };

    const config = statusConfig[status];
    const IconComponent = config.icon;

    return (
      <span className={`badge bg-${config.color} d-flex align-items-center gap-1`}>
        <IconComponent size={8} />
        {config.text}
      </span>
    );
  };

  const getStatusActions = (order) => {
    switch (order.status) {
      case 'pending':
        return (
          <button
            className="btn btn-success btn-sm"
            onClick={() => handleStatusUpdate(order.id, 'ready')}
          >
            <Package size={14} className="me-1" />
            Mark Ready
          </button>
        );
      case 'ready':
        return (
          <button
            className="btn btn-primary btn-sm"
            onClick={() => handleStatusUpdate(order.id, 'delivered')}
          >
            <Truck size={14} className="me-1" />
            Mark Delivered
          </button>
        );
      case 'delivered':
        return (
          <span className="text-success small">
            <CheckCircle size={14} className="me-1" />
            Completed
          </span>
        );
      default:
        return null;
    }
  };

  // Calculate summary statistics
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(order => order.status === 'pending').length;
  const readyOrders = orders.filter(order => order.status === 'ready').length;
  const deliveredOrders = orders.filter(order => order.status === 'delivered').length;

  return (
    <div className="sticky-container">
      <div className="sticky-top bg-white border-bottom shadow-sm">
        <div className="container-fluid d-flex justify-content-between align-items-center py-3 px-3">
          <h5 className="mb-0">
            <Package className="me-2" size={20} />
            Orders Management
          </h5>
        </div>
      </div>

      <div className="container-fluid py-4 sticky-content">
        {/* Summary Cards */}
        <div className="row mb-4 mx-5">
          <div className="col-md-3 mb-3">
            <div className="card bg-white shadow-sm">
              <div className="card-body text-center">
                <h6 className="card-title text-muted mb-2">Total Orders</h6>
                <h3 className="mb-0 text-primary">{totalOrders}</h3>
              </div>
            </div>
          </div>
          <div className="col-md-3 mb-3">
            <div className="card bg-white shadow-sm">
              <div className="card-body text-center">
                <h6 className="card-title text-muted mb-2">Pending</h6>
                <h3 className="mb-0 text-warning">{pendingOrders}</h3>
              </div>
            </div>
          </div>
          <div className="col-md-3 mb-3">
            <div className="card bg-white shadow-sm">
              <div className="card-body text-center">
                <h6 className="card-title text-muted mb-2">Ready</h6>
                <h3 className="mb-0 text-info">{readyOrders}</h3>
              </div>
            </div>
          </div>
          <div className="col-md-3 mb-3">
            <div className="card bg-white shadow-sm">
              <div className="card-body text-center">
                <h6 className="card-title text-muted mb-2">Delivered</h6>
                <h3 className="mb-0 text-success">{deliveredOrders}</h3>
              </div>
            </div>
          </div>
        </div>

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
                placeholder="Search orders by ID, customer name, or phone..."
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

        {/* Orders Cards */}
        <div className="mx-3">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 className="mb-0">Orders List</h5>
            <span className="text-muted">{filteredOrders.length} orders found</span>
          </div>
          
          {filteredOrders.length === 0 ? (
            <div className="card bg-white shadow-sm">
              <div className="card-body text-center py-5">
                <Package size={64} className="text-muted mb-3" />
                <h5 className="text-muted">No orders found</h5>
                <p className="text-muted">Orders will appear here when customers place them</p>
              </div>
            </div>
          ) : (
            <div className="row">
              {filteredOrders.map((order) => (
                <div key={order.id} className="col-lg-6 col-xl-4 mb-4">
                  <div className="card bg-white shadow-sm h-100">
                    <div className="card-header bg-white border-bottom d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="mb-0 fw-bold text-primary">{order.id}</h6>
                        <small className="text-muted">{order.orderDate} at {order.orderTime}</small>
                      </div>
                      {getStatusBadge(order.status)}
                    </div>
                    
                    <div className="card-body">
                      {/* Customer Information */}
                      <div className="mb-3">
                        <h6 className="mb-1 d-flex align-items-center">
                          <User size={16} className="me-2 text-secondary" />
                          {order.customerName}
                        </h6>
                        <p className="mb-1 text-muted small">{order.customerPhone}</p>
                        <p className="mb-0 text-muted small">
                          <MapPin size={14} className="me-1" />
                          {order.customerAddress}
                        </p>
                      </div>

                      {/* Order Items Preview */}
                      <div className="mb-3">
                        <h6 className="mb-2 small fw-bold">Order Items:</h6>
                        <div className="small">
                          {order.items.slice(0, 2).map((item, index) => (
                            <div key={index} className="d-flex justify-content-between mb-1">
                              <span>{item.name} x{item.quantity}</span>
                              <span>₹{(item.quantity * item.price).toFixed(2)}</span>
                            </div>
                          ))}
                          {order.items.length > 2 && (
                            <div className="text-muted small">
                              +{order.items.length - 2} more items
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Payment & Delivery */}
                      <div className="mb-3">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span className="small text-muted">Payment:</span>
                          <span className="small fw-bold">{order.paymentMethod}</span>
                        </div>
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <span className="small text-muted">Delivery:</span>
                          {order.deliveryDate ? (
                            <div className="d-flex align-items-center">
                              <Calendar size={14} className="me-1 text-info" />
                              <span className="small">{order.deliveryDate}</span>
                            </div>
                          ) : (
                            <span className="text-muted small">Not set</span>
                          )}
                        </div>
                        {order.assignedAgent && (
                          <div className="d-flex justify-content-between align-items-center">
                            <span className="small text-muted">Agent:</span>
                            <div className="d-flex align-items-center">
                              <Users size={14} className="me-1 text-primary" />
                              <span className="small">{order.assignedAgent.name}</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Total Amount */}
                      <div className="border-top pt-2 mb-3">
                        <div className="d-flex justify-content-between align-items-center">
                          <span className="fw-bold">Total Amount:</span>
                          <span className="fw-bold text-primary fs-5">₹{order.totalAmount.toFixed(2)}</span>
                        </div>
                      </div>

                      {/* Notes */}
                      {order.notes && (
                        <div className="mb-3">
                          <h6 className="mb-1 small fw-bold">Notes:</h6>
                          <p className="small text-muted mb-0">{order.notes}</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="card-footer bg-white border-top">
                      <div className="d-flex justify-content-between align-items-center">
                        <button
                          className="btn btn-outline-secondary btn-sm"
                          data-bs-toggle="modal"
                          data-bs-target={`#orderModal${order.id}`}
                        >
                          View Details
                        </button>
                        {getStatusActions(order)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Order Details Modal */}
        {filteredOrders.map((order) => (
          <div key={order.id} className="modal fade" id={`orderModal${order.id}`} tabIndex="-1">
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Order Details - {order.id}</h5>
                  <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-6">
                      <h6>Customer Information</h6>
                      <p><User size={16} className="me-2" /> {order.customerName}</p>
                      <p><strong>Phone:</strong> {order.customerPhone}</p>
                      <p><MapPin size={16} className="me-2" /> {order.customerAddress}</p>
                    </div>
                    <div className="col-md-6">
                      <h6>Order Information</h6>
                      <p><strong>Order Date:</strong> {order.orderDate} at {order.orderTime}</p>
                      <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
                      <p><strong>Status:</strong> {getStatusBadge(order.status)}</p>
                      {order.deliveryDate && (
                        <p><Calendar size={16} className="me-2" /> Delivery Date: {order.deliveryDate}</p>
                      )}
                      {order.assignedAgent && (
                        <p><Users size={16} className="me-2" /> Assigned Agent: {order.assignedAgent.name} ({order.assignedAgent.bikeNumber})</p>
                      )}
                    </div>
                  </div>
                  
                  <hr />
                  
                  <h6>Order Items</h6>
                  <div className="table-responsive">
                    <table className="table table-sm">
                      <thead>
                        <tr>
                          <th>Item</th>
                          <th>Quantity</th>
                          <th>Price</th>
                          <th>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {order.items.map((item) => (
                          <tr key={item.id}>
                            <td>{item.name}</td>
                            <td>{item.quantity}</td>
                            <td>₹{item.price.toFixed(2)}</td>
                            <td>₹{(item.quantity * item.price).toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <h5>Total Amount: ₹{order.totalAmount.toFixed(2)}</h5>
                    {order.notes && (
                      <div>
                        <strong>Notes:</strong> {order.notes}
                      </div>
                    )}
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                    Close
                  </button>
                  {getStatusActions(order)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Delivery Date Selection Modal */}
      {showDeliveryModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Set Delivery Date</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowDeliveryModal(false);
                    setDeliveryDate('');
                    setAssignedAgent('');
                  }}
                ></button>
              </div>
              <div className="modal-body">
                <p>Please select a delivery date and assign an agent for order <strong>{selectedOrder}</strong></p>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="deliveryDate" className="form-label">
                      <Calendar size={16} className="me-2" />
                      Delivery Date *
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      id="deliveryDate"
                      value={deliveryDate}
                      onChange={(e) => setDeliveryDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="assignedAgent" className="form-label">
                      <Users size={16} className="me-2" />
                      Assign Agent *
                    </label>
                    <select
                      className="form-select"
                      id="assignedAgent"
                      value={assignedAgent}
                      onChange={(e) => setAssignedAgent(e.target.value)}
                      required
                    >
                      <option value="">Select an agent</option>
                      {agents.filter(agent => agent.status === 'active').map(agent => (
                        <option key={agent.id} value={agent.id}>
                          {agent.name} - {agent.bikeNumber}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowDeliveryModal(false);
                    setDeliveryDate('');
                    setAssignedAgent('');
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleDeliveryDateConfirm}
                >
                  <Calendar size={16} className="me-2" />
                  Confirm Delivery Date
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;