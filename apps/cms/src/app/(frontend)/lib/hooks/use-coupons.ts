import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@frontend/lib/api';
import { CouponCreateRequest, Coupon } from 'shared';

// Types for the API responses
interface Center {
  id: string;
  name: string;
  slug: string;
}

interface Treatment {
  id: string;
  name: string;
  centerId: string;
}

// Query keys
export const couponKeys = {
  all: ['coupons'] as const,
  lists: () => [...couponKeys.all, 'list'] as const,
  list: (filters: any) => [...couponKeys.lists(), filters] as const,
  details: () => [...couponKeys.all, 'detail'] as const,
  detail: (id: string) => [...couponKeys.details(), id] as const,
};

export const centerKeys = {
  all: ['centers'] as const,
  lists: () => [...centerKeys.all, 'list'] as const,
  list: () => [...centerKeys.lists()] as const,
};

export const treatmentKeys = {
  all: ['treatments'] as const,
  lists: () => [...treatmentKeys.all, 'list'] as const,
  list: () => [...treatmentKeys.lists()] as const,
};

// API functions
const fetchCenters = async (): Promise<Center[]> => {
  const response = await api.get('/admin/centers');
  return response.data;
};

const fetchTreatments = async (): Promise<Treatment[]> => {
  const response = await api.get('/admin/treatments');
  return response.data.treatments || response.data;
};

const createCoupon = async (data: CouponCreateRequest): Promise<Coupon> => {
  const response = await api.post('/admin/coupons', data);
  return response.data.coupon;
};

// Hooks
export const useCenters = () => {
  return useQuery<Center[], Error>({
    queryKey: centerKeys.list(),
    queryFn: fetchCenters,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useTreatments = () => {
  return useQuery<Treatment[], Error>({
    queryKey: treatmentKeys.list(),
    queryFn: fetchTreatments,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCreateCoupon = () => {
  const queryClient = useQueryClient();

  return useMutation<Coupon, Error, CouponCreateRequest>({
    mutationFn: createCoupon,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: couponKeys.lists() });
    },
  });
};
