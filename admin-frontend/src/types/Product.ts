export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  ingredients: string[];
  spiceLevel: 'Mild' | 'Medium' | 'Hot' | 'Extra Hot';
  weight: string;
  imageUrl: string;
  inStock: boolean;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductFormData {
  name: string;
  description: string;
  price: number;
  category: string;
  ingredients: string;
  spiceLevel: 'Mild' | 'Medium' | 'Hot' | 'Extra Hot';
  weight: string;
  imageUrl: string;
  inStock: boolean;
  featured: boolean;
}

export interface ProductFormErrors {
  name?: string;
  description?: string;
  price?: string;
  category?: string;
  ingredients?: string;
  spiceLevel?: string;
  weight?: string;
  imageUrl?: string;
  inStock?: string;
  featured?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  createdAt: Date;
}