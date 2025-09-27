import {  useState } from 'react';
import { Plus, Package, Edit, Trash2 } from 'lucide-react';
import AddItemForm from './AddItemForm';
import EditItemForm from './EditItemForm';

const Menu = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [items, setItems] = useState([
     
  ]);


  const handleAddItem = (newItem) => {
    // const response=fetch
    setItems(prevItems => [...prevItems, newItem]);
    console.log('New item added:', newItem);
  };

  const handleShowAddForm = () => {
    setShowAddForm(true);
  };

  const handleCloseAddForm = () => {
    setShowAddForm(false);
  };

  const handleToggleStatus = (id) => {
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === id
          ? { ...item, status: item.status === 'active' ? 'inactive' : 'active' }
          : item
      )
    );
  };
 
  

  const handleEditItem = (id) => {
    const itemToEdit = items.find(item => item.id === id);
    if (itemToEdit) {
      setEditingItem(itemToEdit);
      setShowEditForm(true);
    }
  };

  const handleUpdateItem = (updatedItem) => {
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === updatedItem.id ? updatedItem : item
      )
    );
    console.log('Item updated:', updatedItem);
  };

  const handleCloseEditForm = () => {
    setShowEditForm(false);
    setEditingItem(null);
  };

  const handleDeleteItem = (id) => {
    setItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  // Calculate summary statistics
  const totalItems = items.length;
  const activeItems = items.filter(item => item.status === 'active').length;
  const inactiveItems = items.filter(item => item.status === 'inactive').length;

  return (
    <div>
      <div className="sticky-top bg-white border-bottom shadow-sm">
        <div className="container-fluid d-flex justify-content-between align-items-center py-3 px-3">
          <h5 className="mb-0">
            <Package className="me-2" size={20} />
            Menu Management
          </h5>
         <div>
          <button
            className="btn btn-outline-secondary me-2"
            type="button"
            onClick={() => document.getElementById('csv-upload-input').click()}
          > <input
            id="csv-upload-input"
            type="file"
            accept=".xlsx, .csv, .xls, .xlsm , .xlsb"
            style={{ display: 'none' }}
          />
            Import CSV
          </button>

          <button
            className="btn btn-primary"
            onClick={handleShowAddForm}
          >
            <Plus className="me-2" size={16} />
            Add Item
          </button>
          </div>

        </div>
      </div>

      <div className="container-fluid py-4">
        {/* Summary Cards */}
        <div className="row mb-4 mx-5">
          <div className="col-md-4 mb-3">
            <div className="card bg-white shadow-sm">
              <div className="card-body text-center">
                <h6 className="card-title text-muted mb-2">Total Items</h6>
                <h3 className="mb-0 text-primary">{totalItems}</h3>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className="card bg-white shadow-sm">
              <div className="card-body text-center">
                <h6 className="card-title text-muted mb-2">Active</h6>
                <h3 className="mb-0 text-success">{activeItems}</h3>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className="card bg-white shadow-sm">
              <div className="card-body text-center">
                <h6 className="card-title text-muted mb-2">Inactive</h6>
                <h3 className="mb-0 text-danger">{inactiveItems}</h3>
              </div>
            </div>
          </div>
        </div>

        {/* Menu Items Table */}
        <div className="card bg-white shadow-sm mx-3">
          <div className="card-header bg-white border-bottom">
            <h5 className="mb-0">Menu Items</h5>
          </div>
          <div className="card-body p-0">
            {items.length === 0 ? (
              <div className="text-center py-5">
                <Package size={64} className="text-muted mb-3" />
                <h5 className="text-muted">No items added yet</h5>
                <p className="text-muted">Click "Add Item" to start adding products to your menu</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className="border-0 ps-4">Item ID</th>
                      <th className="border-0 ps-4">Name</th>
                      <th className="border-0">Price</th>
                      <th className="border-0">Discount Price</th>
                      <th className="border-0">Status</th>
                      <th className="border-0 pe-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <span className="fw-bold">{item.id}</span>
                        </td>
                        <td className="ps-4">
                          <div className="d-flex align-items-center">
                            {item.imagePreview && (
                              <img
                                src={item.imagePreview}
                                alt={item.name}
                                className="rounded me-3"
                                style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                              />
                            )}
                            <div>
                              <h6 className="mb-0">{item.name}</h6>
                              <small className="text-muted">{item.brand}</small>
                            </div>
                          </div>
                        </td>
                        {/*<td>
                          <span className="fw-bold">₹{item.price.toFixed(0)}</span>
                        </td>
                        <td>
                          <span className="fw-bold text-success">₹{item.discountPrice.toFixed(0)}</span>
                        </td>*/}
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="form-check form-switch">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                checked={item.status === 'active'}
                                onChange={() => handleToggleStatus(item.id)}
                                style={{ transform: 'scale(1.2)' }}
                              />
                            </div>
                            <span className={`ms-2 small ${item.status === 'active' ? 'text-success' : 'text-muted'}`}>
                              {item.status}
                            </span>
                          </div>
                        </td>
                        <td className="pe-4">
                          <div className="d-flex gap-2">
                            <button
                              className="btn btn-outline-secondary btn-sm"
                              onClick={() => handleEditItem(item.id)}
                              style={{ minWidth: '70px' }}
                            >
                              <Edit size={14} className="me-1" />
                              Edit
                            </button>
                            <button
                              className="btn btn-outline-danger btn-sm"
                              onClick={() => handleDeleteItem(item.id)}
                              style={{ minWidth: '80px' }}
                            >
                              <Trash2 size={14} className="me-1" />
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {showAddForm && (
        <AddItemForm
          onClose={handleCloseAddForm}
          onAddItem={handleAddItem}
        />
      )}

      {showEditForm && editingItem && (
        <EditItemForm
          item={editingItem}
          onClose={handleCloseEditForm}
          onUpdateItem={handleUpdateItem}
        />
      )}
    </div>
  );
};
  
  export default Menu;