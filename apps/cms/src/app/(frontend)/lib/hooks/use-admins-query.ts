import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { User } from 'shared'; // Assuming types are in @/types

const ADMINS_API_URL = '/api/admin/admins';

// Fetch all admins
const fetchAdmins = async (): Promise<User[]> => {
  const { data } = await axios.get(ADMINS_API_URL);
  return data;
};

export const useGetAdmins = () => {
  return useQuery<User[], Error>({
    queryKey: ['admins'],
    queryFn: fetchAdmins,
  });
};

// Create a new admin
const createAdmin = async (newAdmin: Omit<User, 'id'>): Promise<User> => {
  const { data } = await axios.post(ADMINS_API_URL, newAdmin);
  return data;
};

export const useCreateAdmin = () => {
  const queryClient = useQueryClient();
  return useMutation<User, Error, Omit<User, 'id'>>({
    mutationFn: createAdmin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admins'] });
    },
  });
};

// Update an existing admin
const updateAdmin = async (updatedAdmin: User): Promise<User> => {
  const { data } = await axios.put(`${ADMINS_API_URL}/${updatedAdmin.id}`, updatedAdmin);
  return data;
};

export const useUpdateAdmin = () => {
  const queryClient = useQueryClient();
  return useMutation<User, Error, User>({
    mutationFn: updateAdmin,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['admins'] });
      queryClient.invalidateQueries({ queryKey: ['admin', data.id] }); // If you have a query for a single admin
    },
  });
};

// Delete an admin
const deleteAdmin = async (adminId: string): Promise<void> => {
  await axios.delete(`${ADMINS_API_URL}/${adminId}`);
};

export const useDeleteAdmin = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: deleteAdmin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admins'] });
    },
  });
};

// Fetch a single admin (optional, if needed)
const fetchAdminById = async (id: string): Promise<User> => {
  const { data } = await axios.get(`${ADMINS_API_URL}/${id}`);
  return data;
};

export const useGetAdminById = (id: string) => {
  return useQuery<User, Error>({
    queryKey: ['admin', id],
    queryFn: () => fetchAdminById(id),
    enabled: !!id, // Only run query if id is available
  });
};
