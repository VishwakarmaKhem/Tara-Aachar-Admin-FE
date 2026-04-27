import { getToken } from './authService';

const API_BASE_URL = 'https://tara-aachar-admin-be.onrender.com/api/v1/images';

export interface ImageUploadResponse {
  success: boolean;
  message: string;
  data?: string; // The image URL
  error?: string;
}

export const uploadImage = async (file: File, type: string = 'Product'): Promise<ImageUploadResponse> => {
  try {
    const token = getToken();
    
    if (!token) {
      throw new Error('Authentication required');
    }

    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/upload?type=${type}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      try {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      } catch (e) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    }

    const result = await response.json();
    
    return {
      success: result.success || true,
      message: result.message || 'Image uploaded successfully',
      data: result.data,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to upload image';
    console.error('Image upload error:', error);
    return {
      success: false,
      message: errorMessage,
      error: errorMessage,
    };
  }
};
