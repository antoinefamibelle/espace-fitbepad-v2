import { addDays, addHours } from 'date-fns'
import type { CollectionBeforeValidateHook } from 'payload'

function relationId(value: unknown): string | null {
  if (!value) return null
  if (typeof value === 'string') return value
  if (typeof value === 'object' && value !== null && 'id' in value) {
    const maybeId = (value as { id?: unknown }).id
    return typeof maybeId === 'string' ? maybeId : null
  }
  return null
}

function normalizeCoachIds(input: unknown): string[] {
  if (!Array.isArray(input)) return []
  return input
    .map((value) => relationId(value))
    .filter((id): id is string => typeof id === 'string' && id.length > 0)
}

export const enforceBookingRules: CollectionBeforeValidateHook = async ({
  data,
  req,
  originalDoc,
}) => {
  const serviceId = relationId(data?.service) ?? relationId(originalDoc?.service)
  const coachId = relationId(data?.coach) ?? relationId(originalDoc?.coach)
  const rawStartTime = data?.startTime ?? originalDoc?.startTime

  if (!serviceId || !coachId || !rawStartTime) return data

  const service = await req.payload.findByID({ collection: 'services', id: serviceId })
  if (!service) return data

  const eligibleCoachIds = normalizeCoachIds(service.eligibleCoaches)
  if (eligibleCoachIds.length > 0 && !eligibleCoachIds.includes(coachId)) {
    throw new Error('Selected coach is not eligible for this service.')
  }

  const startTime = new Date(rawStartTime)
  if (Number.isNaN(startTime.getTime())) {
    throw new Error('Invalid booking start time.')
  }

  const minAdvanceBookingHours = Math.max(24, Number(service.minAdvanceBookingHours || 24))
  const maxAdvanceBookingDays = Math.max(1, Number(service.maxAdvanceBookingDays || 60))
  const earliestBookableAt = addHours(new Date(), minAdvanceBookingHours)
  const latestBookableAt = addDays(new Date(), maxAdvanceBookingDays)

  if (startTime < earliestBookableAt) {
    throw new Error(`Booking must be made at least ${minAdvanceBookingHours} hours in advance.`)
  }

  if (startTime > latestBookableAt) {
    throw new Error(`Booking cannot be made more than ${maxAdvanceBookingDays} days in advance.`)
  }

  return data
}
