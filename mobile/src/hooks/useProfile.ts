import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { profileService } from '../services/api/profile';
import { QUERY_KEYS } from '../constants/queryKeys';

/**
 * Hook for fetching and caching profile data
 * Data will be cached for 5 minutes, avoiding unnecessary API calls
 */
export const useProfile = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.PROFILE],
    queryFn: () => profileService.getProfile(),
    // These inherit from queryClient defaults, but can be overridden per hook if needed
  });
};

/**
 * Hook for updating profile data with automatic cache invalidation
 */
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => profileService.updateProfile(data),
    // Automatically invalidate profile cache after successful update
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PROFILE] });
    },
  });
};

/**
 * Manually refetch profile data
 * Use this when you need fresh data immediately (e.g., after uploading a file)
 */
export const useRefreshProfile = () => {
  const queryClient = useQueryClient();
  
  return () => {
    return queryClient.refetchQueries({ queryKey: [QUERY_KEYS.PROFILE] });
  };
};

/**
 * Prefetch profile data before navigating to a screen
 * Reduces perceived load time
 */
export const usePrefetchProfile = () => {
  const queryClient = useQueryClient();
  
  return () => {
    return queryClient.prefetchQuery({
      queryKey: [QUERY_KEYS.PROFILE],
      queryFn: () => profileService.getProfile(),
    });
  };
};
