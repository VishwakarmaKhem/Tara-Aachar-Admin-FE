import { useState, useEffect, useCallback } from 'react';
import type { Product } from '../types/Product';
import { getAllProducts } from '../services/productService';

interface UseProductsResult {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  hasMore: boolean;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  refetch: () => void;
}

const PAGE_SIZE = 10;

export const useProducts = (): UseProductsResult => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [fetchTrigger, setFetchTrigger] = useState(0);

  const refetch = useCallback(() => {
    setFetchTrigger(t => t + 1);
  }, []);

  useEffect(() => {
    let cancelled = false;

    const fetch = async () => {
      setIsLoading(true);
      setError(null);

      const response = await getAllProducts({ pageNo: currentPage, pageSize: PAGE_SIZE });

      if (cancelled) return;

      if (response.success && response.data) {
        setProducts(response.data);
        setHasMore(response.data.length === PAGE_SIZE);
      } else {
        setError(response.error || 'Failed to fetch products');
      }

      setIsLoading(false);
    };

    fetch();

    return () => { cancelled = true; };
  }, [currentPage, fetchTrigger]);

  return { products, isLoading, error, hasMore, currentPage, setCurrentPage, refetch };
};
