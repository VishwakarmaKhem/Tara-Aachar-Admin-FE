import { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import type { Product } from '../types/Product';
import type { User } from '../types/Auth';
import ProductList from './ProductList';
import ProductForm from './ProductForm';
import Header from './Header';
import ConfirmModal from './ConfirmModal';
import LoadingSpinner from './LoadingSpinner';
import { deleteProduct, getProductById } from '../services/productService';
import { useProducts } from '../hooks/useProducts';
import './AdminPanel.css';

interface AdminPanelProps {
  user: User;
  onLogout: () => void;
}

const AdminPanel = ({ user, onLogout }: AdminPanelProps) => {
  const navigate = useNavigate();
  const { productId } = useParams();
  const [searchParams] = useSearchParams();

  const view = productId ? 'edit' : (searchParams.get('view') || 'list');

  const { products, isLoading, error, hasMore, currentPage, setCurrentPage, refetch } = useProducts();

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editLoading, setEditLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean; productId: string | null; productTitle: string;
  }>({ isOpen: false, productId: null, productTitle: '' });

  // Fetch products on component mount or when page changes
  useEffect(() => {
    if (view === 'list') {
      refetch();
    }
  }, [view]);

  // Fetch product for editing when productId changes
  useEffect(() => {
    if (productId) {
      fetchProductForEdit(productId);
    } else {
      setEditingProduct(null);
    }
  }, [productId]);

  const fetchProductForEdit = async (id: string) => {
    setEditLoading(true);
    const response = await getProductById(id);
    if (response.success && response.data) {
      setEditingProduct(response.data);
    } else {
      navigate('/admin?view=list');
    }
    setEditLoading(false);
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

  const handleProductCreated = (_newProduct: Product) => {
    setCurrentPage(0);
    refetch();
    navigate('/admin');
  };

  const handleProductUpdated = (_updatedProduct: Product) => {
    refetch();
    navigate('/admin');
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
      refetch();
    }
    setDeleteConfirm({ isOpen: false, productId: null, productTitle: '' });
  };

  const cancelDelete = () => {
    setDeleteConfirm({ isOpen: false, productId: null, productTitle: '' });
  };

  const handleCancelEdit = () => navigate('/admin');

  const activeTab = view === 'create' || view === 'edit' ? 'create' : 'list';

  return (
    <div className="admin-panel">
      <Header user={user} onLogout={onLogout} />

      <nav className="admin-nav">
        <button
          className={`nav-button ${activeTab === 'list' ? 'active' : ''}`}
          onClick={() => navigate('/admin')}
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
            <button onClick={refetch} className="retry-btn">Retry</button>
          </div>
        )}

        {editLoading ? (
          <LoadingSpinner message="Loading product details..." />
        ) : activeTab === 'list' ? (
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