import { useQuery } from '@tanstack/react-query';
import { api } from '@frontend/lib/api';
import type { GetAvailabilityResponse, DayAvailability } from 'shared/types';

interface UseAvailabilityParams {
  centerId: string;
  treatmentId: string;
  startDate: string; // YYYY-MM-DD format
  days?: number; // Number of days to fetch (default: 15)
}

export function useAvailability(params: UseAvailabilityParams) {
  const { centerId, treatmentId, startDate, days = 15 } = params;
  
  return useQuery<DayAvailability[]>({
    queryKey: ['availability', centerId, treatmentId, startDate, days],
    queryFn: async () => {
      if (!centerId || !treatmentId || !startDate) {
        throw new Error('Center ID, treatment ID, and start date are required');
      }
      
      const response = await api.get<GetAvailabilityResponse>(`/centers/${centerId}/availability`, {
        params: {
          treatmentId,
          startDate,
          days,
        },
      });
      
      return response.data.availability;
    },
    enabled: !!centerId && !!treatmentId && !!startDate,
    staleTime: 5 * 60 * 1000, // Consider data stale after 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
    refetchOnWindowFocus: false, // Don't refetch on window focus
    refetchInterval: false, // Don't auto-refetch
  });
}

// Get availability for a specific date
export function useAvailabilityForDate(params: UseAvailabilityParams & { date: string }) {
  const { date, ...availabilityParams } = params;
  
  const { data: availability, ...queryResult } = useAvailability(availabilityParams);
  
  const dateAvailability = availability?.find(avail => avail.date === date);
  
  return {
    ...queryResult,
    data: dateAvailability,
    availability, // Also return full availability data
  };
}