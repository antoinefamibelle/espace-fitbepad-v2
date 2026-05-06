import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '@frontend/lib/services/admin-api';
import { toast } from 'sonner';

interface UseAdminUsersParams {
  search?: string;
  role?: string;
  page?: number;
  limit?: number;
}

// Hook for listing users
export const useAdminUsers = (params: UseAdminUsersParams) => {
  return useQuery({
    queryKey: ['admin', 'users', params],
    queryFn: () => usersApi.getUsers(params),
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Hook for getting a single user
export const useAdminUser = (id: string) => {
  return useQuery({
    queryKey: ['admin', 'users', id],
    queryFn: () => usersApi.getUser(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Hook for creating a user
export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: usersApi.createUser,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      toast.success('Utilisateur créé avec succès');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.error || 'Erreur lors de la création';
      toast.error('Erreur', { description: errorMessage });
    },
  });
};

// Hook for updating a user
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, userData }: { id: string; userData: any }) =>
      usersApi.updateUser(id, userData),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'users', variables.id] });
      toast.success('Utilisateur modifié avec succès');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.error || 'Erreur lors de la modification';
      toast.error('Erreur', { description: errorMessage });
    },
  });
};

// Hook for deleting a user
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: usersApi.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      toast.success('Utilisateur supprimé avec succès');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.error || 'Erreur lors de la suppression';
      toast.error('Erreur', { description: errorMessage });
    },
  });
};