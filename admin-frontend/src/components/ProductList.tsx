import { useState } from 'react';
import type { Product } from '../types/Product';
import ProductCard from './ProductCard';
import './ProductList.css';

interface ProductListProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
}

const ProductList = ({ products, onEdit, onDelete }: ProductListProps) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  if (products.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">🥒</div>
        <h2>No products yet</h2>
        <p>Create your first aachar product to get started!</p>
      </div>
    );
  }

  return (
    <div className="product-list">
      <div className="list-header">
        <div className="header-left">
          <h2>Product Catalog</h2>
          <div className="list-stats">
            <span className="stat">
              Total: {products.length}
            </span>
            <span className="stat">
              In Stock: {products.filter(p => p.inStock).length}
            </span>
            <span className="stat">
              Featured: {products.filter(p => p.featured).length}
            </span>
          </div>
        </div>
        
        <div className="view-controls">
          <button
            className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => setViewMode('grid')}
            title="Grid View"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z"/>
            </svg>
          </button>
          <button
            className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => setViewMode('list')}
            title="List View"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/>
            </svg>
          </button>
        </div>
      </div>
      
      <div className={`products-container ${viewMode}`}>
        {products.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            onEdit={onEdit}
            onDelete={onDelete}
            viewMode={viewMode}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductList;