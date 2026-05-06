import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@frontend/lib/api';
import { AdminRole, ResourcePermission } from '@frontend/types/permissions';
import { toast } from 'sonner';

export interface CreateRoleData {
  name: string;
  description?: string;
  permissions: ResourcePermission[];
}

export interface UpdateRoleData {
  id: string;
  name?: string;
  description?: string;
  permissions?: ResourcePermission[];
}

export interface UserRole {
  id: string;
  roleId: string;
  centerId?: string;
  assignedAt: string;
  roleName: string;
  roleDescription?: string;
  rolePermissions: ResourcePermission[];
  isSystemRole: boolean;
  centerName?: string;
}

export interface AssignUserRoleData {
  userId: string;
  roleId: string;
  centerId?: string;
}

export interface RemoveUserRoleData {
  userId: string;
  roleId: string;
  centerId?: string;
}

// Hook to fetch all admin roles
export function useAdminRoles() {
  return useQuery<AdminRole[]>({
    queryKey: ['adminRoles'],
    queryFn: async () => {
      const response = await api.get('/admin/roles');
      return response.data;
    },
  });
}

// Hook to fetch roles for a specific user
export function useUserRoles(userId: string) {
  return useQuery<UserRole[]>({
    queryKey: ['userRoles', userId],
    queryFn: async () => {
      const response = await api.get(`/admin/user-roles?userId=${userId}`);
      return response.data;
    },
    enabled: !!userId,
  });
}

// Hook to create a new role
export function useCreateRole() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CreateRoleData) => {
      const response = await api.post('/admin/roles', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminRoles'] });
      toast.success('Rôle créé avec succès');
    },
    onError: (error: unknown) => {
      const errorMessage = error instanceof Error && 'response' in error 
        ? (error as { response?: { data?: { error?: string } } }).response?.data?.error 
        : 'Erreur lors de la création du rôle';
      toast.error(errorMessage || 'Erreur lors de la création du rôle');
    },
  });
}

// Hook to update a role
export function useUpdateRole() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: UpdateRoleData) => {
      const response = await api.put('/admin/roles', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminRoles'] });
      toast.success('Rôle mis à jour avec succès');
    },
    onError: (error: unknown) => {
      const errorMessage = error instanceof Error && 'response' in error 
        ? (error as { response?: { data?: { error?: string } } }).response?.data?.error 
        : 'Erreur lors de la mise à jour du rôle';
      toast.error(errorMessage || 'Erreur lors de la mise à jour du rôle');
    },
  });
}

// Hook to delete a role
export function useDeleteRole() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (roleId: string) => {
      const response = await api.delete(`/admin/roles?id=${roleId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminRoles'] });
      toast.success('Rôle supprimé avec succès');
    },
    onError: (error: unknown) => {
      const errorMessage = error instanceof Error && 'response' in error 
        ? (error as { response?: { data?: { error?: string } } }).response?.data?.error 
        : 'Erreur lors de la suppression du rôle';
      toast.error(errorMessage || 'Erreur lors de la suppression du rôle');
    },
  });
}

// Hook to assign a role to a user
export function useAssignUserRole() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: AssignUserRoleData) => {
      const response = await api.post('/admin/user-roles', data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['userRoles', variables.userId] });
      toast.success('Rôle assigné avec succès');
    },
    onError: (error: unknown) => {
      const errorMessage = error instanceof Error && 'response' in error 
        ? (error as { response?: { data?: { error?: string } } }).response?.data?.error 
        : 'Erreur lors de l\'assignation du rôle';
      toast.error(errorMessage || 'Erreur lors de l\'assignation du rôle');
    },
  });
}

// Hook to remove a role from a user
export function useRemoveUserRole() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: RemoveUserRoleData) => {
      const response = await api.delete('/admin/user-roles', { data });
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['userRoles', variables.userId] });
      toast.success('Rôle retiré avec succès');
    },
    onError: (error: unknown) => {
      const errorMessage = error instanceof Error && 'response' in error 
        ? (error as { response?: { data?: { error?: string } } }).response?.data?.error 
        : 'Erreur lors du retrait du rôle';
      toast.error(errorMessage || 'Erreur lors du retrait du rôle');
    },
  });
}

// Hook to initialize default roles
export function useInitializeDefaultRoles() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      const response = await api.post('/admin/roles/initialize');
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['adminRoles'] });
      toast.success(data.message || 'Rôles par défaut initialisés avec succès');
    },
    onError: (error: unknown) => {
      const errorMessage = error instanceof Error && 'response' in error 
        ? (error as { response?: { data?: { error?: string } } }).response?.data?.error 
        : 'Erreur lors de l\'initialisation des rôles';
      toast.error(errorMessage || 'Erreur lors de l\'initialisation des rôles');
    },
  });
}