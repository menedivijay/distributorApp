import React, { useState } from 'react';
import { Upload, Plus } from 'lucide-react';

const AddItemForm = ({ onClose, onAddItem }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    brand: '',
    price: '',
    discountPrice: '',
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

    if (!formData.image) {
      newErrors.image = 'Image is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      const itemData = {
        ...formData,
        id: Date.now(), // Simple ID generation
        price: parseFloat(formData.price),
        discountPrice: formData.discountPrice ? parseFloat(formData.discountPrice) : null
      };
      
      onAddItem(itemData);
      onClose();
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      category: '',
      brand: '',
      price: '',
      discountPrice: '',
      image: null,
      imagePreview: null
    });
    setErrors({});
    onClose();
  };

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title">
              <Plus className="me-2" size={20} />
              Add New Item
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={handleClose}
            >
              
            </button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="row">
                {/* Item Name */}
                <div className="col-md-6 mb-3">
                  <label htmlFor="name" className="form-label">
                    Item Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter item name"
                  />
                  {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                </div>

                {/* Category */}
                <div className="col-md-6 mb-3">
                  <label htmlFor="category" className="form-label">
                    Category <span className="text-danger">*</span>
                  </label>
                  <select
                    className={`form-select ${errors.category ? 'is-invalid' : ''}`}
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                  >
                    <option value="">Select category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  {errors.category && <div className="invalid-feedback">{errors.category}</div>}
                </div>

                {/* Brand */}
                <div className="col-md-6 mb-3">
                  <label htmlFor="brand" className="form-label">
                    Brand <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className={`form-control ${errors.brand ? 'is-invalid' : ''}`}
                    id="brand"
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    placeholder="Enter brand name"
                  />
                  {errors.brand && <div className="invalid-feedback">{errors.brand}</div>}
                </div>

                {/* Price */}
                <div className="col-md-6 mb-3">
                  <label htmlFor="price" className="form-label">
                    Price <span className="text-danger">*</span>
                  </label>
                  <div className="input-group">
                    <span className="input-group-text">$</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      className={`form-control ${errors.price ? 'is-invalid' : ''}`}
                      id="price"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="0.00"
                    />
                    {errors.price && <div className="invalid-feedback">{errors.price}</div>}
                  </div>
                </div>

                {/* Discount Price */}
                <div className="col-md-6 mb-3">
                  <label htmlFor="discountPrice" className="form-label">
                    Discount Price
                  </label>
                  <div className="input-group">
                    <span className="input-group-text">$</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      className={`form-control ${errors.discountPrice ? 'is-invalid' : ''}`}
                      id="discountPrice"
                      name="discountPrice"
                      value={formData.discountPrice}
                      onChange={handleInputChange}
                      placeholder="0.00"
                    />
                    {errors.discountPrice && <div className="invalid-feedback">{errors.discountPrice}</div>}
                  </div>
                </div>

                {/* Image Upload */}
                <div className="col-md-6 mb-3">
                  <label htmlFor="image" className="form-label">
                    <Upload className="me-2" size={20}/>
                    Image <span className="text-danger">*</span>
                  </label>
                  <input
                    type="file"
                    className={`form-control ${errors.image ? 'is-invalid' : ''}`}
                    id="image"
                    name="image"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  {errors.image && <div className="invalid-feedback">{errors.image}</div>}
                  <div className="form-text">
                    Supported formats: JPG, PNG, GIF. Max size: 5MB
                  </div>
                </div>

                {/* Image Preview */}
                {formData.imagePreview && (
                  <div className="col-12 mb-3">
                    <label className="form-label">Image Preview</label>
                    <div className="text-center">
                      <img
                        src={formData.imagePreview}
                        alt="Preview"
                        className="img-thumbnail"
                        style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'cover' }}
                      />
                    </div>
                  </div>
                )}
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
                on
              >
                <Plus className="me-2" size={16} />
                Add Item
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddItemForm;
