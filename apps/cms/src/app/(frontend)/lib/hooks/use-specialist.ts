import { useQuery } from '@tanstack/react-query';
import { api } from '../api';

const SPECIALISTS_API_URL = '/specialists/list';

export const useCoachs = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['specialists'],
    queryFn: () => api.get(SPECIALISTS_API_URL),
  });

  return { data, isLoading, error };
};
