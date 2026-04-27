import { useState, useEffect } from 'react';
import type { Product, User } from '../types/Product';
import ProductList from './ProductList';
import ProductForm from './ProductForm';
import Header from './Header';
import { getAllProducts, deleteProduct } from '../services/productService';
import './AdminPanel.css';

interface AdminPanelProps {
  user: User;
  onLogout: () => void;
}

const AdminPanel = ({ user, onLogout }: AdminPanelProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState<'list' | 'create'>('list');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);
  const [hasMore, setHasMore] = useState(true);

  // Fetch products on component mount or when page changes
  useEffect(() => {
    fetchProducts();
  }, [currentPage]);

  const fetchProducts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getAllProducts({ pageNo: currentPage, pageSize });
      if (response.success && response.data) {
        setProducts(response.data);
        // If we get fewer products than pageSize, we've reached the end
        setHasMore(response.data.length === pageSize);
      } else {
        setError(response.error || 'Failed to fetch products');
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProductCreated = (newProduct: Product) => {
    // Reset to first page and refetch to see the new product
    setCurrentPage(0);
    fetchProducts();
    setActiveTab('list');
  };

  const handleProductUpdated = (updatedProduct: Product) => {
    // Refetch products to get the latest data from the server
    fetchProducts();
    setEditingProduct(null);
    setActiveTab('list');
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setActiveTab('create');
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    const response = await deleteProduct(productId);
    if (response.success) {
      setProducts(products.filter(p => p.id !== productId));
    } else {
      alert('Failed to delete product: ' + response.error);
    }
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
    setActiveTab('list');
  };

  return (
    <div className="admin-panel">
      <Header user={user} onLogout={onLogout} />
      
      <nav className="admin-nav">
        <button 
          className={`nav-button ${activeTab === 'list' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('list');
            setEditingProduct(null);
          }}
        >
          Product List {isLoading ? '...' : `(${products.length})`}
        </button>
        <button 
          className={`nav-button ${activeTab === 'create' ? 'active' : ''}`}
          onClick={() => setActiveTab('create')}
        >
          {editingProduct ? 'Edit Product' : 'Create Product'}
        </button>
      </nav>

      <main className="admin-content">
        {error && (
          <div className="error-banner">
            ⚠️ {error}
            <button onClick={fetchProducts} className="retry-btn">Retry</button>
          </div>
        )}
        
        {activeTab === 'list' ? (
          <ProductList 
            products={products}
            onEdit={handleEditProduct}
            onDelete={handleDeleteProduct}
            isLoading={isLoading}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            hasMore={hasMore}
          />
        ) : (
          <ProductForm 
            product={editingProduct}
            onCancel={editingProduct ? handleCancelEdit : undefined}
            onSuccess={editingProduct ? handleProductUpdated : handleProductCreated}
          />
        )}
      </main>
    </div>
  );
};

export default AdminPanel;