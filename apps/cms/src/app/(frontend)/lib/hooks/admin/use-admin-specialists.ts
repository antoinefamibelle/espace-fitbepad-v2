import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { specialistsApi } from '@frontend/lib/services/admin-api';
import { toast } from 'sonner';

interface UseAdminCoachsParams {
  search?: string;
  centerId?: string;
  page?: number;
  limit?: number;
}

// Hook for listing specialists
export const useAdminCoachs = (params?: UseAdminCoachsParams) => {
  return useQuery({
    queryKey: ['admin', 'specialists', params],
    queryFn: () => specialistsApi.getCoachs(params),
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};

// Hook for getting a single specialist
export const useAdminCoach = (id: string) => {
  return useQuery({
    queryKey: ['admin', 'specialists', id],
    queryFn: () => specialistsApi.getCoach(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};

// Hook for creating a specialist
export const useCreateCoach = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: specialistsApi.createCoach,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'specialists'] });
      queryClient.invalidateQueries({ queryKey: ['specialists'] }); // Also invalidate public specialists
      toast.success('Spécialiste créé avec succès');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.error || 'Erreur lors de la création';
      toast.error('Erreur', { description: errorMessage });
    },
  });
};

// Hook for updating a specialist
export const useUpdateCoach = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, specialistData }: { id: string; specialistData: any }) =>
      specialistsApi.updateCoach(id, specialistData),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'specialists'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'specialists', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['specialists'] }); // Also invalidate public specialists
      toast.success('Spécialiste modifié avec succès');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.error || 'Erreur lors de la modification';
      toast.error('Erreur', { description: errorMessage });
    },
  });
};

// Hook for deleting a specialist
export const useDeleteCoach = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: specialistsApi.deleteCoach,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'specialists'] });
      queryClient.invalidateQueries({ queryKey: ['specialists'] }); // Also invalidate public specialists
      toast.success('Spécialiste supprimé avec succès');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.error || 'Erreur lors de la suppression';
      toast.error('Erreur', { description: errorMessage });
    },
  });
};