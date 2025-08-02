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
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export function usePaginatedApi<T>(
  apiFunction: (pageRequest: PageRequest) => Promise<PageResponse<T>>,
  options: UsePaginatedApiOptions<T> = {}
) {
  const [data, setData] = useState<PageResponse<T>>({
    content: [],
    page: 0,
    size: options.initialPageSize || 10,
    totalElements: 0,
    totalPages: 0,
    first: true,
    last: true,
    empty: true,
  });
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pageRequest, setPageRequest] = useState<PageRequest>({
    page: 0,
    size: options.initialPageSize || 10,
    sortBy: options.initialSortBy || 'id',
    sortDirection: options.initialSortDirection || 'asc',
    search: '',
  });

  // Track component mount state and current request
  const isMountedRef = useRef(true);
  const abortControllerRef = useRef<AbortController | null>(null);
  const lastRequestIdRef = useRef<string>('');
  const hasInitializedRef = useRef(false);

  useEffect(() => {
    isMountedRef.current = true;
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
    const requestId = JSON.stringify(request) + (force ? '-force' : '');
    
    // Prevent duplicate requests only if we've already initialized
    if (lastRequestIdRef.current === requestId && hasInitializedRef.current) {
      console.log('Preventing duplicate request:', requestId);
      return;
    }
    
    lastRequestIdRef.current = requestId;

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    abortControllerRef.current = new AbortController();

    try {
      // Check cache first if enabled and not forced
      if (options.enableCache !== false && !force && hasInitializedRef.current) {
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
      
      // Set loading state
      if (isMountedRef.current) {
        setIsLoading(true);
        setError(null);
      }

      let result = await apiFunction(request);
      console.log('API response received:', result);

      // Defensive: If result is an array, wrap it as paginated object
      if (Array.isArray(result)) {
        result = {
          content: result,
          page: 0,
          totalPages: 1,
          totalElements: result.length,
          size: result.length,
          first: true,
          last: true,
          empty: result.length === 0,
        };
        console.warn('API returned array, wrapped as paginated object:', result);
      }

      // Update state immediately after successful response
      if (isMountedRef.current) {
        console.log('Updating component state with data');
        setData(result);
        setError(null);
        hasInitializedRef.current = true;
        // Force loading to false immediately
        setIsLoading(false);
        console.log('Loading state set to false');

        // Cache the result if enabled
        if (options.enableCache !== false) {
          const cacheKey = getCacheKey(request);
          paginationCache.set(cacheKey, {
            data: result,
            timestamp: Date.now(),
          });
          console.log('Data cached with key:', cacheKey);
        }
      }
    } catch (err: any) {
      // Don't handle aborted requests as errors
      if (err.name === 'AbortError') {
        console.log('Request aborted');
        return;
      }
      
      console.error('API call failed:', err);
      if (isMountedRef.current) {
        const error = err instanceof Error ? err : new Error('An error occurred');
        setError(error);
        hasInitializedRef.current = true;
        setIsLoading(false);
        console.log('Loading state set to false due to error');
        if (options.onError) {
          options.onError(error);
        }
      }
    }
  }, [apiFunction, options, getCacheKey]);

  // Debounced fetch for search
  const debouncedFetchRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    console.log('useEffect triggered with pageRequest:', pageRequest);
    
    // Clear existing timeout
    if (debouncedFetchRef.current) {
      clearTimeout(debouncedFetchRef.current);
    }

    // If it's a search operation, debounce it
    if (pageRequest.search && pageRequest.search.length > 0) {
      console.log('Debouncing search request');
      debouncedFetchRef.current = setTimeout(() => {
        fetchData(pageRequest);
      }, 300);
    } else {
      // For non-search operations, fetch immediately
      console.log('Making immediate request');
      fetchData(pageRequest);
    }

    return () => {
      if (debouncedFetchRef.current) {
        clearTimeout(debouncedFetchRef.current);
      }
    };
  }, [pageRequest, fetchData]);

  const updatePageRequest = useCallback((updates: Partial<PageRequest>) => {
    console.log('Updating page request with:', updates);
    setPageRequest(prev => {
      const newRequest = {
        ...prev,
        ...updates,
        // Reset to first page when search or sort changes
        ...(updates.search !== undefined || updates.sortBy !== undefined || updates.sortDirection !== undefined 
          ? { page: 0 } 
          : {}),
      };
      console.log('New page request:', newRequest);
      return newRequest;
    });
  }, []);

  const setPage = useCallback((page: number) => {
    console.log('Setting page to:', page);
    updatePageRequest({ page });
  }, [updatePageRequest]);

  const setPageSize = useCallback((size: number) => {
    console.log('Setting page size to:', size);
    updatePageRequest({ size, page: 0 });
  }, [updatePageRequest]);

  const setSearch = useCallback((search: string) => {
    console.log('Setting search to:', search);
    updatePageRequest({ search });
  }, [updatePageRequest]);

  const setSort = useCallback((sortBy: string, sortDirection: 'asc' | 'desc' = 'asc') => {
    console.log('Setting sort to:', sortBy, sortDirection);
    updatePageRequest({ sortBy, sortDirection });
  }, [updatePageRequest]);

  const refetch = useCallback((force = false) => {
    console.log('Refetch called with force:', force);
    // Clear the last request ID to allow refetch
    lastRequestIdRef.current = '';
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

  // Debug logging for component state
  console.log('usePaginatedApi state:', {
    hasData: !!data,
    isLoading,
    error: !!error,
    contentLength: data?.content?.length || 0,
    totalPages: data?.totalPages || 0,
    currentPage: data?.page || 0
  });

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