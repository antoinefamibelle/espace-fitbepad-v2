import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@frontend/lib/auth/client';
import { internalApi } from '@frontend/lib/api';
import { toast } from 'sonner';
import type {
    BookingResponseWithDetails,
    UserBookingQuery,
    BookingResponse
} from 'shared';

interface BookingCancelledResponse {
  booking: BookingResponseWithDetails;
  message: string;
  success: true;
}

interface UserBookingsResponse {
  success: true;
  bookings: BookingResponseWithDetails[];
}

/**
 * Hook for fetching user's bookings with optional filtering
 */
export function useUserBookings(params: Omit<UserBookingQuery, 'centerId'> = { limit: 10, offset: 0 }) {
  const { isSignedIn } = useAuth();

  return useQuery<BookingResponseWithDetails[]>({
    queryKey: ['userBookings', params],
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      if (params.status) queryParams.append('status', params.status);
      if (params.dateFrom) queryParams.append('dateFrom', params.dateFrom);
      if (params.dateTo) queryParams.append('dateTo', params.dateTo);
      if (params.offset) queryParams.append('offset', params.offset.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());

      const url = queryParams.toString() ? `/api/bookings/me?${queryParams.toString()}` : '/api/bookings/me';
      const response = await internalApi.get<UserBookingsResponse>(url);

      return response.data.bookings;
    },
    enabled: isSignedIn, // Only run query when user is signed in
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Hook for fetching a single user booking
 */
export function useUserBooking(bookingId: string) {
  const { isSignedIn } = useAuth();

  return useQuery<BookingResponseWithDetails | undefined>({
    queryKey: ['userBooking', bookingId],
    queryFn: async () => {
      if (!bookingId) return undefined;
      const response = await internalApi.get<BookingResponse>(`/api/bookings/${bookingId}`);

      return response.data.booking;
    },
    enabled: !!bookingId && isSignedIn,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook for cancelling a booking
 */
export function useCancelBooking() {
  const queryClient = useQueryClient();

  return useMutation<BookingCancelledResponse, Error, string>({
    mutationFn: async (bookingId: string) => {
      const response = await internalApi.post<BookingCancelledResponse>(
        `/api/bookings/${bookingId}/cancel`,
        {},
      );

      return response.data;
    },
    onSuccess: (data, bookingId) => {
      toast.success('Réservation annulée avec succès');
      queryClient.invalidateQueries({ queryKey: ['userBookings'] });
      queryClient.invalidateQueries({ queryKey: ['userBooking', bookingId] });
    },
    onError: (error) => {
      toast.error('Erreur lors de l\'annulation de la réservation');
      console.error('Error cancelling booking:', error);
    },
  });
}

/**
 * Hook for upcoming bookings (next 7 days)
 */
export function useUpcomingBookings() {
  const { isSignedIn } = useAuth();
  const today = new Date().toISOString().split('T')[0];
  const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  return useUserBookings({
    status: 'confirmed',
    dateFrom: today,
    dateTo: nextWeek,
    limit: 10,
    offset: 0
  });
}

/**
 * Hook for booking history (past bookings)
 */
export function useBookingHistory(limit = 10) {
  const { isSignedIn } = useAuth();
  const today = new Date().toISOString().split('T')[0];

  return useUserBookings({
    dateTo: today,
    limit: limit,
    offset: 0
  });
}
