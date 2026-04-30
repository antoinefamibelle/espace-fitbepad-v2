import type { Endpoint } from 'payload'

type BookingOccupancy = {
  id: string | number
  coachId: string
  startTime: string
  endTime: string
}

function isAuthorizedInternalRequest(headers: Headers): boolean {
  const secret = process.env.PAYLOAD_SECRET
  if (!secret) return false

  const authorization = headers.get('authorization')
  if (!authorization) return false

  // Accept both "Bearer <secret>" and the raw token for compatibility.
  return authorization === `Bearer ${secret}` || authorization === secret
}

function toIsoOrNull(input: string | null): string | null {
  if (!input) return null
  const date = new Date(input)
  if (Number.isNaN(date.getTime())) return null
  return date.toISOString()
}

function extractCoachId(value: unknown): string | null {
  if (!value) return null
  if (typeof value === 'string') return value
  if (typeof value === 'object' && value !== null && 'id' in value) {
    const maybeId = (value as { id?: unknown }).id
    return typeof maybeId === 'string' ? maybeId : null
  }
  return null
}

export const availabilityOccupancyEndpoint: Endpoint = {
  path: '/availability/occupancy',
  method: 'get',
  handler: async (req) => {
    if (!isAuthorizedInternalRequest(req.headers)) {
      return Response.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    if (!req.url) {
      return Response.json({ success: false, error: 'Missing request URL.' }, { status: 400 })
    }

    const url = new URL(req.url)
    const startDate = toIsoOrNull(url.searchParams.get('startDate'))
    const endDate = toIsoOrNull(url.searchParams.get('endDate'))
    const coachIdsRaw = url.searchParams.get('coachIds')
    const coachIds = coachIdsRaw
      ? coachIdsRaw
          .split(',')
          .map((id) => id.trim())
          .filter(Boolean)
      : []

    if (!startDate || !endDate) {
      return Response.json(
        { success: false, error: 'startDate and endDate query params are required (ISO date).' },
        { status: 400 },
      )
    }

    const whereAnd: any[] = [
      { startTime: { less_than_equal: endDate } },
      { endTime: { greater_than_equal: startDate } },
      { status: { not_in: ['cancelled', 'canceled', 'no_show'] } },
    ]

    if (coachIds.length > 0) {
      whereAnd.push({ coach: { in: coachIds } })
    }

    const bookings = await req.payload.find({
      collection: 'bookings',
      depth: 0,
      limit: 1000,
      where: { and: whereAnd },
    })

    const occupancy = bookings.docs.reduce<BookingOccupancy[]>((acc, booking) => {
      const coachId = extractCoachId(booking.coach)
      if (!coachId || !booking.startTime || !booking.endTime) return acc
      acc.push({
        id: booking.id,
        coachId,
        startTime: booking.startTime,
        endTime: booking.endTime,
      })
      return acc
    }, [])

    return Response.json({ success: true, bookings: occupancy })
  },
}
