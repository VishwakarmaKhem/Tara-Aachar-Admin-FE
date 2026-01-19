import { useState } from 'react';
import type { Product, User } from '../types/Product';
import ProductList from './ProductList';
import ProductForm from './ProductForm';
import Header from './Header';
import { sampleProducts } from '../data/sampleProducts';
import './AdminPanel.css';

interface AdminPanelProps {
  user: User;
  onLogout: () => void;
}

const AdminPanel = ({ user, onLogout }: AdminPanelProps) => {
  const [products, setProducts] = useState<Product[]>(sampleProducts);
  const [activeTab, setActiveTab] = useState<'list' | 'create'>('list');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const handleCreateProduct = (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newProduct: Product = {
      ...productData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setProducts([...products, newProduct]);
    setActiveTab('list');
  };

  const handleUpdateProduct = (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!editingProduct) return;
    
    const updatedProduct: Product = {
      ...productData,
      id: editingProduct.id,
      createdAt: editingProduct.createdAt,
      updatedAt: new Date(),
    };
    
    setProducts(products.map(p => p.id === editingProduct.id ? updatedProduct : p));
    setEditingProduct(null);
    setActiveTab('list');
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setActiveTab('create');
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts(products.filter(p => p.id !== productId));
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
          Product List ({products.length})
        </button>
        <button 
          className={`nav-button ${activeTab === 'create' ? 'active' : ''}`}
          onClick={() => setActiveTab('create')}
        >
          {editingProduct ? 'Edit Product' : 'Create Product'}
        </button>
      </nav>

      <main className="admin-content">
        {activeTab === 'list' ? (
          <ProductList 
            products={products}
            onEdit={handleEditProduct}
            onDelete={handleDeleteProduct}
          />
        ) : (
          <ProductForm 
            product={editingProduct}
            onSubmit={editingProduct ? handleUpdateProduct : handleCreateProduct}
            onCancel={editingProduct ? handleCancelEdit : undefined}
          />
        )}
      </main>
    </div>
  );
};

export default AdminPanel;