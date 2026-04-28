import { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import type { Product, User } from '../types/Product';
import ProductList from './ProductList';
import ProductForm from './ProductForm';
import Header from './Header';
import ConfirmModal from './ConfirmModal';
import { getAllProducts, deleteProduct, getProductById } from '../services/productService';
import './AdminPanel.css';

interface AdminPanelProps {
  user: User;
  onLogout: () => void;
}

const AdminPanel = ({ user, onLogout }: AdminPanelProps) => {
  const navigate = useNavigate();
  const { productId } = useParams();
  const [searchParams] = useSearchParams();
  
  // Determine view: if productId exists in URL, it's edit mode
  const view = productId ? 'edit' : (searchParams.get('view') || 'list');
  
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);
  const [hasMore, setHasMore] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; productId: string | null; productTitle: string }>({
    isOpen: false,
    productId: null,
    productTitle: '',
  });

  // Fetch products on component mount or when page changes
  useEffect(() => {
    if (view === 'list') {
      fetchProducts();
    }
  }, [currentPage, view]);

  // Fetch product for editing when productId changes
  useEffect(() => {
    if (productId) {
      fetchProductForEdit(productId);
    } else {
      setEditingProduct(null);
    }
  }, [productId]);

  const fetchProductForEdit = async (id: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await getProductById(id);
      
      if (response.success && response.data) {
        setEditingProduct(response.data);
      } else {
        setError(response.error || 'Failed to fetch product details');
        navigate('/admin?view=list');
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to fetch product details';
      setError(errorMsg);
      navigate('/admin?view=list');
    } finally {
      setIsLoading(false);
    }
  };

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
    // Reset to first page and navigate to list
    setCurrentPage(0);
    navigate('/admin?view=list');
  };

  const handleProductUpdated = (updatedProduct: Product) => {
    // Navigate back to list
    navigate('/admin?view=list');
  };

  const handleEditProduct = (product: Product) => {
    if (!product.id) return;
    navigate(`/admin/edit/${product.id}`);
  };

  const handleDeleteProduct = (productId: string) => {
    // Find the product to get its title
    const product = products.find(p => p.id === productId);
    setDeleteConfirm({
      isOpen: true,
      productId,
      productTitle: product?.title || 'this product',
    });
  };

  const confirmDelete = async () => {
    if (!deleteConfirm.productId) return;
    
    const response = await deleteProduct(deleteConfirm.productId);
    if (response.success) {
      setProducts(products.filter(p => p.id !== deleteConfirm.productId));
      setDeleteConfirm({ isOpen: false, productId: null, productTitle: '' });
    } else {
      alert('Failed to delete product: ' + response.error);
      setDeleteConfirm({ isOpen: false, productId: null, productTitle: '' });
    }
  };

  const cancelDelete = () => {
    setDeleteConfirm({ isOpen: false, productId: null, productTitle: '' });
  };

  const handleCancelEdit = () => {
    navigate('/admin?view=list');
  };

  const activeTab = view === 'create' || view === 'edit' ? 'create' : 'list';

  return (
    <div className="admin-panel">
      <Header user={user} onLogout={onLogout} />
      
      <nav className="admin-nav">
        <button 
          className={`nav-button ${activeTab === 'list' ? 'active' : ''}`}
          onClick={() => navigate('/admin?view=list')}
        >
          Product List {isLoading && view === 'list' ? '...' : `(${products.length})`}
        </button>
        <button 
          className={`nav-button ${activeTab === 'create' ? 'active' : ''}`}
          onClick={() => navigate('/admin?view=create')}
        >
          {view === 'edit' ? 'Edit Product' : 'Create Product'}
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
            isLoading={isLoading && view === 'list'}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            hasMore={hasMore}
          />
        ) : (
          <ProductForm 
            product={editingProduct}
            onCancel={view === 'edit' || editingProduct ? handleCancelEdit : undefined}
            onSuccess={view === 'edit' || editingProduct ? handleProductUpdated : handleProductCreated}
          />
        )}
      </main>

      <ConfirmModal
        isOpen={deleteConfirm.isOpen}
        title="Delete Product"
        message={`Are you sure you want to delete "${deleteConfirm.productTitle}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
};

export default AdminPanel;