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
  pageRequest: PageRequest;
}

// Global cache for paginated data
const paginationCache = new Map<string, CacheEntry<any>>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

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

  // Use refs to track component state and prevent duplicate calls
  const isMountedRef = useRef(true);
  const abortControllerRef = useRef<AbortController | null>(null);
  const lastRequestRef = useRef<string>('');
  const isInitializedRef = useRef(false);
  const currentRequestRef = useRef<Promise<void> | null>(null);

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

  const isValidCache = useCallback((cacheEntry: CacheEntry<T>) => {
    return Date.now() - cacheEntry.timestamp < CACHE_DURATION;
  }, []);

  const fetchData = useCallback(async (request: PageRequest, force = false) => {
    // Prevent duplicate requests
    if (currentRequestRef.current && !force) {
      return currentRequestRef.current;
    }

    // Create a unique request identifier
    const requestId = `${Date.now()}-${Math.random()}`;
    lastRequestRef.current = requestId;

    // Check cache first if enabled and not forced
    if (options.enableCache !== false && !force) {
      const cacheKey = getCacheKey(request);
      const cachedEntry = paginationCache.get(cacheKey);
      
      if (cachedEntry && isValidCache(cachedEntry)) {
        if (isMountedRef.current && lastRequestRef.current === requestId) {
          setData(cachedEntry.data);
          setError(null);
          setIsLoading(false);
        }
        return Promise.resolve();
      }
    }

    const requestPromise = (async () => {
      try {
        // Cancel previous request
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }

        // Create new abort controller
        abortControllerRef.current = new AbortController();

        if (isMountedRef.current && lastRequestRef.current === requestId) {
          setIsLoading(true);
          setError(null);
        }

        const result = await apiFunction(request);

        // Only update state if this is still the latest request and component is mounted
        if (isMountedRef.current && lastRequestRef.current === requestId) {
          setData(result);
          setError(null);

          // Cache the result if enabled
          if (options.enableCache !== false) {
            const cacheKey = getCacheKey(request);
            paginationCache.set(cacheKey, {
              data: result,
              timestamp: Date.now(),
              pageRequest: request,
            });
          }
        }
      } catch (err) {
        // Only update error state if this is still the latest request and component is mounted
        if (isMountedRef.current && lastRequestRef.current === requestId) {
          const error = err instanceof Error ? err : new Error('An error occurred');
          setError(error);
          if (options.onError) {
            options.onError(error);
          }
        }
      } finally {
        if (isMountedRef.current && lastRequestRef.current === requestId) {
          setIsLoading(false);
        }
        currentRequestRef.current = null;
      }
    })();

    currentRequestRef.current = requestPromise;
    return requestPromise;
  }, [apiFunction, options, getCacheKey, isValidCache]);

  // Debounced fetch for search
  const debouncedFetchRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    // Skip initial effect if not initialized
    if (!isInitializedRef.current) {
      isInitializedRef.current = true;
      
      // For initial load, fetch immediately
      fetchData(pageRequest);
      return;
    }

    // Clear existing timeout
    if (debouncedFetchRef.current) {
      clearTimeout(debouncedFetchRef.current);
    }

    // If it's a search operation, debounce it
    if (pageRequest.search && pageRequest.search.length > 0) {
      debouncedFetchRef.current = setTimeout(() => {
        fetchData(pageRequest);
      }, 300); // 300ms debounce for search
    } else {
      // For non-search operations, fetch immediately
      fetchData(pageRequest);
    }

    return () => {
      if (debouncedFetchRef.current) {
        clearTimeout(debouncedFetchRef.current);
      }
    };
  }, [pageRequest.page, pageRequest.size, pageRequest.sortBy, pageRequest.sortDirection, pageRequest.search]);

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
      
      // Only update if the request actually changed
      const hasChanged = JSON.stringify(newRequest) !== JSON.stringify(prev);
      return hasChanged ? newRequest : prev;
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
      // Clear specific cache entries for this hook
      const keysToDelete = Array.from(paginationCache.keys()).filter(key => 
        key.startsWith(options.cacheKey!)
      );
      keysToDelete.forEach(key => paginationCache.delete(key));
    } else {
      // Clear all cache if no specific key
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