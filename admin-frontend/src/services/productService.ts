import type { Product, ProductFormData } from '../types/Product';
import { apiClient, type ApiResponse } from '../lib/apiClient';

export type { ApiResponse };

export interface PaginationParams {
  pageNo?: number;
  pageSize?: number;
}

type ProductPayload = Omit<ProductFormData, 'id' | 'createdAt' | 'updatedAt'> & {
  ingredients: string[];
};

export const createProduct = (
  productData: ProductPayload
): Promise<ApiResponse<Product>> =>
  apiClient.post<Product>('/achar', productData);

export const getAllProducts = (
  params?: PaginationParams
): Promise<ApiResponse<Product[]>> =>
  apiClient.get<Product[]>('/achar', {
    ...(params?.pageNo !== undefined ? { pageNo: params.pageNo } : {}),
    ...(params?.pageSize !== undefined ? { pageSize: params.pageSize } : {}),
  });

export const getProductById = (
  productId: string
): Promise<ApiResponse<Product>> =>
  apiClient.get<Product>(`/achar/${productId}`);

export const updateProduct = (
  productId: string,
  productData: ProductPayload
): Promise<ApiResponse<Product>> =>
  apiClient.put<Product>('/achar', productData, { id: productId });

export const deleteProduct = (
  productId: string
): Promise<ApiResponse<null>> =>
  apiClient.delete<null>('/achar', { id: productId });
