import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bookingsApi } from '@frontend/lib/services/admin-api';
import { toast } from 'sonner';

interface UseAdminBookingsParams {
  centerId?: string;
  search?: string;
  date?: string;
  page?: number;
  limit?: number;
}

// Hook for listing bookings
export const useAdminBookings = (params: UseAdminBookingsParams) => {
  return useQuery({
    queryKey: ['admin', 'bookings', params],
    queryFn: () => bookingsApi.getBookings(params),
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

// Hook for getting a single booking
export const useAdminBooking = (id: string) => {
  return useQuery({
    queryKey: ['admin', 'bookings', id],
    queryFn: () => bookingsApi.getBooking(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

// Hook for updating a booking
export const useUpdateBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, bookingData }: { id: string; bookingData: any }) =>
      bookingsApi.updateBooking(id, bookingData),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'bookings'] });
      queryClient.invalidateQueries({
        queryKey: ['admin', 'bookings', variables.id],
      });
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] });
      toast.success('Réservation modifiée avec succès');
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.error || 'Erreur lors de la modification';
      toast.error('Erreur', { description: errorMessage });
    },
  });
};

// Hook for canceling a booking
export const useCancelBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bookingsApi.cancelBooking,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'bookings'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] });
      toast.success('Réservation annulée', { description: data.message });
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.error || "Erreur lors de l'annulation";
      toast.error('Erreur', { description: errorMessage });
    },
  });
};

// Hook for syncing payments
export const useSyncPayments = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bookingsApi.syncPayments,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'bookings'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] });
      toast.success('Synchronisation réussie', { description: data.message });
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.error || 'Erreur lors de la synchronisation';
      toast.error('Erreur de synchronisation', { description: errorMessage });
    },
  });
};
