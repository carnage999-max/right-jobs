import { QueryClient } from '@tanstack/react-query';

/**
 * Create a configured QueryClient with optimized caching settings for mobile app
 * 
 * Cache Strategy:
 * - Default staleTime: 5 minutes (data is fresh for 5 mins, no API calls during this time)
 * - Default cacheTime: 10 minutes (data kept in memory for 10 mins after all observers unsubscribe)
 * - refetchOnWindowFocus: false (don't refetch when app is resumed - mobile doesn't have "windows")
 * - refetchOnReconnect: true (refetch when device reconnects to internet)
 * - refetchOnMount: false (don't refetch on component mount if data already in cache)
 * - Retry: 3 times with exponential backoff (important for mobile network reliability)
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Data is fresh for 5 minutes
      staleTime: 5 * 60 * 1000,
      
      // Keep unused data in cache for 10 minutes before garbage collection
      gcTime: 10 * 60 * 1000, // formerly cacheTime
      
      // Retry failed requests up to 3 times
      retry: 3,
      
      // Exponential backoff: 1s, 2s, 4s between retries
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      
      // Don't refetch when window is focused (mobile apps don't have window focus events)
      refetchOnWindowFocus: false,
      
      // Refetch when device reconnects to internet
      refetchOnReconnect: true,
      
      // Don't refetch on mount if data already exists
      refetchOnMount: false,
      
      // Never refetch in background automatically
      refetchIntervalInBackground: false,
    },
    mutations: {
      // Retry mutations 1 time (less aggressive than queries)
      retry: 1,
      
      // Exponential backoff for mutations
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
});
