import { useQuery } from '@tanstack/react-query';
import { Coach, CoachResponse, PaginatedCoachesResponse } from 'shared';
import { api } from '@frontend/lib/api';

interface UseCoachesParams {
  search?: string;
  limit?: number;
  page?: number;
}

/**
 * Hook for fetching coaches (public endpoint)
 */
export function useCoaches(params: UseCoachesParams = {}) {
  const { search, limit = 10, page = 1 } = params;

  return useQuery<Coach[]>({
    queryKey: ['coaches', search, limit, page],
    queryFn: async () => {
      const queryParams: Record<string, any> = {
        page,
        limit,
      };

      if (search) queryParams.search = search;

      const response = await api.get<PaginatedCoachesResponse>('/coaches', {
        params: queryParams,
      });

      return response.data.coaches || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    placeholderData: (previousData) => previousData,
  });
}

/**
 * Hook for fetching all coaches without pagination
 */
export function useAllCoaches() {
  return useQuery<Coach[]>({
    queryKey: ['allCoaches'],
    queryFn: async () => {
      const response = await api.get<PaginatedCoachesResponse>('/coaches', {
        params: { limit: 100 }, // Large limit to get all coaches
      });

      return response.data.coaches || [];
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook for fetching a single coach by ID (public endpoint)
 */
export function useCoach(id: string) {
  return useQuery<Coach | undefined>({
    queryKey: ['coach', id],
    queryFn: async () => {
      if (!id) return undefined;

      const response = await api.get<CoachResponse>(`/coaches/${id}`);

      return response.data.coach;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook for fetching featured coaches (could be used for homepage)
 */
export function useFeaturedCoaches(limit = 6) {
  return useQuery<Coach[]>({
    queryKey: ['featuredCoaches', limit],
    queryFn: async () => {
      const response = await api.get<PaginatedCoachesResponse>('/coaches', {
        params: { limit, featured: true },
      });

      return response.data.coaches || [];
    },
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
}