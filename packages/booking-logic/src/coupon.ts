import type { DiscountType } from '@coaching/types';

export interface CouponValidationInput {
  discountType: DiscountType;
  discountValue: number;
  minPurchaseCents?: number | null;
  validFrom?: Date | null;
  validUntil?: Date | null;
  maxUses?: number | null;
  currentUses: number;
  maxUsesPerUser?: number | null;
  currentUsesByUser: number;
  active: boolean;
  purchaseAmountCents: number;
}

export type CouponValidationResult =
  | { valid: true; discountAmountCents: number; finalAmountCents: number }
  | { valid: false; reason: string };

export function validateCoupon(input: CouponValidationInput): CouponValidationResult {
  if (!input.active) return { valid: false, reason: 'Coupon is not active' };

  const now = new Date();
  if (input.validFrom && now < input.validFrom)
    return { valid: false, reason: 'Coupon not yet valid' };
  if (input.validUntil && now > input.validUntil)
    return { valid: false, reason: 'Coupon expired' };

  if (input.maxUses != null && input.currentUses >= input.maxUses)
    return { valid: false, reason: 'Coupon usage limit reached' };

  if (input.maxUsesPerUser != null && input.currentUsesByUser >= input.maxUsesPerUser)
    return { valid: false, reason: 'You have already used this coupon the maximum number of times' };

  if (input.minPurchaseCents != null && input.purchaseAmountCents < input.minPurchaseCents)
    return { valid: false, reason: 'Minimum purchase not met' };

  let discount = 0;
  if (input.discountType === 'percentage') {
    discount = Math.floor((input.purchaseAmountCents * input.discountValue) / 100);
  } else {
    discount = input.discountValue;
  }
  discount = Math.min(discount, input.purchaseAmountCents);

  return {
    valid: true,
    discountAmountCents: discount,
    finalAmountCents: input.purchaseAmountCents - discount,
  };
}
