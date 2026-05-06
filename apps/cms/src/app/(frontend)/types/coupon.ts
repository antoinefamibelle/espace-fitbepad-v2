export interface Coupon {
  id: string;
  code: string;
  description?: string;
  discountType: 'percentage' | 'fixed_amount';
  discountValue: number;
  minAmount?: number;
  maxDiscountAmount?: number;
  maxUses?: number;
  currentUses: number;
  maxUsesPerUser: number;
  validFrom: Date;
  validUntil?: Date;
  treatmentIds?: string[];
  isActive: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CouponFormData {
  code: string;
  description?: string;
  discountType: 'percentage' | 'fixed_amount';
  discountValue: number;
  minAmount?: number;
  maxDiscountAmount?: number;
  maxUses?: number;
  maxUsesPerUser: number;
  validFrom: Date;
  validUntil?: Date;
  treatmentIds?: string[];
  isActive: boolean;
}

export interface CouponListResponse {
  coupons: Coupon[];
}

export interface CouponStatsResponse {
  totalCoupons: number;
  activeCoupons: number;
  totalUsage: number;
  totalDiscountGiven: number;
}

export interface CouponFilters {
  isActive: boolean | undefined;
  validOnly: boolean;
}