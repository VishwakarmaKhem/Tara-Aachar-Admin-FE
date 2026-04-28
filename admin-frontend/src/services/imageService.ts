import { apiClient, type ApiResponse } from '../lib/apiClient';

export const uploadImage = (
  file: File,
  type: string = 'Product'
): Promise<ApiResponse<string>> => {
  const formData = new FormData();
  formData.append('file', file);
  return apiClient.upload<string>('/images/upload', formData, { type });
};
