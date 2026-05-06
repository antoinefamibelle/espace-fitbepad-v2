import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { subscriptionPlansApi } from '@frontend/lib/services/admin-api';
import { toast } from 'sonner';

export interface UseAdminSubscriptionPlansParams {
  search?: string;
  centerId?: string;
  status?: string;
  recurrence?: string;
  page?: number;
  limit?: number;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string | null;
  recurrence: 'weekly' | 'bi_weekly' | 'monthly' | 'semester';
  priceCents: number;
  isActive: boolean;
  centerId: string;
  centerName: string;
  createdAt: string;
  updatedAt: string;
  treatments: Array<{
    treatmentId: string;
    quantity: number;
    treatmentName: string;
    treatmentPriceCents: number;
    treatmentDurationMins: number;
  }>;
}

export interface AdminSubscriptionPlansResponse {
  subscriptionPlans: SubscriptionPlan[];
  totalCount: number;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Fetch subscription plans
export const useAdminSubscriptionPlans = (params: UseAdminSubscriptionPlansParams = {}) => {
  return useQuery({
    queryKey: ['admin', 'subscription-plans', params],
    queryFn: () => subscriptionPlansApi.getSubscriptionPlans(params),
    placeholderData: (previousData) => previousData,
  });
};

// Create subscription plan
export const useCreateSubscriptionPlan = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: subscriptionPlansApi.createSubscriptionPlan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'subscription-plans'] });
      toast.success('Plan d\'abonnement créé avec succès');
    },
    onError: (error: any) => {
      toast.error('Erreur lors de la création du plan d\'abonnement');
    },
  });
};

// Update subscription plan
export const useUpdateSubscriptionPlan = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, planData }: { id: string; planData: any }) => 
      subscriptionPlansApi.updateSubscriptionPlan(id, planData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'subscription-plans'] });
      toast.success('Plan d\'abonnement mis à jour avec succès');
    },
    onError: (error: any) => {
      toast.error('Erreur lors de la mise à jour du plan d\'abonnement');
    },
  });
};

// Delete subscription plan
export const useDeleteSubscriptionPlan = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: subscriptionPlansApi.deleteSubscriptionPlan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'subscription-plans'] });
      toast.success('Plan d\'abonnement supprimé avec succès');
    },
    onError: (error: any) => {
      toast.error('Erreur lors de la suppression du plan d\'abonnement');
    },
  });
};
