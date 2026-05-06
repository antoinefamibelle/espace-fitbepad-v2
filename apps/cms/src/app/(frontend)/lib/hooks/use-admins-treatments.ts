import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@frontend/lib/auth/client';
import { 
  Treatment, 
  TreatmentCreateRequest, 
  TreatmentUpdateRequest,
  TreatmentDuplicateRequest,
  PaginatedTreatmentsResponse,
  TreatmentResponse,
  TreatmentCreatedResponse,
  TreatmentUpdatedResponse,
  TreatmentDuplicatedResponse,
  TreatmentDeletedResponse 
} from 'shared';
import { api } from '@frontend/lib/api';
import { toast } from 'sonner';

// Use the shared type instead of custom interface
type TreatmentsResponse = PaginatedTreatmentsResponse;

interface UseAdminTreatmentsParams {
  search?: string;
  centerId?: string;
  status?: 'active' | 'inactive' | string;
  pageIndex?: number;
  pageSize?: number;
}

export function useAdminTreatments(params: UseAdminTreatmentsParams = {}) {
  const { getToken } = useAuth();
  const { search, centerId, status, pageIndex = 0, pageSize = 10 } = params;

  return useQuery<PaginatedTreatmentsResponse>({
    queryKey: ['adminTreatments', search, centerId, status, pageIndex, pageSize],
    queryFn: async () => {
      const token = await getToken();
      if (!token) {
        throw new Error('Authentication token not available');
      }

      const response = await api.get<PaginatedTreatmentsResponse>(`/admin/treatments`, {
        params: {
          search,
          centerId,
          status,
          pageIndex,
          pageSize,
        },

        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    },
  });
}

export function useAdminTreatmentsStats() {
  const { getToken } = useAuth();

  return useQuery<PaginatedTreatmentsResponse>({
    queryKey: ['adminTreatmentsStats'],
    queryFn: async () => {
      const token = await getToken();
      if (!token) {
        throw new Error('Authentication token not available');
      }

      const response = await api.get<PaginatedTreatmentsResponse>('/admin/treatments', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    },
  });
}

export function useCreateAdminTreatment() {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation<TreatmentCreatedResponse, Error, TreatmentCreateRequest>({
    mutationFn: async (data: TreatmentCreateRequest) => {
      const token = await getToken();
      if (!token) {
        throw new Error('Authentication token not available');
      }

      const response = await api.post<TreatmentCreatedResponse>('/admin/treatments', data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    },
    onSuccess: () => {
      toast.success('Service créé avec succès');
      queryClient.invalidateQueries({ queryKey: ['adminTreatments'] });
      queryClient.invalidateQueries({ queryKey: ['adminTreatmentsStats'] });
    },
    onError: (error) => {
      toast.error('Erreur lors de la création du service');
      console.error('Error creating treatment:', error);
    },
  });
}

export function useUpdateAdminTreatment() {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation<TreatmentUpdatedResponse, Error, { id: string } & TreatmentUpdateRequest>({
    mutationFn: async ({ id, ...data }) => {
      const token = await getToken();
      if (!token) {
        throw new Error('Authentication token not available');
      }

      const response = await api.patch<TreatmentUpdatedResponse>(`/admin/treatments/${id}`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    },
    onSuccess: () => {
      toast.success('Service mis à jour avec succès');
      queryClient.invalidateQueries({ queryKey: ['adminTreatments'] });
      queryClient.invalidateQueries({ queryKey: ['adminTreatmentsStats'] });
    },
    onError: (error) => {
      toast.error('Erreur lors de la mise à jour du service');
      console.error('Error updating treatment:', error);
    },
  });
}

export function useDeleteAdminTreatment() {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation<TreatmentDeletedResponse, Error, string>({
    mutationFn: async (id: string) => {
      const token = await getToken();
      if (!token) {
        throw new Error('Authentication token not available');
      }

      const response = await api.delete<TreatmentDeletedResponse>(`/admin/treatments/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    },
    onSuccess: () => {
      toast.success('Service supprimé avec succès');
      queryClient.invalidateQueries({ queryKey: ['adminTreatments'] });
      queryClient.invalidateQueries({ queryKey: ['adminTreatmentsStats'] });
    },
    onError: (error) => {
      toast.error('Erreur lors de la suppression du service');
      console.error('Error deleting treatment:', error);
    },
  });
}

export function useDuplicateAdminTreatment() {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation<TreatmentDuplicatedResponse, Error, {
    treatmentId: string;
    targetCenterId: string;
  }>({
    mutationFn: async ({
      treatmentId,
      targetCenterId,
    }) => {
      const token = await getToken();
      if (!token) {
        throw new Error('Authentication token not available');
      }

      const response = await api.post<TreatmentDuplicatedResponse>(
        `/admin/treatments/${treatmentId}/duplicate`,
        { targetCenterId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success('Service dupliqué avec succès');
      queryClient.invalidateQueries({ queryKey: ['adminTreatments'] });
      queryClient.invalidateQueries({ queryKey: ['adminTreatmentsStats'] });
    },
    onError: (error) => {
      toast.error('Erreur lors de la duplication du service');
      console.error('Error duplicating treatment:', error);
    },
  });
}
