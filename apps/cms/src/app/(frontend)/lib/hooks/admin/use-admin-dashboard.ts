import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '@frontend/lib/services/admin-api';

export const useAdminDashboard = () => {
  return useQuery({
    queryKey: ['admin', 'dashboard'],
    queryFn: dashboardApi.getStats,
    refetchInterval: 30000, // Refetch every 30 seconds
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};