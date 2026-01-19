import { useState } from 'react';
import type { Product } from '../types/Product';
import './ProductCard.css';

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
  viewMode: 'grid' | 'list';
}

const ProductCard = ({ product, onEdit, onDelete, viewMode }: ProductCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${product.name}"?`)) {
      onDelete(product.id);
    }
  };

  const getSpiceLevelColor = (level: string) => {
    switch (level) {
      case 'Mild': return '#28a745';
      case 'Medium': return '#ffc107';
      case 'Hot': return '#fd7e14';
      case 'Extra Hot': return '#dc3545';
      default: return '#6c757d';
    }
  };

  if (viewMode === 'list' && !isExpanded) {
    return (
      <div className="product-row">
        <div className="row-content">
          <div className="row-main">
            <div className="row-header">
              <h3 className="product-name">{product.name}</h3>
              <div className="product-badges">
                {product.featured && <span className="badge featured">Featured</span>}
                {!product.inStock && <span className="badge out-of-stock">Out of Stock</span>}
              </div>
            </div>
            <div className="row-details">
              <span className="detail-item">
                <strong>Category:</strong> {product.category}
              </span>
              <span className="detail-item">
                <strong>Price:</strong> ₹{product.price}
              </span>
              <span className="detail-item">
                <strong>Weight:</strong> {product.weight}
              </span>
              <span className="detail-item">
                <strong>Spice:</strong> 
                <span 
                  className="spice-level"
                  style={{ color: getSpiceLevelColor(product.spiceLevel) }}
                >
                  {product.spiceLevel}
                </span>
              </span>
            </div>
          </div>
          
          <div className="row-actions">
            <button 
              className="btn btn-expand"
              onClick={() => setIsExpanded(true)}
              title="Expand to see full details"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              Expand
            </button>
            <button 
              className="btn btn-primary"
              onClick={() => onEdit(product)}
            >
              Edit
            </button>
            <button 
              className="btn btn-danger"
              onClick={handleDelete}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`product-card ${viewMode === 'list' ? 'expanded' : ''}`}>
      {viewMode === 'list' && (
        <div className="collapse-header">
          <button 
            className="btn btn-collapse"
            onClick={() => setIsExpanded(false)}
            title="Collapse to row view"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 13H5v-2h14v2z"/>
            </svg>
            Collapse
          </button>
        </div>
      )}
      
      <div className="card-header">
        <div className="product-image">
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.name} />
          ) : (
            <div className="image-placeholder">🥒</div>
          )}
        </div>
        <div className="product-badges">
          {product.featured && <span className="badge featured">Featured</span>}
          {!product.inStock && <span className="badge out-of-stock">Out of Stock</span>}
        </div>
      </div>
      
      <div className="card-content">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-category">{product.category}</p>
        <p className="product-description">{product.description}</p>
        
        <div className="product-details">
          <div className="detail-row">
            <span className="detail-label">Price:</span>
            <span className="detail-value">₹{product.price}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Weight:</span>
            <span className="detail-value">{product.weight}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Spice Level:</span>
            <span 
              className="detail-value spice-level"
              style={{ color: getSpiceLevelColor(product.spiceLevel) }}
            >
              {product.spiceLevel}
            </span>
          </div>
        </div>
        
        <div className="ingredients">
          <span className="detail-label">Ingredients:</span>
          <div className="ingredients-list">
            {product.ingredients.map((ingredient, index) => (
              <span key={index} className="ingredient-tag">
                {ingredient}
              </span>
            ))}
          </div>
        </div>
      </div>
      
      <div className="card-actions">
        <button 
          className="btn btn-primary"
          onClick={() => onEdit(product)}
        >
          Edit
        </button>
        <button 
          className="btn btn-danger"
          onClick={handleDelete}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default ProductCard;