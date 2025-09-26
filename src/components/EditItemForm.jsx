import React, { useState, useEffect } from 'react';
import { Upload} from 'lucide-react';

const EditItemForm = ({ item, onClose, onUpdateItem }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    brand: '',
    price: '',
    discountPrice: '',
    status: 'active',
    image: null,
    imagePreview: null
  });

  const [errors, setErrors] = useState({});

  const categories = [
    "Sparkels",
    "Flower Pots",
    "Multi Shots",
    "Rockets",
    "Bombs",
  ];

  // Initialize form data when item prop changes
  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name || '',
        category: item.category || '',
        brand: item.brand || '',
        price: item.price ? item.price.toString() : '',
        discountPrice: item.discountPrice ? item.discountPrice.toString() : '',
        status: item.status || 'active',
        image: item.image || null,
        imagePreview: item.imagePreview || null
      });
    }
  }, [item]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({
          ...prev,
          image: 'Please select a valid image file'
        }));
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          image: 'Image size should be less than 5MB'
        }));
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({
          ...prev,
          image: file,
          imagePreview: e.target.result
        }));
      };
      reader.readAsDataURL(file);

      // Clear image error
      if (errors.image) {
        setErrors(prev => ({
          ...prev,
          image: ''
        }));
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.brand.trim()) {
      newErrors.brand = 'Brand is required';
    }

    if (!formData.price || isNaN(formData.price) || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Valid price is required';
    }

    if (formData.discountPrice && (isNaN(formData.discountPrice) || parseFloat(formData.discountPrice) < 0)) {
      newErrors.discountPrice = 'Discount price must be a valid number';
    }

    if (formData.discountPrice && parseFloat(formData.discountPrice) >= parseFloat(formData.price)) {
      newErrors.discountPrice = 'Discount price must be less than original price';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      const itemData = {
        ...item,
        ...formData,
        price: parseFloat(formData.price),
        discountPrice: formData.discountPrice ? parseFloat(formData.discountPrice) : null
      };
      
      onUpdateItem(itemData);
      onClose();
    }
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Edit Menu Item</h5>
            <button
              type="button"
              className="btn-close"
              onClick={handleClose}
            >
            </button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="row">
                {/* Image Upload */}
                <div className="col-12 mb-4">
                  <label className="form-label">Product Image</label>
                  <div className="d-flex align-items-center gap-3">
                    {formData.imagePreview ? (
                      <div className="position-relative">
                        <img
                          src={formData.imagePreview}
                          alt="Preview"
                          className="img-thumbnail"
                          style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                        />
                      </div>
                    ) : (
                      <div className="border rounded d-flex align-items-center justify-content-center" style={{ width: '100px', height: '100px' }}>
                        <Upload size={24} className="text-muted" />
                      </div>
                    )}
                    <div className="flex-grow-1">
                      <input
                        type="file"
                        className="form-control"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                      <small className="text-muted">Upload a product image (max 5MB)</small>
                      {errors.image && <div className="text-danger small">{errors.image}</div>}
                    </div>
                  </div>
                </div>

                {/* Product Name */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">Product Name *</label>
                  <input
                    type="text"
                    className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter product name"
                  />
                  {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                </div>

                {/* Category */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">Category *</label>
                  <select
                    className={`form-select ${errors.category ? 'is-invalid' : ''}`}
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  {errors.category && <div className="invalid-feedback">{errors.category}</div>}
                </div>

                {/* Brand */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">Brand *</label>
                  <input
                    type="text"
                    className={`form-control ${errors.brand ? 'is-invalid' : ''}`}
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    placeholder="Enter brand name"
                  />
                  {errors.brand && <div className="invalid-feedback">{errors.brand}</div>}
                </div>

                {/* Price */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">Price (₹) *</label>
                  <input
                    type="number"
                    className={`form-control ${errors.price ? 'is-invalid' : ''}`}
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                  />
                  {errors.price && <div className="invalid-feedback">{errors.price}</div>}
                </div>

                {/* Discount Price */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">Discount Price (₹)</label>
                  <input
                    type="number"
                    className={`form-control ${errors.discountPrice ? 'is-invalid' : ''}`}
                    name="discountPrice"
                    value={formData.discountPrice}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                  />
                  {errors.discountPrice && <div className="invalid-feedback">{errors.discountPrice}</div>}
                  <small className="text-muted">Leave empty if no discount</small>
                </div>

                {/* Status */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">Status</label>
                  <select
                    className="form-select"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
              >
                Update Item
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditItemForm;
