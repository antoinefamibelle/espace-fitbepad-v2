import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@frontend/lib/auth/client';
import {
  BookingResponseWithDetails,
  AdminBookingQueryParams,
  AdminBookingUpdateRequest
} from 'shared';
import { api } from '@frontend/lib/api';
import { toast } from 'sonner';

// Response interfaces (temporary until added to shared package)
interface PaginatedAdminBookingsResponse {
  bookingsWithDetails: BookingResponseWithDetails[];
  totalCount: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface AdminBookingResponse {
  booking: BookingResponseWithDetails;
  success: true;
}

interface AdminBookingUpdatedResponse {
  booking: BookingResponseWithDetails;
  success: true;
}

interface AdminBookingCancelledResponse {
  booking: BookingResponseWithDetails;
  message: string;
  success: true;
}

interface UseAdminBookingsParams {
  search?: string;
  status?: 'pending_payment' | 'confirmed' | 'cancelled';
  centerId?: string;
  treatmentId?: string;
  dateFrom?: string; // YYYY-MM-DD
  dateTo?: string; // YYYY-MM-DD
  pageIndex?: number;
  pageSize?: number;
}

/**
 * Hook for fetching paginated admin bookings with server-side filtering
 */
export function useAdminBookings(params: UseAdminBookingsParams = {}) {
  const { getToken } = useAuth();
  const { 
    search, 
    status, 
    centerId, 
    treatmentId, 
    dateFrom, 
    dateTo, 
    pageIndex = 0, 
    pageSize = 10 
  } = params;

  return useQuery<PaginatedAdminBookingsResponse>({
    queryKey: ['adminBookings', search, status, centerId, treatmentId, dateFrom, dateTo, pageIndex, pageSize],
    queryFn: async () => {
      const token = await getToken();
      if (!token) {
        throw new Error('Authentication token not available');
      }

      const queryParams: Record<string, any> = {
        page: pageIndex + 1,
        limit: pageSize,
      };
      
      if (search) queryParams.search = search;
      if (status) queryParams.status = status;
      if (centerId && centerId.length > 0) queryParams.centerId = centerId;
      if (treatmentId && treatmentId.length > 0) queryParams.treatmentId = treatmentId;
      if (dateFrom) queryParams.dateFrom = dateFrom;
      if (dateTo) queryParams.dateTo = dateTo;

      const response = await api.get<PaginatedAdminBookingsResponse>('/admin/bookings', {
        params: queryParams,
        headers: { Authorization: `Bearer ${token}` },
      });
      
      return response.data;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes (bookings change frequently)
    placeholderData: (previousData: PaginatedAdminBookingsResponse | undefined) => previousData,
  });
}

/**
 * Hook for fetching a single booking by ID
 */
export function useAdminBooking(id: string) {
  const { getToken } = useAuth();

  return useQuery<AdminBookingResponse>({
    queryKey: ['adminBooking', id],
    queryFn: async () => {
      const token = await getToken();
      if (!token) {
        throw new Error('Authentication token not available');
      }

      const response = await api.get<AdminBookingResponse>(`/admin/bookings/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      return response.data;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook for updating a booking
 */
export function useUpdateAdminBooking() {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation<AdminBookingUpdatedResponse, Error, { id: string } & AdminBookingUpdateRequest>({
    mutationFn: async ({ id, ...data }) => {
      const token = await getToken();
      if (!token) {
        throw new Error('Authentication token not available');
      }

      const response = await api.put<AdminBookingUpdatedResponse>(`/admin/bookings/${id}`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      return response.data;
    },
    onSuccess: (_, variables) => {
      toast.success('Réservation mise à jour avec succès');
      queryClient.invalidateQueries({ queryKey: ['adminBookings'] });
      queryClient.invalidateQueries({ queryKey: ['adminBooking', variables.id] });
    },
    onError: (error) => {
      toast.error('Erreur lors de la mise à jour de la réservation');
      console.error('Error updating booking:', error);
    },
  });
}

/**
 * Hook for cancelling a booking
 */
export function useCancelAdminBooking() {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation<AdminBookingCancelledResponse, Error, string>({
    mutationFn: async (id: string) => {
      const token = await getToken();
      if (!token) {
        throw new Error('Authentication token not available');
      }

      const response = await api.post<AdminBookingCancelledResponse>(`/admin/bookings/${id}/cancel`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      return response.data;
    },
    onSuccess: (_, id) => {
      toast.success('Réservation annulée avec succès');
      queryClient.invalidateQueries({ queryKey: ['adminBookings'] });
      queryClient.invalidateQueries({ queryKey: ['adminBooking', id] });
    },
    onError: (error) => {
      toast.error('Erreur lors de l\'annulation de la réservation');
      console.error('Error cancelling booking:', error);
    },
  });
}

/**
 * Hook for syncing payment status of a booking
 */
export function useSyncBookingPayment() {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation<{ success: boolean; message: string; booking: BookingResponseWithDetails }, Error, string>({
    mutationFn: async (id: string) => {
      const token = await getToken();
      if (!token) {
        throw new Error('Authentication token not available');
      }

      const response = await api.post(`/admin/bookings/${id}/sync-payment`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      return response.data;
    },
    onSuccess: (data, id) => {
      toast.success(data.message || 'Statut de paiement synchronisé avec succès');
      queryClient.invalidateQueries({ queryKey: ['adminBookings'] });
      queryClient.invalidateQueries({ queryKey: ['adminBooking', id] });
    },
    onError: (error) => {
      toast.error('Erreur lors de la synchronisation du paiement');
      console.error('Error syncing payment:', error);
    },
  });
}

/**
 * Hook for syncing all payment statuses
 */
export function useSyncAllBookingPayments() {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation<{ success: boolean; message: string; updatedCount: number }, Error, void>({
    mutationFn: async () => {
      const token = await getToken();
      if (!token) {
        throw new Error('Authentication token not available');
      }

      const response = await api.post('/admin/bookings/sync-all-payments', {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || 'Tous les paiements ont été synchronisés');
      queryClient.invalidateQueries({ queryKey: ['adminBookings'] });
    },
    onError: (error) => {
      toast.error('Erreur lors de la synchronisation des paiements');
      console.error('Error syncing all payments:', error);
    },
  });
}

/**
 * Hook for bookings statistics (all bookings for calculations)
 */
export function useAdminBookingsStats() {
  const { getToken } = useAuth();

  return useQuery<PaginatedAdminBookingsResponse>({
    queryKey: ['adminBookingsStats'],
    queryFn: async () => {
      const token = await getToken();
      if (!token) {
        throw new Error('Authentication token not available');
      }

      const response = await api.get<PaginatedAdminBookingsResponse>('/admin/bookings', {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}