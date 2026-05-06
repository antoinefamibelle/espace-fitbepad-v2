import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@frontend/lib/api';

export interface AdminPermission {
  id: string;
  centerId: string;
  centerName: string;
  centerSlug: string;
}

export interface AssignPermissionsData {
  userId: string;
  centerIds: string[];
}

export function useAdminPermissions(userId: string) {
  return useQuery<AdminPermission[]>({
    queryKey: ['adminPermissions', userId],
    queryFn: async () => {
      const response = await api.get(`/admin/admin-permissions?userId=${userId}`);
      return response.data;
    },
    enabled: !!userId,
  });
}

export function useAssignAdminPermissions() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: AssignPermissionsData) => {
      const response = await api.post('/admin/admin-permissions', data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      // Invalidate queries for the affected user
      queryClient.invalidateQueries({ 
        queryKey: ['adminPermissions', variables.userId] 
      });
    },
  });
}

export function useRemoveAdminPermission() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ userId, centerId }: { userId: string; centerId?: string }) => {
      const url = centerId 
        ? `/admin/admin-permissions?userId=${userId}&centerId=${centerId}`
        : `/admin/admin-permissions?userId=${userId}`;
      const response = await api.delete(url);
      return response.data;
    },
    onSuccess: (_, variables) => {
      // Invalidate queries for the affected user
      queryClient.invalidateQueries({ 
        queryKey: ['adminPermissions', variables.userId] 
      });
    },
  });
}