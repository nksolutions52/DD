import { useState, useEffect, useCallback } from 'react';
import { PageRequest, PageResponse } from '../types';

interface UsePaginatedApiOptions<T> {
  initialPageSize?: number;
  initialSortBy?: string;
  initialSortDirection?: 'asc' | 'desc';
  onError?: (error: Error) => void;
}

export function usePaginatedApi<T>(
  apiFunction: (pageRequest: PageRequest) => Promise<PageResponse<T>>,
  options: UsePaginatedApiOptions<T> = {}
) {
  const [data, setData] = useState<PageResponse<T> | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pageRequest, setPageRequest] = useState<PageRequest>({
    page: 0,
    size: options.initialPageSize || 10,
    sortBy: options.initialSortBy || 'id',
    sortDirection: options.initialSortDirection || 'asc',
    search: '',
  });

  const fetchData = useCallback(async (request: PageRequest) => {
    try {
      setIsLoading(true);
      const result = await apiFunction(request);
      setData(result);
      setError(null);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('An error occurred');
      setError(error);
      if (options.onError) {
        options.onError(error);
      }
    } finally {
      setIsLoading(false);
    }
  }, [apiFunction, options]);

  useEffect(() => {
    fetchData(pageRequest);
  }, [fetchData, pageRequest]);

  const updatePageRequest = useCallback((updates: Partial<PageRequest>) => {
    setPageRequest(prev => ({
      ...prev,
      ...updates,
      // Reset to first page when search or sort changes
      ...(updates.search !== undefined || updates.sortBy !== undefined || updates.sortDirection !== undefined 
        ? { page: 0 } 
        : {}),
    }));
  }, []);

  const setPage = useCallback((page: number) => {
    updatePageRequest({ page });
  }, [updatePageRequest]);

  const setPageSize = useCallback((size: number) => {
    updatePageRequest({ size, page: 0 });
  }, [updatePageRequest]);

  const setSearch = useCallback((search: string) => {
    updatePageRequest({ search });
  }, [updatePageRequest]);

  const setSort = useCallback((sortBy: string, sortDirection: 'asc' | 'desc' = 'asc') => {
    updatePageRequest({ sortBy, sortDirection });
  }, [updatePageRequest]);

  const refetch = useCallback(() => {
    fetchData(pageRequest);
  }, [fetchData, pageRequest]);

  return {
    data,
    error,
    isLoading,
    pageRequest,
    setPage,
    setPageSize,
    setSearch,
    setSort,
    updatePageRequest,
    refetch,
  };
}