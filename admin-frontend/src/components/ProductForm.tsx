import { useState, useEffect } from 'react';
import type { Product, ProductFormData, ProductFormErrors } from '../types/Product';
import './ProductForm.css';

interface ProductFormProps {
  product?: Product | null;
  onSubmit: (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel?: () => void;
}

const ProductForm = ({ product, onSubmit, onCancel }: ProductFormProps) => {
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    price: 0,
    category: '',
    ingredients: '',
    spiceLevel: 'Mild',
    weight: '',
    imageUrl: '',
    inStock: true,
    featured: false,
  });

  const [errors, setErrors] = useState<ProductFormErrors>({});

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        ingredients: product.ingredients.join(', '),
        spiceLevel: product.spiceLevel,
        weight: product.weight,
        imageUrl: product.imageUrl,
        inStock: product.inStock,
        featured: product.featured,
      });
    }
  }, [product]);

  const validateForm = (): boolean => {
    const newErrors: ProductFormErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (formData.price <= 0) newErrors.price = 'Price must be greater than 0';
    if (!formData.category.trim()) newErrors.category = 'Category is required';
    if (!formData.ingredients.trim()) newErrors.ingredients = 'Ingredients are required';
    if (!formData.weight.trim()) newErrors.weight = 'Weight is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const productData = {
      ...formData,
      ingredients: formData.ingredients.split(',').map(i => i.trim()).filter(i => i),
    };

    onSubmit(productData);
    
    // Reset form if creating new product
    if (!product) {
      setFormData({
        name: '',
        description: '',
        price: 0,
        category: '',
        ingredients: '',
        spiceLevel: 'Mild',
        weight: '',
        imageUrl: '',
        inStock: true,
        featured: false,
      });
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' 
        ? (e.target as HTMLInputElement).checked
        : type === 'number' 
        ? Number(value) || 0
        : value
    }));

    // Clear error when user starts typing
    if (errors[name as keyof ProductFormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <div className="product-form-container">
      <div className="form-header">
        <h2>{product ? 'Edit Product' : 'Create New Product'}</h2>
        <p>Fill in the details for your aachar product</p>
      </div>

      <form onSubmit={handleSubmit} className="product-form">
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="name">Product Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={errors.name ? 'error' : ''}
              placeholder="e.g., Mango Pickle"
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="category">Category *</label>
            <input
              type="text"
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className={errors.category ? 'error' : ''}
              placeholder="e.g., Fruit Pickle, Vegetable Pickle"
            />
            {errors.category && <span className="error-message">{errors.category}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="price">Price (₹) *</label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              className={errors.price ? 'error' : ''}
              min="0"
              step="0.01"
              placeholder="0.00"
            />
            {errors.price && <span className="error-message">{errors.price}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="weight">Weight *</label>
            <input
              type="text"
              id="weight"
              name="weight"
              value={formData.weight}
              onChange={handleInputChange}
              className={errors.weight ? 'error' : ''}
              placeholder="e.g., 500g, 1kg"
            />
            {errors.weight && <span className="error-message">{errors.weight}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="spiceLevel">Spice Level</label>
            <select
              id="spiceLevel"
              name="spiceLevel"
              value={formData.spiceLevel}
              onChange={handleInputChange}
            >
              <option value="Mild">Mild</option>
              <option value="Medium">Medium</option>
              <option value="Hot">Hot</option>
              <option value="Extra Hot">Extra Hot</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="imageUrl">Image URL</label>
            <input
              type="url"
              id="imageUrl"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleInputChange}
              placeholder="https://example.com/image.jpg"
            />
          </div>
        </div>

        <div className="form-group full-width">
          <label htmlFor="description">Description *</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className={errors.description ? 'error' : ''}
            rows={4}
            placeholder="Describe your aachar product..."
          />
          {errors.description && <span className="error-message">{errors.description}</span>}
        </div>

        <div className="form-group full-width">
          <label htmlFor="ingredients">Ingredients * (comma-separated)</label>
          <textarea
            id="ingredients"
            name="ingredients"
            value={formData.ingredients}
            onChange={handleInputChange}
            className={errors.ingredients ? 'error' : ''}
            rows={3}
            placeholder="e.g., Mango, Salt, Red Chili, Turmeric, Mustard Oil"
          />
          {errors.ingredients && <span className="error-message">{errors.ingredients}</span>}
        </div>

        <div className="form-checkboxes">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="inStock"
              checked={formData.inStock}
              onChange={handleInputChange}
            />
            <span className="checkmark"></span>
            In Stock
          </label>

          <label className="checkbox-label">
            <input
              type="checkbox"
              name="featured"
              checked={formData.featured}
              onChange={handleInputChange}
            />
            <span className="checkmark"></span>
            Featured Product
          </label>
        </div>

        <div className="form-actions">
          {onCancel && (
            <button type="button" className="btn btn-secondary" onClick={onCancel}>
              Cancel
            </button>
          )}
          <button type="submit" className="btn btn-primary">
            {product ? 'Update Product' : 'Create Product'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;