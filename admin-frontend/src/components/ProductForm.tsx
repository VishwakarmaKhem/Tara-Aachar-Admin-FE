import { useState, useEffect, useRef } from 'react';
import type { Product, ProductFormData, ProductFormErrors } from '../types/Product';
import { createProduct, updateProduct } from '../services/productService';
import { uploadImage } from '../services/imageService';
import './ProductForm.css';

const TITLE_WORD_LIMIT = 5;
const DESC_WORD_LIMIT = 25;

const countWords = (text: string): number =>
  text.trim() === '' ? 0 : text.trim().split(/\s+/).length;

interface ProductFormProps {
  product?: Product | null;
  onCancel?: () => void;
  onSuccess?: (product: Product) => void;
}

const ProductForm = ({ product, onCancel, onSuccess }: ProductFormProps) => {
  const [formData, setFormData] = useState<ProductFormData>({
    title: '',
    description: '',
    price: 0,
    category: '',
    variant: 'TANGY',
    ingredients: '',
    imageUrl: '',
    manufacturerName: '',
    manufacturerLicense: '',
    allowsCustomIngredients: false,
  });

  const [errors, setErrors] = useState<ProductFormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (product) {
      setFormData({
        title: product.title || '',
        description: product.description || '',
        price: product.price || 0,
        category: product.category || '',
        variant: product.variant || 'TANGY',
        ingredients: product.ingredients?.join(', ') || '',
        imageUrl: product.imageUrl || '',
        manufacturerName: product.manufacturerName || '',
        manufacturerLicense: product.manufacturerLicense || '',
        allowsCustomIngredients: product.allowsCustomIngredients || false,
      });
    }
  }, [product]);

  const validateForm = (): boolean => {
    const newErrors: ProductFormErrors = {};

    if (!formData.title?.trim()) newErrors.title = 'Product title is required';
    else if (countWords(formData.title) > TITLE_WORD_LIMIT) newErrors.title = `Title must be ${TITLE_WORD_LIMIT} words or less`;
    if (!formData.description?.trim()) newErrors.description = 'Description is required';
    else if (countWords(formData.description) > DESC_WORD_LIMIT) newErrors.description = `Description must be ${DESC_WORD_LIMIT} words or less`;
    if (formData.price <= 0) newErrors.price = 'Price must be greater than 0';
    if (!formData.category?.trim()) newErrors.category = 'Category is required';
    if (!formData.variant?.trim()) newErrors.variant = 'Variant is required';
    if (!formData.ingredients?.trim()) newErrors.ingredients = 'Ingredients are required';
    if (!formData.manufacturerName?.trim()) newErrors.manufacturerName = 'Manufacturer name is required';
    if (!formData.manufacturerLicense?.trim()) newErrors.manufacturerLicense = 'Manufacturer license is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    const productData = {
      ...formData,
      ingredients: formData.ingredients.split(',').map(i => i.trim()).filter(Boolean),
    };

    try {
      const response = product?.id
        ? await updateProduct(product.id, productData)
        : await createProduct(productData);

      if (response.success && response.data) {
        setSuccessMessage(response.message);
        
        // Call onSuccess callback
        if (onSuccess) {
          onSuccess(response.data);
        }
        
        // Auto-clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setErrorMessage(response.error || 'Failed to save product');
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'An unexpected error occurred';
      setErrorMessage(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    // Enforce word limits for title and description
    if (name === 'title' && countWords(value) > TITLE_WORD_LIMIT) return;
    if (name === 'description' && countWords(value) > DESC_WORD_LIMIT) return;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox'
        ? (e.target as HTMLInputElement).checked
        : type === 'number'
        ? Number(value) || 0
        : value
    }));

    if (errors[name as keyof ProductFormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please select a valid image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage('Image size must be less than 5MB');
      return;
    }

    setIsUploading(true);
    setUploadProgress('Uploading image...');
    setErrorMessage('');

    try {
      const response = await uploadImage(file, 'Product');
      
      if (response.success && response.data) {
        setFormData(prev => ({ ...prev, imageUrl: response.data! }));
        setUploadProgress('Image uploaded successfully!');
        setTimeout(() => setUploadProgress(''), 3000);
      } else {
        setErrorMessage(response.error || 'Failed to upload image');
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to upload image';
      setErrorMessage(errorMsg);
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="product-form-container">
      <div className="form-header">
        <h2>{product ? 'Edit Product' : 'Create New Product'}</h2>
        <p>Fill in the details for your aachar product</p>
      </div>

      {successMessage && (
        <div className="alert alert-success">
          ✓ {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="alert alert-error">
          ✕ {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="product-form">
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="title">Product Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className={errors.title ? 'error' : ''}
              placeholder="e.g., Amla Pickle"
            />
            <div className="word-count">
              <span className={countWords(formData.title) >= TITLE_WORD_LIMIT ? 'word-count-limit' : ''}>
                {countWords(formData.title)}/{TITLE_WORD_LIMIT} words
              </span>
            </div>
            {errors.title && <span className="error-message">{errors.title}</span>}
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
              placeholder="e.g., Pickles, Condiments"
            />
            {errors.category && <span className="error-message">{errors.category}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="variant">Variant *</label>
            <select
              id="variant"
              name="variant"
              value={formData.variant}
              onChange={handleInputChange}
              className={errors.variant ? 'error' : ''}
            >
              <option value="TANGY">Tangy</option>
              <option value="MILD">Mild</option>
              <option value="SPICY">Spicy</option>
              <option value="SWEET">Sweet</option>
              <option value="MIXED">Mixed</option>
            </select>
            {errors.variant && <span className="error-message">{errors.variant}</span>}
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
              placeholder="e.g., 299"
            />
            {errors.price && <span className="error-message">{errors.price}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="imageUrl">Image URL</label>
            <div className="image-upload-wrapper">
              <input
                type="url"
                id="imageUrl"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleInputChange}
                placeholder="https://example.com/image.jpg"
                disabled={isUploading}
              />
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
              />
              <button
                type="button"
                className="btn btn-upload"
                onClick={handleUploadClick}
                disabled={isUploading || isLoading}
              >
                {isUploading ? (
                  <>
                    <div className="spinner-small"></div>
                    Uploading...
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z"/>
                    </svg>
                    Upload
                  </>
                )}
              </button>
            </div>
            {uploadProgress && <span className="success-message">{uploadProgress}</span>}
            {formData.imageUrl && (
              <div className="image-preview">
                <img src={formData.imageUrl} alt="Preview" />
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="manufacturerName">Manufacturer Name *</label>
            <input
              type="text"
              id="manufacturerName"
              name="manufacturerName"
              value={formData.manufacturerName}
              onChange={handleInputChange}
              className={errors.manufacturerName ? 'error' : ''}
              placeholder="e.g., Tara Aachar Makers"
            />
            {errors.manufacturerName && <span className="error-message">{errors.manufacturerName}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="manufacturerLicense">Manufacturer License *</label>
            <input
              type="text"
              id="manufacturerLicense"
              name="manufacturerLicense"
              value={formData.manufacturerLicense}
              onChange={handleInputChange}
              className={errors.manufacturerLicense ? 'error' : ''}
              placeholder="e.g., LIC-2024-007"
            />
            {errors.manufacturerLicense && <span className="error-message">{errors.manufacturerLicense}</span>}
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
            placeholder="Describe your achar product..."
          />
          <div className="word-count">
            <span className={countWords(formData.description) >= DESC_WORD_LIMIT ? 'word-count-limit' : ''}>
              {countWords(formData.description)}/{DESC_WORD_LIMIT} words
            </span>
          </div>
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
              name="allowsCustomIngredients"
              checked={formData.allowsCustomIngredients}
              onChange={handleInputChange}
            />
            <span className="checkmark"></span>
            Allows Custom Ingredients
          </label>
        </div>

        <div className="form-actions">
          {onCancel && (
            <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={isLoading}>
              Cancel
            </button>
          )}
          <button type="submit" className="btn btn-primary" disabled={isLoading}>
            {isLoading 
              ? (product ? 'Updating...' : 'Creating...') 
              : (product ? 'Update Product' : 'Create Product')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;