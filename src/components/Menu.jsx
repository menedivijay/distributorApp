import {  useEffect, useState } from 'react';
import { Plus, Package, Edit, Trash2 } from 'lucide-react';
import AddItemForm from './AddItemForm';
import EditItemForm from './EditItemForm';

const Menu = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [items, setItems] = useState([]);

  // NEW STATES
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchItems = async () => {
      try {
        setLoading(true);
        setError(null);

        const url = new URL("https://cracker-backend-0iz6.onrender.com/products");
        if (searchTerm && searchTerm.trim().length > 0) {
          url.searchParams.append("keyword", searchTerm.trim());
        }
        url.searchParams.append("page", String(page));

        const response = await fetch(url.toString(), { signal: controller.signal });
        if (!response.ok) throw new Error("Failed to fetch products");

        const data = await response.json();

        const mappedItems = (Array.isArray(data) ? data : []).map((item) => ({
          id: item._id,
          name: item.productName,
          brand: item.brandName,
          category: item.category,
          price: item.orignalPrice,
          discountPrice: item.discountPrice,
          image: item.images[0].Location,
          status: "active",
        }));
        setItems(mappedItems);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message || "Unknown error");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
    return () => controller.abort();
  }, [searchTerm, page]);



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

  /*const handleToggleStatus = (id) => {
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === id
          ? { ...item, status: item.status === 'active' ? 'inactive' : 'active' }
          : item
      )
    );
  };*/
 
  console.log(items);

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


  return (
    <div>
      <div className="sticky-top bg-white border-bottom shadow-sm">
        <div className="container-fluid d-flex justify-content-between align-items-center py-3 px-3">
          <h5 className="mb-0">
            <Package className="me-2" size={20} />
            Products
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
        <div className="row mb-3 mx-3">
          <div className="col-md-6">
            <input
              type="text"
              className="form-control"
              placeholder="Search product Name..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value,);

                setPage(1); // reset to page 1
              }}
            />
          </div>
        </div>
        

        {/* Menu Items Table */}
        <div className="card bg-white shadow-sm mx-3">
          <div className="card-header bg-secondary border-bottom">
            <h5 className="mb-0 text-white">MY PRODUCTS</h5>
          </div>
          <div className="card-body p-0">
            {loading && <div className="text-center py-4">Loading...</div>}
            {error && <div className="text-center py-4 text-danger">{error}</div>}

            {!loading && !error && items.length === 0 && (
              <div className="text-center py-5">
                <Package size={64} className="text-muted mb-3" />
                <h5 className="text-muted">No items found</h5>
                <p className="text-muted">Try adjusting your search or add a new item</p>
              </div>
            )}

            {!loading && !error && items.length > 0 && (
              <div className='table-responsive' style={{maxHeight: '410px', overflowY: 'auto', overflowX: 'auto'}}>
                <table className="table table-hover mb-0">
                  <thead className="table-light position-sticky top-0" >
                    <tr>
                      <th className="border-0 ps-4">Product Name</th>
                      <th className="border-0 ps-4">Brand</th>
                      <th className="border-0 ps-4">Category</th>
                      <th className="border-0">MRP Price</th>
                      <th className="border-0">Discount Price</th>
                      <th className="border-0 pe-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr key={item.id}>
                        <td className="ps-4">
                          <span className="fw-bold">{item.name}</span>  
                        </td>
                        <td className="ps-4">
                          <span className="fw-small">{item.brand}</span>
                        </td>
                        <td className="ps-4">
                          <span className="fw-small">{item.category}</span>
                        </td>
                        <td>
                          <span className="fw-bold">₹{item.price}</span>
                        </td>
                        <td>
                          <span className="fw-bold text-success">₹{item.discountPrice}</span>
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
        
        {/* Pagination */}
        {!loading && !error && items.length > 0 && (
          <div className="d-flex justify-content-center align-items-center gap-2 py-3">
            <button
              className="btn btn-outline-secondary btn-sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Prev
            </button>
            <span className="small">Page {page}</span>
            <button
              className="btn btn-outline-secondary btn-sm"
              disabled={items.length < 15} // backend page size 15
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </button>
          </div>
        )}
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