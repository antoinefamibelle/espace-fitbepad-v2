import { NextRequest, NextResponse } from 'next/server';

import { validateCoupon } from '@coaching/booking-logic';

import { getAuthenticatedPayloadUser } from '@frontend/lib/server/auth-identity';
import { getPayloadClient } from '@frontend/lib/server/payload';

interface CouponValidationBody {
  code: string;
  serviceId: string;
  originalAmountCents: number;
}

function toCouponResponse(coupon: any) {
  return {
    id: coupon.id,
    code: coupon.code,
    description: coupon.description || '',
    discountType: coupon.discountType === 'fixed' ? 'fixed_amount' : 'percentage',
    discountValue: coupon.discountValue,
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CouponValidationBody;
    if (!body.code || !body.serviceId || !Number.isFinite(body.originalAmountCents)) {
      return NextResponse.json(
        { success: true, isValid: false, discountAmountCents: 0, error: 'Invalid request body' },
        { status: 400 },
      );
    }

    const normalizedCode = body.code.trim().toUpperCase();
    const payload = await getPayloadClient();
    const coupons = await payload.find({
      collection: 'coupons',
      limit: 1,
      depth: 1,
      overrideAccess: true,
      where: { code: { equals: normalizedCode } },
    });
    const coupon = coupons.docs[0];

    if (!coupon) {
      return NextResponse.json({ success: true, isValid: false, discountAmountCents: 0, error: 'Coupon not found' });
    }

    const applicableServices = Array.isArray((coupon as any).applicableServices) ? (coupon as any).applicableServices : [];
    const hasServiceRestriction = applicableServices.length > 0;
    const serviceAllowed = !hasServiceRestriction || applicableServices.some((item: any) => {
      const id = typeof item === 'string' ? item : item?.id;
      return id === body.serviceId;
    });

    if (!serviceAllowed) {
      return NextResponse.json({
        success: true,
        isValid: false,
        discountAmountCents: 0,
        error: 'Coupon is not valid for this service',
      });
    }

    let currentUsesByUser = 0;
    const payloadUser = await getAuthenticatedPayloadUser(request);
    if (payloadUser && payloadUser.collection === 'users') {
      const usages = await payload.find({
        collection: 'coupon-usages',
        limit: 0,
        overrideAccess: true,
        where: {
          coupon: { equals: coupon.id },
          user: { equals: payloadUser.id },
        },
      });
      currentUsesByUser = usages.totalDocs || 0;
    }

    const validation = validateCoupon({
      discountType: (coupon as any).discountType,
      discountValue: (coupon as any).discountValue,
      minPurchaseCents: (coupon as any).minOrderCents,
      validFrom: (coupon as any).startsAt ? new Date((coupon as any).startsAt) : null,
      validUntil: (coupon as any).expiresAt ? new Date((coupon as any).expiresAt) : null,
      maxUses: (coupon as any).maxRedemptions,
      currentUses: (coupon as any).redemptionCount || 0,
      maxUsesPerUser: (coupon as any).maxRedemptionsPerUser,
      currentUsesByUser,
      active: Boolean((coupon as any).isActive),
      purchaseAmountCents: body.originalAmountCents,
    });

    if (!validation.valid) {
      return NextResponse.json({
        success: true,
        isValid: false,
        discountAmountCents: 0,
        error: validation.reason,
      });
    }

    return NextResponse.json({
      success: true,
      isValid: true,
      discountAmountCents: validation.discountAmountCents,
      coupon: toCouponResponse(coupon),
    });
  } catch (error) {
    console.error('Failed to validate coupon', error);
    return NextResponse.json(
      { success: true, isValid: false, discountAmountCents: 0, error: 'Validation failed' },
      { status: 500 },
    );
  }
}
