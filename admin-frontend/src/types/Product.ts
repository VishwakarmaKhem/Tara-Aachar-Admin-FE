export type ProductVariant = 'TANGY' | 'MILD' | 'SPICY' | 'SWEET' | 'MIXED';

export interface Product {
  id?: string;
  title: string;
  description: string;
  price: number;
  category: string;
  variant: ProductVariant;
  ingredients: string[];
  imageUrl: string;
  manufacturerName: string;
  manufacturerLicense: string;
  allowsCustomIngredients: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ProductFormData {
  title: string;
  description: string;
  price: number;
  category: string;
  variant: ProductVariant;
  ingredients: string;
  imageUrl: string;
  manufacturerName: string;
  manufacturerLicense: string;
  allowsCustomIngredients: boolean;
}

export interface ProductFormErrors {
  title?: string;
  description?: string;
  price?: string;
  category?: string;
  variant?: string;
  ingredients?: string;
  imageUrl?: string;
  manufacturerName?: string;
  manufacturerLicense?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  createdAt: Date;
}