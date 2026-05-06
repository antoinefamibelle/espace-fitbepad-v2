import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useTreatments, useCreateCoupon } from './use-coupons';
import { couponCreateSchema, CouponCreateRequest } from 'shared';
import { toast } from 'sonner';
import { z } from 'zod';

export const useCouponForm = () => {
  const router = useRouter();

  // Fetch data
  const {
    data: treatments = [],
    isLoading: treatmentsLoading,
    error: treatmentsError,
  } = useTreatments();

  // Create coupon mutation
  const createCouponMutation = useCreateCoupon();

  // Form setup
  const form = useForm({
    resolver: zodResolver(z.object({
      code: z.string(),
      description: z.string(),
      discountType: z.enum(['percentage', 'fixed_amount']),
      discountValue: z.number(),
      minAmount: z.number().optional(),
      maxDiscountAmount: z.number().optional(),
      maxUses: z.number().optional(),
      maxUsesPerUser: z.number(),
      validFrom: z.date().optional(),
      validUntil: z.date().optional(),
      treatmentIds: z.array(z.string()).optional(),
      isActive: z.boolean(),
    })),
    defaultValues: {
      code: '',
      description: '',
      discountType: 'percentage' as const,
      discountValue: 0,
      minAmount: undefined,
      maxDiscountAmount: undefined,
      maxUses: undefined,
      maxUsesPerUser: 1,
      validFrom: new Date(),
      validUntil: undefined,
      treatmentIds: [],
      isActive: true,
    },
  });

  const watchedDiscountType = form.watch('discountType');

  // Use all treatments since center filtering is removed
  const filteredTreatments = treatments;

  // Handle form submission
  const onSubmit = async (data: CouponCreateRequest) => {
    try {
      const submitData = {
        ...data,
        maxRedemptionsPerUser: data.maxRedemptionsPerUser ?? 1,
      };
      await createCouponMutation.mutateAsync(submitData);
      toast.success('Coupon créé avec succès');
      router.push('/admin/coupons');
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error || 'Erreur lors de la création du coupon';
      toast.error(errorMessage);
    }
  };

  // Handle treatment selection
  const handleTreatmentSelect = (treatmentId: string) => {
    const currentIds = form.watch('treatmentIds') || [];
    if (!currentIds.includes(treatmentId)) {
      form.setValue('treatmentIds', [...currentIds, treatmentId]);
    }
  };

  // Handle treatment removal
  const handleTreatmentRemove = (treatmentId: string) => {
    const currentIds = form.watch('treatmentIds') || [];
    form.setValue(
      'treatmentIds',
      currentIds.filter((id: string) => id !== treatmentId),
    );
  };

  return {
    form,
    treatments: filteredTreatments,
    allTreatments: treatments,
    treatmentsLoading,
    treatmentsError,
    watchedDiscountType,
    isLoading: createCouponMutation.isPending,
    onSubmit: form.handleSubmit(onSubmit),
    handleTreatmentSelect,
    handleTreatmentRemove,
  };
};
