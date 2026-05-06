import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@frontend/lib/auth/client';
import {
  Service,
  ServiceCreateRequest,
  ServiceUpdateRequest,
  PaginatedServicesResponse,
  ServiceResponse,
  ServiceCreatedResponse,
  ServiceUpdatedResponse,
  ServiceDeletedResponse,
  ServiceQueryParams
} from 'shared';
import { api } from '@frontend/lib/api';
import { toast } from 'sonner';

interface UseAdminServicesParams {
  search?: string;
  pageIndex?: number;
  pageSize?: number;
  status?: string;
}

/**
 * Hook for fetching paginated services with server-side filtering
 */
export function useAdminServices(params: UseAdminServicesParams = {}) {
  const { getToken } = useAuth();
  const { search, pageIndex = 0, pageSize = 10, status } = params;

  return useQuery<PaginatedServicesResponse>({
    queryKey: ['adminServices', search, pageIndex, pageSize, status],
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
      if (status) queryParams.status = status;

      const response = await api.get<PaginatedServicesResponse>('/admin/services', {
        params: queryParams,
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    placeholderData: (previousData: PaginatedServicesResponse | undefined) => previousData,
  });
}

/**
 * Hook for fetching services stats (all services for calculations)
 */
export function useAdminServicesStats() {
  const { getToken } = useAuth();

  return useQuery<PaginatedServicesResponse>({
    queryKey: ['adminServicesStats'],
    queryFn: async () => {
      const token = await getToken();
      if (!token) {
        throw new Error('Authentication token not available');
      }

      const response = await api.get<PaginatedServicesResponse>('/admin/services', {
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook for fetching a single service by ID
 */
export function useAdminService(id: string) {
  const { getToken } = useAuth();

  return useQuery<ServiceResponse>({
    queryKey: ['adminService', id],
    queryFn: async () => {
      const token = await getToken();
      if (!token) {
        throw new Error('Authentication token not available');
      }

      const response = await api.get<ServiceResponse>(`/admin/services/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook for creating a new service
 */
export function useCreateAdminService() {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation<ServiceCreatedResponse, Error, ServiceCreateRequest>({
    mutationFn: async (data: ServiceCreateRequest) => {
      const token = await getToken();
      if (!token) {
        throw new Error('Authentication token not available');
      }

      const response = await api.post<ServiceCreatedResponse>('/admin/services', data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data;
    },
    onSuccess: () => {
      toast.success('Service créé avec succès');
      queryClient.invalidateQueries({ queryKey: ['adminServices'] });
      queryClient.invalidateQueries({ queryKey: ['adminServicesStats'] });
    },
    onError: (error) => {
      toast.error('Erreur lors de la création du service');
      console.error('Error creating service:', error);
    },
  });
}

/**
 * Hook for updating a service
 */
export function useUpdateAdminService() {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation<ServiceUpdatedResponse, Error, { id: string } & ServiceUpdateRequest>({
    mutationFn: async ({ id, ...data }) => {
      const token = await getToken();
      if (!token) {
        throw new Error('Authentication token not available');
      }

      const response = await api.put<ServiceUpdatedResponse>(`/admin/services/${id}`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data;
    },
    onSuccess: (_, variables) => {
      toast.success('Service mis à jour avec succès');
      queryClient.invalidateQueries({ queryKey: ['adminServices'] });
      queryClient.invalidateQueries({ queryKey: ['adminServicesStats'] });
      queryClient.invalidateQueries({ queryKey: ['adminService', variables.id] });
    },
    onError: (error) => {
      toast.error('Erreur lors de la mise à jour du service');
      console.error('Error updating service:', error);
    },
  });
}

/**
 * Hook for deleting a service
 */
export function useDeleteAdminService() {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation<ServiceDeletedResponse, Error, string>({
    mutationFn: async (id: string) => {
      const token = await getToken();
      if (!token) {
        throw new Error('Authentication token not available');
      }

      const response = await api.delete<ServiceDeletedResponse>(`/admin/services/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data;
    },
    onSuccess: (_, id) => {
      toast.success('Service supprimé avec succès');
      queryClient.invalidateQueries({ queryKey: ['adminServices'] });
      queryClient.invalidateQueries({ queryKey: ['adminServicesStats'] });
      queryClient.invalidateQueries({ queryKey: ['adminService', id] });
    },
    onError: (error) => {
      toast.error('Erreur lors de la suppression du service');
      console.error('Error deleting service:', error);
    },
  });
}