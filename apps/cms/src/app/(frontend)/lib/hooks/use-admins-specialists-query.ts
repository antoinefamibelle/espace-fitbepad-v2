import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Coach } from 'shared'; // Assuming types are in @/types

const SPECIALISTS_API_URL = '/api/admin/specialists';

// Fetch all specialists
const fetchCoachs = async (): Promise<Coach[]> => {
  const { data } = await axios.get(SPECIALISTS_API_URL);
  return data;
};

export const useGetCoachs = () => {
  return useQuery<Coach[], Error>({
    queryKey: ['specialists'],
    queryFn: fetchCoachs,
  });
};

// Create a new specialist
const createCoach = async (
  newCoach: Omit<Coach, 'id'>,
): Promise<Coach> => {
  const { data } = await axios.post(SPECIALISTS_API_URL, newCoach);
  return data;
};

export const useCreateCoach = () => {
  const queryClient = useQueryClient();
  return useMutation<Coach, Error, Omit<Coach, 'id'>>({
    mutationFn: createCoach,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['specialists'] });
    },
  });
};

// Update an existing specialist
const updateCoach = async (
  updatedCoach: Coach,
): Promise<Coach> => {
  const { data } = await axios.patch(
    `${SPECIALISTS_API_URL}/${updatedCoach.id}`,
    updatedCoach,
  );
  return data;
};

export const useUpdateCoach = () => {
  const queryClient = useQueryClient();
  return useMutation<Coach, Error, Coach>({
    mutationFn: updateCoach,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['specialists'] });
      queryClient.invalidateQueries({ queryKey: ['specialist', data.id] }); // If you have a query for a single specialist
    },
  });
};

// Delete a specialist
const deleteCoach = async (specialistId: string): Promise<void> => {
  await axios.delete(`${SPECIALISTS_API_URL}/${specialistId}`);
};

export const useDeleteCoach = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: deleteCoach,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['specialists'] });
    },
  });
};

// Fetch a single specialist (optional, if needed)
const fetchCoachById = async (id: string): Promise<Coach> => {
  const { data } = await axios.get(`${SPECIALISTS_API_URL}/${id}`);
  return data;
};

export const useGetCoachById = (id: string) => {
  return useQuery<Coach, Error>({
    queryKey: ['specialist', id],
    queryFn: () => fetchCoachById(id),
    enabled: !!id, // Only run query if id is available
  });
};
