import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { treatmentsApi } from '@frontend/lib/services/admin-api';
import { toast } from 'sonner';

interface UseAdminTreatmentsParams {
  search?: string;
  centerId?: string;
  page?: number;
  limit?: number;
}

// Hook for listing treatments
export const useAdminTreatments = (params?: UseAdminTreatmentsParams) => {
  return useQuery({
    queryKey: ['admin', 'treatments', params],
    queryFn: () => treatmentsApi.getTreatments(params),
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};

// Hook for getting a single treatment
export const useAdminTreatment = (id: string) => {
  return useQuery({
    queryKey: ['admin', 'treatments', id],
    queryFn: () => treatmentsApi.getTreatment(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};

// Hook for creating a treatment
export const useCreateTreatment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: treatmentsApi.createTreatment,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'treatments'] });
      queryClient.invalidateQueries({ queryKey: ['treatments'] }); // Also invalidate public treatments
      toast.success('Traitement créé avec succès');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.error || 'Erreur lors de la création';
      toast.error('Erreur', { description: errorMessage });
    },
  });
};

// Hook for updating a treatment
export const useUpdateTreatment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, treatmentData }: { id: string; treatmentData: any }) =>
      treatmentsApi.updateTreatment(id, treatmentData),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'treatments'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'treatments', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['treatments'] }); // Also invalidate public treatments
      toast.success('Traitement modifié avec succès');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.error || 'Erreur lors de la modification';
      toast.error('Erreur', { description: errorMessage });
    },
  });
};

// Hook for deleting a treatment
export const useDeleteTreatment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: treatmentsApi.deleteTreatment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'treatments'] });
      queryClient.invalidateQueries({ queryKey: ['treatments'] }); // Also invalidate public treatments
      toast.success('Traitement supprimé avec succès');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.error || 'Erreur lors de la suppression';
      toast.error('Erreur', { description: errorMessage });
    },
  });
};