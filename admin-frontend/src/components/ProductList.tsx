import { useState } from 'react';
import type { Product } from '../types/Product';
import ProductCard from './ProductCard';
import './ProductList.css';

interface ProductListProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
  isLoading?: boolean;
  currentPage: number;
  onPageChange: (page: number) => void;
  hasMore: boolean;
}

const ProductList = ({ products, onEdit, onDelete, isLoading, currentPage, onPageChange, hasMore }: ProductListProps) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  if (isLoading) {
    return (
      <div className="product-list-wrapper">
        <div className="empty-state">
          <div className="loading-spinner">⏳</div>
          <h2>Loading products...</h2>
        </div>
      </div>
    );
  }

  // Show empty state only if on first page with no products
  if (products.length === 0 && currentPage === 0) {
    return (
      <div className="product-list-wrapper">
        <div className="empty-state">
          <div className="empty-icon">🥒</div>
          <h2>No products yet</h2>
          <p>Create your first aachar product to get started!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="product-list-wrapper">
      <div className="product-list">
        {products.length > 0 && (
          <>
            <div className="list-header">
              <div className="header-left">
                <h2>Product Catalog</h2>
                <div className="list-stats">
                  <span className="stat">
                    Showing: {products.length} items
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
          </>
        )}

        {products.length === 0 && currentPage > 0 && (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <h2>No products on this page</h2>
            <p>Go back to see previous products</p>
          </div>
        )}
      </div>

      {/* Always show pagination if not on first page OR if there are more pages */}
      {(currentPage > 0 || hasMore) && (
        <div className="pagination-controls">
          <button
            className="btn btn-secondary"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 0}
          >
            ← Previous
          </button>
          <span className="page-info">
            Page {currentPage + 1}
          </span>
          <button
            className="btn btn-secondary"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={!hasMore}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductList;
