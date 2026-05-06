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

interface UseAdminCoachsParams {
  search?: string;
  centerId?: string;
  pageIndex?: number;
  pageSize?: number;
}

/**
 * Hook for fetching paginated specialists with server-side filtering
 */
export function useAdminCoachs(params: UseAdminCoachsParams = {}) {
  const { getToken } = useAuth();
  const { search, centerId, pageIndex = 0, pageSize = 10 } = params;

  return useQuery<PaginatedCoachesResponse>({
    queryKey: ['adminCoachs', search, centerId, pageIndex, pageSize],
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
      if (centerId && centerId.length > 0) queryParams.centerId = centerId;

      const response = await api.get<PaginatedCoachesResponse>('/admin/specialists', {
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
 * Hook for fetching specialists stats (all specialists for calculations)
 */
export function useAdminCoachsStats() {
  const { getToken } = useAuth();

  return useQuery<PaginatedCoachesResponse>({
    queryKey: ['adminCoachsStats'],
    queryFn: async () => {
      const token = await getToken();
      if (!token) {
        throw new Error('Authentication token not available');
      }

      const response = await api.get<PaginatedCoachesResponse>('/admin/specialists', {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      return response.data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook for fetching a single specialist by ID
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

      const response = await api.get<CoachResponse>(`/admin/specialists/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      return response.data;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook for creating a new specialist
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

      const response = await api.post<CoachCreatedResponse>('/admin/specialists', data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      return response.data;
    },
    onSuccess: () => {
      toast.success('Spécialiste créé avec succès');
      queryClient.invalidateQueries({ queryKey: ['adminCoachs'] });
      queryClient.invalidateQueries({ queryKey: ['adminCoachsStats'] });
    },
    onError: (error) => {
      toast.error('Erreur lors de la création du spécialiste');
      console.error('Error creating specialist:', error);
    },
  });
}

/**
 * Hook for updating a specialist
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

      const response = await api.patch<CoachUpdatedResponse>(`/admin/specialists/${id}`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      return response.data;
    },
    onSuccess: (_, variables) => {
      toast.success('Spécialiste mis à jour avec succès');
      queryClient.invalidateQueries({ queryKey: ['adminCoachs'] });
      queryClient.invalidateQueries({ queryKey: ['adminCoachsStats'] });
      queryClient.invalidateQueries({ queryKey: ['adminCoach', variables.id] });
    },
    onError: (error) => {
      toast.error('Erreur lors de la mise à jour du spécialiste');
      console.error('Error updating specialist:', error);
    },
  });
}

/**
 * Hook for deleting a specialist
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

      const response = await api.delete<CoachDeletedResponse>(`/admin/specialists/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      return response.data;
    },
    onSuccess: (_, id) => {
      toast.success('Spécialiste supprimé avec succès');
      queryClient.invalidateQueries({ queryKey: ['adminCoachs'] });
      queryClient.invalidateQueries({ queryKey: ['adminCoachsStats'] });
      queryClient.invalidateQueries({ queryKey: ['adminCoach', id] });
    },
    onError: (error) => {
      toast.error('Erreur lors de la suppression du spécialiste');
      console.error('Error deleting specialist:', error);
    },
  });
}