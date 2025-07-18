import { useState, useEffect, useCallback, useRef } from 'react';
import { PageRequest, PageResponse } from '../types';

interface UsePaginatedApiOptions<T> {
  initialPageSize?: number;
  initialSortBy?: string;
  initialSortDirection?: 'asc' | 'desc';
  onError?: (error: Error) => void;
  enableCache?: boolean;
  cacheKey?: string;
}

interface CacheEntry<T> {
  data: PageResponse<T>;
  timestamp: number;
}

// Global cache for paginated data
const paginationCache = new Map<string, CacheEntry<any>>();
const CACHE_DURATION = 3 * 60 * 1000; // 3 minutes

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

  // Track component mount state
  const isMountedRef = useRef(true);
  const abortControllerRef = useRef<AbortController | null>(null);
  const lastRequestRef = useRef<string>('');

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const getCacheKey = useCallback((request: PageRequest) => {
    const baseKey = options.cacheKey || 'paginated-data';
    return `${baseKey}-${JSON.stringify(request)}`;
  }, [options.cacheKey]);

  const fetchData = useCallback(async (request: PageRequest, force = false) => {
    const requestKey = JSON.stringify(request);
    
    // Prevent duplicate requests
    if (lastRequestRef.current === requestKey && !force) {
      return;
    }
    
    lastRequestRef.current = requestKey;

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    abortControllerRef.current = new AbortController();

    try {
      // Check cache first if enabled and not forced
      if (options.enableCache !== false && !force) {
        const cacheKey = getCacheKey(request);
        const cachedEntry = paginationCache.get(cacheKey);
        
        if (cachedEntry && (Date.now() - cachedEntry.timestamp) < CACHE_DURATION) {
          console.log('Using cached data for:', cacheKey);
          if (isMountedRef.current) {
            setData(cachedEntry.data);
            setError(null);
            setIsLoading(false);
          }
          return;
        }
      }

      console.log('Making API call for:', request);
      
      // Set loading only if we don't have cached data
      if (isMountedRef.current) {
        setIsLoading(true);
        setError(null);
      }

      const result = await apiFunction(request);
      console.log('API response received:', result);

      // Update state if component is still mounted
      if (isMountedRef.current) {
        setData(result);
        setError(null);
        setIsLoading(false);

        // Cache the result if enabled
        if (options.enableCache !== false) {
          const cacheKey = getCacheKey(request);
          paginationCache.set(cacheKey, {
            data: result,
            timestamp: Date.now(),
          });
        }
      }
    } catch (err: any) {
      // Don't handle aborted requests as errors
      if (err.name === 'AbortError') {
        return;
      }
      
      console.error('API call failed:', err);
      if (isMountedRef.current) {
        const error = err instanceof Error ? err : new Error('An error occurred');
        setError(error);
        setIsLoading(false);
        if (options.onError) {
          options.onError(error);
        }
      }
    }
  }, [apiFunction, options, getCacheKey]);

  // Debounced fetch for search
  const debouncedFetchRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    // Clear existing timeout
    if (debouncedFetchRef.current) {
      clearTimeout(debouncedFetchRef.current);
    }

    // If it's a search operation, debounce it
    if (pageRequest.search && pageRequest.search.length > 0) {
      debouncedFetchRef.current = setTimeout(() => {
        fetchData(pageRequest);
      }, 300);
    } else {
      // For non-search operations, fetch immediately
      fetchData(pageRequest);
    }

    return () => {
      if (debouncedFetchRef.current) {
        clearTimeout(debouncedFetchRef.current);
      }
    };
  }, [pageRequest, fetchData]);

  const updatePageRequest = useCallback((updates: Partial<PageRequest>) => {
    setPageRequest(prev => {
      const newRequest = {
        ...prev,
        ...updates,
        // Reset to first page when search or sort changes
        ...(updates.search !== undefined || updates.sortBy !== undefined || updates.sortDirection !== undefined 
          ? { page: 0 } 
          : {}),
      };
      return newRequest;
    });
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

  const refetch = useCallback((force = false) => {
    return fetchData(pageRequest, force);
  }, [fetchData, pageRequest]);

  const clearCache = useCallback(() => {
    if (options.cacheKey) {
      const keysToDelete = Array.from(paginationCache.keys()).filter(key => 
        key.startsWith(options.cacheKey!)
      );
      keysToDelete.forEach(key => paginationCache.delete(key));
    } else {
      paginationCache.clear();
    }
  }, [options.cacheKey]);

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
    clearCache,
  };
}

// Utility function to clear all pagination cache
export const clearAllPaginationCache = () => {
  paginationCache.clear();
};

// Utility function to clear expired cache entries
export const clearExpiredCache = () => {
  const now = Date.now();
  for (const [key, entry] of paginationCache.entries()) {
    if (now - entry.timestamp > CACHE_DURATION) {
      paginationCache.delete(key);
    }
  }
};