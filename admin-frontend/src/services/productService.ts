import type { Product, ProductFormData } from '../types/Product';
import { getToken } from './authService';

const API_BASE_URL = 'https://tara-aachar-admin-be.onrender.com/api/v1/achar';

const getAuthHeaders = (): Record<string, string> => {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface PaginationParams {
  pageNo?: number;
  pageSize?: number;
}

// Create a new product
export const createProduct = async (
  productData: Omit<ProductFormData, 'id' | 'createdAt' | 'updatedAt'>
): Promise<ApiResponse<Product>> => {
  try {
    const response = await fetch(`${API_BASE_URL}`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(productData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return {
      success: true,
      message: 'Product created successfully',
      data: result.data,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to create product';
    console.error('Create product error:', error);
    return {
      success: false,
      message: errorMessage,
      error: errorMessage,
    };
  }
};

// Get all products with pagination
export const getAllProducts = async (params?: PaginationParams): Promise<ApiResponse<Product[]>> => {
  try {
    const queryParams = new URLSearchParams();
    if (params?.pageNo !== undefined) queryParams.append('pageNo', params.pageNo.toString());
    if (params?.pageSize !== undefined) queryParams.append('pageSize', params.pageSize.toString());

    const url = queryParams.toString() 
      ? `${API_BASE_URL}?${queryParams.toString()}`
      : API_BASE_URL;

    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return {
      success: true,
      message: 'Products fetched successfully',
      data: result.data,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch products';
    console.error('Fetch products error:', error);
    return {
      success: false,
      message: errorMessage,
      error: errorMessage,
    };
  }
};

// Get product by ID
export const getProductById = async (productId: string): Promise<ApiResponse<Product>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/${productId}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return {
      success: true,
      message: 'Product fetched successfully',
      data: result.data,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch product';
    console.error('Fetch product error:', error);
    return {
      success: false,
      message: errorMessage,
      error: errorMessage,
    };
  }
};

// Update product
export const updateProduct = async (
  productId: string,
  productData: Omit<ProductFormData, 'id' | 'createdAt' | 'updatedAt'>
): Promise<ApiResponse<Product>> => {
  try {
    const response = await fetch(`${API_BASE_URL}?id=${productId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(productData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return {
      success: true,
      message: 'Product updated successfully',
      data: result.data,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to update product';
    console.error('Update product error:', error);
    return {
      success: false,
      message: errorMessage,
      error: errorMessage,
    };
  }
};

// Delete product
export const deleteProduct = async (productId: string): Promise<ApiResponse<null>> => {
  try {
    const response = await fetch(`${API_BASE_URL}?id=${productId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return {
      success: true,
      message: 'Product deleted successfully',
      data: null,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to delete product';
    console.error('Delete product error:', error);
    return {
      success: false,
      message: errorMessage,
      error: errorMessage,
    };
  }
};
