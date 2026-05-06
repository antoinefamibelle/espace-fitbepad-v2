import type { CollectionAfterChangeHook } from 'payload'

export const incrementCouponUsage: CollectionAfterChangeHook = async ({
  doc,
  req,
  previousDoc,
}) => {
  if (!doc.coupon) return doc

  const nowCountsAsRedeemed =
    doc.status === 'confirmed' || doc.paymentStatus === 'paid'
  const previousCountedAsRedeemed =
    previousDoc?.status === 'confirmed' || previousDoc?.paymentStatus === 'paid'
  if (!nowCountsAsRedeemed || previousCountedAsRedeemed) return doc

  const bookingId = doc.id
  const existingUsage = await req.payload.find({
    collection: 'coupon-usages',
    where: {
      booking: {
        equals: bookingId,
      },
    },
    limit: 1,
  })
  if (existingUsage.totalDocs > 0) return doc

  const couponId = typeof doc.coupon === 'object' ? doc.coupon.id : doc.coupon
  const coupon = await req.payload.findByID({ collection: 'coupons', id: couponId })

  await req.payload.update({
    collection: 'coupons',
    id: couponId,
    data: { redemptionCount: (coupon.redemptionCount ?? 0) + 1 },
  })

  await req.payload.create({
    collection: 'coupon-usages',
    data: {
      coupon: couponId,
      user: typeof doc.user === 'object' ? doc.user.id : doc.user,
      booking: doc.id,
      discountAppliedCents: doc.discountCents ?? 0,
    },
  })

  return doc
}
