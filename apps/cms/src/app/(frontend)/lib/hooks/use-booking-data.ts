import { useQuery, useMutation } from '@tanstack/react-query';
import { useAuth } from '@frontend/lib/auth/client';
import { internalApi } from '@frontend/lib/api';
import type {
  Coach,
  GetAvailabilityResponse,
  DayAvailability,
  PaginatedCoachesResponse,
} from 'shared/types';
import {
  Service,
  CreateBookingRequest,
  BookingResponse
} from 'shared';

interface BridgeCreateBookingRequest extends CreateBookingRequest {
  date: string;
  coachId: string;
  startTimeIso?: string;
}

interface CreateBookingApiResponse {
  success: true;
  booking: BookingResponse;
}

type LegacyServiceShape = Service & {
  image?: string | { url?: string | null } | null;
  picture?: string | null;
};

function normalizeService(service: LegacyServiceShape): Service {
  const existingPicture =
    typeof service.picture === 'string' && service.picture.trim().length > 0 ? service.picture : undefined;

  if (existingPicture) {
    return { ...service, picture: existingPicture };
  }

  const legacyPicture =
    typeof service.image === 'string'
      ? service.image
      : service.image && typeof service.image === 'object'
        ? service.image.url || undefined
        : undefined;

  return {
    ...service,
    picture: legacyPicture,
  };
}


// Hook to get all services for booking (replaces treatments from specific center)
export function useBookingServices() {
  return useQuery<Service[]>({
    queryKey: ['booking-services'],
    queryFn: async () => {
      // Since we're now single-center, we can get services directly
      const response = await internalApi.get<{ services: LegacyServiceShape[]; success: true }>('/api/services');
      return (response.data.services || []).map(normalizeService);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook to get a specific service
export function useBookingService(serviceId: string) {
  return useQuery<Service | undefined>({
    queryKey: ['booking-service', serviceId],
    queryFn: async () => {
      if (!serviceId) return undefined;
      const response = await internalApi.get<{ service: LegacyServiceShape; success: true }>(`/api/services/${serviceId}`);
      return normalizeService(response.data.service);
    },
    enabled: !!serviceId,
    staleTime: 5 * 60 * 1000,
  });
}

// Hook to get coaches for booking (replaces specialists)
export function useBookingCoaches() {
  return useQuery<Coach[]>({
    queryKey: ['booking-coaches'],
    queryFn: async () => {
      const response = await internalApi.get<PaginatedCoachesResponse>('/api/coaches');
      return response.data.coaches || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook to get a specific coach
export function useBookingCoach(coachId: string) {
  return useQuery<Coach | undefined>({
    queryKey: ['booking-coach', coachId],
    queryFn: async () => {
      if (!coachId) return undefined;
      const response = await internalApi.get<{ coach: Coach; success: true }>(`/api/coaches/${coachId}`);
      return response.data.coach;
    },
    enabled: !!coachId,
    staleTime: 5 * 60 * 1000,
  });
}

// Hook to get availability for booking (updated for single-center model)
interface UseBookingAvailabilityParams {
  serviceId: string;
  coachId?: string; // Optional coach selection
  startDate: string; // YYYY-MM-DD format
  days?: number; // Number of days to fetch (default: 15)
}

export function useBookingAvailability(params: UseBookingAvailabilityParams) {
  const { serviceId, coachId, startDate, days = 15 } = params;

  return useQuery<DayAvailability[]>({
    queryKey: ['booking-availability', serviceId, coachId, startDate, days],
    queryFn: async () => {
      if (!serviceId || !startDate) {
        throw new Error('Service ID and start date are required');
      }

      const queryParams: Record<string, any> = {
        serviceId,
        startDate,
        days,
      };

      if (coachId) {
        queryParams.coachId = coachId;
      }

      const response = await internalApi.get<GetAvailabilityResponse>('/api/availability', {
        params: queryParams,
      });
      return response.data.availability;
    },
    enabled: !!serviceId && !!startDate,
    staleTime: 5 * 60 * 1000, // Consider data stale after 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
    refetchOnWindowFocus: false, // Don't refetch on window focus
    refetchInterval: false, // Don't auto-refetch
  });
}



// Hook to create a booking (updated for single-center)
export function useCreateBooking() {
  const { getToken } = useAuth();

  return useMutation<BookingResponse, Error, BridgeCreateBookingRequest>({
    mutationFn: async (bookingData) => {
      const token = await getToken();
      const response = await internalApi.post<CreateBookingApiResponse>('/api/bookings', bookingData, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      return response.data.booking;
    },
    onError: (error) => {
      console.error('Booking creation failed:', error);
    },
  });
}

// Hook to validate coupon
interface CouponValidationRequest {
  code: string;
  serviceId: string;
  originalAmountCents: number;
}

interface CouponValidationResponse {
  isValid: boolean;
  discountAmountCents: number;
  coupon?: {
    id: string;
    code: string;
    description?: string;
    discountType: 'percentage' | 'fixed_amount';
    discountValue: number;
  };
  error?: string;
  success: true;
}

export function useValidateCoupon() {
  return useMutation<CouponValidationResponse, Error, CouponValidationRequest>({
    mutationFn: async (couponData) => {
      const response = await internalApi.post<CouponValidationResponse>('/api/coupons/validate', couponData);
      return response.data;
    },
    onError: (error) => {
      console.error('Coupon validation failed:', error);
    },
  });
}