import type { CollectionBeforeChangeHook } from 'payload'

type LocalCouponValidationInput = {
  discountType: 'percentage' | 'fixed'
  discountValue: number
  minPurchaseCents?: number | null
  validFrom?: Date | null
  validUntil?: Date | null
  maxUses?: number | null
  currentUses: number
  maxUsesPerUser?: number | null
  currentUsesByUser: number
  active: boolean
  purchaseAmountCents: number
}

function validateCouponLocally(input: LocalCouponValidationInput) {
  if (!input.active) return { valid: false as const }

  const now = new Date()
  if (input.validFrom && now < input.validFrom) return { valid: false as const }
  if (input.validUntil && now > input.validUntil) return { valid: false as const }

  if (input.maxUses != null && input.currentUses >= input.maxUses) return { valid: false as const }
  if (input.maxUsesPerUser != null && input.currentUsesByUser >= input.maxUsesPerUser) return { valid: false as const }
  if (input.minPurchaseCents != null && input.purchaseAmountCents < input.minPurchaseCents) return { valid: false as const }

  let discount = 0
  if (input.discountType === 'percentage') {
    discount = Math.floor((input.purchaseAmountCents * input.discountValue) / 100)
  } else {
    discount = input.discountValue
  }
  discount = Math.min(discount, input.purchaseAmountCents)

  return {
    valid: true as const,
    discountAmountCents: discount,
  }
}

export const computeBookingTotals: CollectionBeforeChangeHook = async ({ data, req, operation }) => {
  if (operation !== 'create' && !data.startTime && !data.service && !data.coupon) return data

  const serviceId = typeof data.service === 'object' ? data.service?.id : data.service
  if (!serviceId) return data

  const service = await req.payload.findByID({ collection: 'services', id: serviceId })

  if (data.startTime && service?.durationMinutes) {
    const start = new Date(data.startTime)
    const end = new Date(start.getTime() + service.durationMinutes * 60_000)
    data.endTime = end.toISOString()
  }

  if (service?.priceCents != null) {
    data.priceCents = service.priceCents
    data.currency = service.currency
  }

  let discountCents = 0
  if (data.coupon) {
    const couponId = typeof data.coupon === 'object' ? data.coupon.id : data.coupon
    const coupon = await req.payload.findByID({ collection: 'coupons', id: couponId })
    if (coupon) {
      const userId = typeof data.user === 'object' ? data.user?.id : data.user
      let currentUsesByUser = 0
      if (userId) {
        const usages = await req.payload.find({
          collection: 'coupon-usages',
          where: {
            and: [{ coupon: { equals: couponId } }, { user: { equals: userId } }],
          },
          limit: 0,
        })
        currentUsesByUser = usages.totalDocs
      }

      const validation = validateCouponLocally({
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        minPurchaseCents: coupon.minOrderCents,
        validFrom: coupon.startsAt ? new Date(coupon.startsAt) : null,
        validUntil: coupon.expiresAt ? new Date(coupon.expiresAt) : null,
        maxUses: coupon.maxRedemptions,
        currentUses: coupon.redemptionCount ?? 0,
        maxUsesPerUser: coupon.maxRedemptionsPerUser,
        currentUsesByUser,
        active: Boolean(coupon.isActive),
        purchaseAmountCents: data.priceCents ?? 0,
      })

      if (validation.valid) {
        discountCents = validation.discountAmountCents
      } else {
        data.coupon = null
      }
    }
  }

  data.discountCents = discountCents
  data.totalCents = Math.max(0, (data.priceCents ?? 0) - discountCents)

  return data
}
