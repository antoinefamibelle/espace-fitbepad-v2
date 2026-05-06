import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@frontend/lib/auth/client';
import {
  Coach,
  CoachCreateRequest,
  CoachUpdateRequest,
  PaginatedCoachesResponse,
  CoachResponse,
  CoachCreatedResponse,
  CoachUpdatedResponse,
  CoachDeletedResponse,
  CoachQueryParams
} from 'shared';
import { api } from '@frontend/lib/api';
import { toast } from 'sonner';

interface UseAdminCoachesParams {
  search?: string;
  pageIndex?: number;
  pageSize?: number;
}

/**
 * Hook for fetching paginated coaches with server-side filtering
 */
export function useAdminCoaches(params: UseAdminCoachesParams = {}) {
  const { getToken } = useAuth();
  const { search, pageIndex = 0, pageSize = 10 } = params;

  return useQuery<PaginatedCoachesResponse>({
    queryKey: ['adminCoaches', search, pageIndex, pageSize],
    queryFn: async () => {
      const token = await getToken();
      if (!token) {
        throw new Error('Authentication token not available');
      }

      const queryParams: Record<string, any> = {
        page: pageIndex + 1,
        limit: pageSize,
      };

      if (search) queryParams.search = search;

      const response = await api.get<PaginatedCoachesResponse>('/admin/coaches', {
        params: queryParams,
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    placeholderData: (previousData) => previousData,
  });
}

/**
 * Hook for fetching coaches stats (all coaches for calculations)
 */
export function useAdminCoachesStats() {
  const { getToken } = useAuth();

  return useQuery<PaginatedCoachesResponse>({
    queryKey: ['adminCoachesStats'],
    queryFn: async () => {
      const token = await getToken();
      if (!token) {
        throw new Error('Authentication token not available');
      }

      const response = await api.get<PaginatedCoachesResponse>('/admin/coaches', {
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook for fetching a single coach by ID
 */
export function useAdminCoach(id: string) {
  const { getToken } = useAuth();

  return useQuery<CoachResponse>({
    queryKey: ['adminCoach', id],
    queryFn: async () => {
      const token = await getToken();
      if (!token) {
        throw new Error('Authentication token not available');
      }

      const response = await api.get<CoachResponse>(`/admin/coaches/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook for creating a new coach
 */
export function useCreateAdminCoach() {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation<CoachCreatedResponse, Error, CoachCreateRequest>({
    mutationFn: async (data: CoachCreateRequest) => {
      const token = await getToken();
      if (!token) {
        throw new Error('Authentication token not available');
      }

      const response = await api.post<CoachCreatedResponse>('/admin/coaches', data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data;
    },
    onSuccess: () => {
      toast.success('Coach créé avec succès');
      queryClient.invalidateQueries({ queryKey: ['adminCoaches'] });
      queryClient.invalidateQueries({ queryKey: ['adminCoachesStats'] });
    },
    onError: (error) => {
      toast.error('Erreur lors de la création du coach');
      console.error('Error creating coach:', error);
    },
  });
}

/**
 * Hook for updating a coach
 */
export function useUpdateAdminCoach() {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation<CoachUpdatedResponse, Error, { id: string } & CoachUpdateRequest>({
    mutationFn: async ({ id, ...data }) => {
      const token = await getToken();
      if (!token) {
        throw new Error('Authentication token not available');
      }

      const response = await api.put<CoachUpdatedResponse>(`/admin/coaches/${id}`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data;
    },
    onSuccess: (_, variables) => {
      toast.success('Coach mis à jour avec succès');
      queryClient.invalidateQueries({ queryKey: ['adminCoaches'] });
      queryClient.invalidateQueries({ queryKey: ['adminCoachesStats'] });
      queryClient.invalidateQueries({ queryKey: ['adminCoach', variables.id] });
    },
    onError: (error) => {
      toast.error('Erreur lors de la mise à jour du coach');
      console.error('Error updating coach:', error);
    },
  });
}

/**
 * Hook for deleting a coach
 */
export function useDeleteAdminCoach() {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation<CoachDeletedResponse, Error, string>({
    mutationFn: async (id: string) => {
      const token = await getToken();
      if (!token) {
        throw new Error('Authentication token not available');
      }

      const response = await api.delete<CoachDeletedResponse>(`/admin/coaches/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data;
    },
    onSuccess: (_, id) => {
      toast.success('Coach supprimé avec succès');
      queryClient.invalidateQueries({ queryKey: ['adminCoaches'] });
      queryClient.invalidateQueries({ queryKey: ['adminCoachesStats'] });
      queryClient.invalidateQueries({ queryKey: ['adminCoach', id] });
    },
    onError: (error) => {
      toast.error('Erreur lors de la suppression du coach');
      console.error('Error deleting coach:', error);
    },
  });
}