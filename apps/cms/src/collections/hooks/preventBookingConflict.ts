import type { CollectionBeforeValidateHook } from 'payload'

type LocalTimeSlot = { start: Date; end: Date }

function hasConflictLocally(slot: LocalTimeSlot, existing: LocalTimeSlot[]): boolean {
  return existing.some((interval) => slot.start < interval.end && slot.end > interval.start)
}

export const preventBookingConflict: CollectionBeforeValidateHook = async ({
  data,
  req,
  operation,
  originalDoc,
}) => {
  if (!data?.startTime || !data?.coach) return data
  if (operation === 'update' && (originalDoc?.status === 'cancelled' || originalDoc?.status === 'canceled')) return data

  if (!data.endTime && data.startTime && data.service) {
    const serviceId = typeof data.service === 'object' ? data.service.id : data.service
    const service = await req.payload.findByID({ collection: 'services', id: serviceId })
    if (service?.durationMinutes) {
      data.endTime = new Date(
        new Date(data.startTime).getTime() + service.durationMinutes * 60_000,
      ).toISOString()
    }
  }

  if (!data.endTime) return data

  const coachId = typeof data.coach === 'object' ? data.coach.id : data.coach

  const potentialConflicts = await req.payload.find({
    collection: 'bookings',
    where: {
      and: [
        { coach: { equals: coachId } },
        { status: { not_in: ['cancelled', 'canceled', 'no_show'] } },
        { startTime: { less_than: data.endTime } },
        { endTime: { greater_than: data.startTime } },
        ...(originalDoc?.id ? [{ id: { not_equals: originalDoc.id } }] : []),
      ],
    },
    limit: 50,
  })

  const slot = { start: new Date(data.startTime), end: new Date(data.endTime) }
  const existing = potentialConflicts.docs
    .map((booking) => ({ start: new Date(booking.startTime), end: new Date(booking.endTime) }))
    .filter((interval) => !Number.isNaN(interval.start.getTime()) && !Number.isNaN(interval.end.getTime()))

  if (hasConflictLocally(slot, existing)) {
    throw new Error('Coach has a conflicting booking in this time slot.')
  }

  return data
}
