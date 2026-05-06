import { getPayload } from 'payload'

import config from './payload.config'
import { frenchGymSeed } from './seed-data/frenchGym'

/** Must satisfy `validatePasswordStrength` in `collections/Users.ts` (length, uppercase, digit). */
const seedUserPassword =
  process.env.CMS_SEED_USER_PASSWORD ?? 'FitBePad1'

const run = async () => {
  const payload = await getPayload({ config })

  const stats = {
    coaches: { created: 0, skipped: 0 },
    services: { created: 0, skipped: 0 },
    courses: { created: 0, skipped: 0 },
    spaces: { created: 0, skipped: 0 },
    subscriptions: { created: 0, skipped: 0 },
    users: { created: 0, skipped: 0 },
    coupons: { created: 0, skipped: 0 },
    paymentLinks: { created: 0, skipped: 0 },
    bookings: { created: 0, skipped: 0 },
  }

  const coachIdsBySlug = new Map<string, number>()
  for (const coachData of frenchGymSeed.coaches) {
    const existing = await payload.find({
      collection: 'coaches',
      where: {
        or: [{ slug: { equals: coachData.slug } }, { email: { equals: coachData.email } }],
      },
      limit: 1,
    })

    if (existing.totalDocs > 0) {
      stats.coaches.skipped += 1
      coachIdsBySlug.set(coachData.slug, existing.docs[0].id)
      continue
    }

    const created = await payload.create({
      collection: 'coaches',
      data: { ...coachData, isActive: true },
    })
    stats.coaches.created += 1
    coachIdsBySlug.set(coachData.slug, created.id)
  }

  const serviceIdsBySlug = new Map<string, number>()
  const servicePricingBySlug = new Map<string, { priceCents: number; currency: 'usd' | 'eur' | 'cad' }>()
  for (const serviceData of frenchGymSeed.services) {
    const existing = await payload.find({
      collection: 'services',
      where: {
        slug: {
          equals: serviceData.slug,
        },
      },
      limit: 1,
    })

    if (existing.totalDocs > 0) {
      stats.services.skipped += 1
      const existingService = existing.docs[0]
      serviceIdsBySlug.set(serviceData.slug, existingService.id)
      servicePricingBySlug.set(serviceData.slug, {
        priceCents: existingService.priceCents,
        currency: existingService.currency,
      })
      continue
    }

    const eligibleCoaches = serviceData.eligibleCoachSlugs
      .map((coachSlug) => coachIdsBySlug.get(coachSlug))
      .filter((coachId): coachId is number => typeof coachId === 'number')

    const created = await payload.create({
      collection: 'services',
      data: {
        name: serviceData.name,
        slug: serviceData.slug,
        shortDescription: serviceData.shortDescription,
        priceCents: serviceData.priceCents,
        currency: serviceData.currency,
        durationMinutes: serviceData.durationMinutes,
        bufferBeforeMinutes: serviceData.bufferBeforeMinutes,
        bufferAfterMinutes: serviceData.bufferAfterMinutes,
        maxAdvanceBookingDays: serviceData.maxAdvanceBookingDays,
        minAdvanceBookingHours: serviceData.minAdvanceBookingHours,
        cancellationPolicyHours: serviceData.cancellationPolicyHours,
        sortOrder: serviceData.sortOrder,
        eligibleCoaches,
        isActive: true,
      },
    })
    stats.services.created += 1
    serviceIdsBySlug.set(serviceData.slug, created.id)
    servicePricingBySlug.set(serviceData.slug, {
      priceCents: created.priceCents,
      currency: created.currency,
    })
  }

  for (const courseData of frenchGymSeed.courses) {
    const existing = await payload.find({
      collection: 'courses',
      where: {
        slug: {
          equals: courseData.slug,
        },
      },
      limit: 1,
    })

    if (existing.totalDocs > 0) {
      stats.courses.skipped += 1
      continue
    }

    await payload.create({
      collection: 'courses',
      data: {
        ...courseData,
        isActive: true,
      },
    })
    stats.courses.created += 1
  }

  for (const spaceData of frenchGymSeed.spaces) {
    const existing = await payload.find({
      collection: 'spaces',
      where: {
        slug: {
          equals: spaceData.slug,
        },
      },
      limit: 1,
    })

    if (existing.totalDocs > 0) {
      stats.spaces.skipped += 1
      continue
    }

    await payload.create({
      collection: 'spaces',
      data: {
        ...spaceData,
        isActive: true,
      },
    })
    stats.spaces.created += 1
  }

  for (const subscriptionData of frenchGymSeed.subscriptions) {
    const existing = await payload.find({
      collection: 'subscriptions',
      where: {
        slug: {
          equals: subscriptionData.slug,
        },
      },
      limit: 1,
    })

    if (existing.totalDocs > 0) {
      stats.subscriptions.skipped += 1
      continue
    }

    await payload.create({
      collection: 'subscriptions',
      data: {
        ...subscriptionData,
        isActive: true,
      },
    })
    stats.subscriptions.created += 1
  }

  const userIdsByEmail = new Map<string, number>()
  for (const userData of frenchGymSeed.users) {
    const existing = await payload.find({
      collection: 'users',
      where: {
        email: {
          equals: userData.email,
        },
      },
      limit: 1,
    })

    if (existing.totalDocs > 0) {
      stats.users.skipped += 1
      userIdsByEmail.set(userData.email, existing.docs[0].id)
      continue
    }

    const created = await payload.create({
      collection: 'users',
      data: { ...userData, password: seedUserPassword },
    })
    stats.users.created += 1
    userIdsByEmail.set(userData.email, created.id)
  }

  const couponIdsByCode = new Map<string, number>()
  for (const couponData of frenchGymSeed.coupons) {
    const normalizedCode = couponData.code.toUpperCase()
    const existing = await payload.find({
      collection: 'coupons',
      where: {
        code: {
          equals: normalizedCode,
        },
      },
      limit: 1,
    })

    if (existing.totalDocs > 0) {
      stats.coupons.skipped += 1
      couponIdsByCode.set(normalizedCode, existing.docs[0].id)
      continue
    }

    const applicableServices = couponData.applicableServiceSlugs
      .map((serviceSlug) => serviceIdsBySlug.get(serviceSlug))
      .filter((serviceId): serviceId is number => typeof serviceId === 'number')

    const created = await payload.create({
      collection: 'coupons',
      data: {
        code: normalizedCode,
        description: couponData.description,
        discountType: couponData.discountType,
        discountValue: couponData.discountValue,
        maxRedemptions: couponData.maxRedemptions,
        maxRedemptionsPerUser: couponData.maxRedemptionsPerUser,
        minOrderCents: couponData.minOrderCents,
        startsAt: couponData.startsAt,
        expiresAt: couponData.expiresAt,
        isActive: couponData.isActive,
        applicableServices,
      },
    })
    stats.coupons.created += 1
    couponIdsByCode.set(normalizedCode, created.id)
  }

  for (const paymentLinkData of frenchGymSeed.paymentLinks) {
    const existing = await payload.find({
      collection: 'payment-links',
      where: {
        name: {
          equals: paymentLinkData.name,
        },
      },
      limit: 1,
    })

    if (existing.totalDocs > 0) {
      stats.paymentLinks.skipped += 1
      continue
    }

    await payload.create({
      collection: 'payment-links',
      data: {
        name: paymentLinkData.name,
        description: paymentLinkData.description,
        amountCents: paymentLinkData.amountCents,
        currency: paymentLinkData.currency,
        maxUses: paymentLinkData.maxUses,
        expiresAt: paymentLinkData.expiresAt,
        isActive: paymentLinkData.isActive,
        service: paymentLinkData.serviceSlug ? serviceIdsBySlug.get(paymentLinkData.serviceSlug) : undefined,
        coach: paymentLinkData.coachSlug ? coachIdsBySlug.get(paymentLinkData.coachSlug) : undefined,
      },
    })
    stats.paymentLinks.created += 1
  }

  for (const bookingData of frenchGymSeed.bookings) {
    const userId = userIdsByEmail.get(bookingData.userEmail)
    const coachId = coachIdsBySlug.get(bookingData.coachSlug)
    const serviceId = serviceIdsBySlug.get(bookingData.serviceSlug)
    const servicePricing = servicePricingBySlug.get(bookingData.serviceSlug)

    if (!userId || !coachId || !serviceId || !servicePricing) {
      console.warn(`Skipping booking for ${bookingData.userEmail}: missing related records.`)
      stats.bookings.skipped += 1
      continue
    }

    const existing = await payload.find({
      collection: 'bookings',
      where: {
        and: [
          { user: { equals: userId } },
          { coach: { equals: coachId } },
          { service: { equals: serviceId } },
          { startTime: { equals: bookingData.startTime } },
        ],
      },
      limit: 1,
    })

    if (existing.totalDocs > 0) {
      stats.bookings.skipped += 1
      continue
    }

    await (payload as any).create({
      collection: 'bookings',
      data: {
        user: userId,
        coach: coachId,
        service: serviceId,
        coupon: bookingData.couponCode ? couponIdsByCode.get(bookingData.couponCode.toUpperCase()) : undefined,
        startTime: bookingData.startTime,
        timezone: bookingData.timezone,
        status: bookingData.status,
        paymentStatus: bookingData.paymentStatus,
        priceCents: servicePricing.priceCents,
        discountCents: 0,
        totalCents: servicePricing.priceCents,
        currency: servicePricing.currency,
        customerNotes: bookingData.customerNotes,
      },
    })
    stats.bookings.created += 1
  }

  console.log('French gym seed complete:')
  console.table(stats)
  process.exit(0)
}

run().catch((error) => {
  console.error('French gym seed failed:', error)
  process.exit(1)
})
