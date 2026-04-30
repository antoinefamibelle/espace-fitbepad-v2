import { z } from 'zod'
import type { Endpoint } from 'payload'
import crypto from 'crypto'

import { AUTH_SESSION_COOKIE } from '../app/(frontend)/lib/auth/constants'
import { getStripeClient } from '../lib/stripe'

const paramsSchema = z.object({
  id: z.string().min(1),
})

function errorResponse(
  status: number,
  error: string,
  code: string,
) {
  return Response.json({ error, code }, { status })
}

function parseCookieHeader(header: string | null): Record<string, string> {
  if (!header) return {}

  return header.split(';').reduce<Record<string, string>>((acc, part) => {
    const [rawKey, ...rawValue] = part.trim().split('=')
    const key = rawKey?.trim()
    if (!key) return acc
    acc[key] = decodeURIComponent(rawValue.join('=').trim())
    return acc
  }, {})
}

function base64UrlDecode(value: string): string {
  return Buffer.from(value, 'base64url').toString('utf8')
}

function sign(payloadB64: string): string {
  const secret = process.env.AUTH_SESSION_SECRET || process.env.PAYLOAD_SECRET
  if (!secret) return ''

  const hmac = crypto.createHmac('sha256', secret)
  hmac.update(payloadB64)
  return hmac.digest('base64url')
}

function verifySessionToken(token: string | undefined): {
  id: string
  email: string
  collection: 'users' | 'admins'
} | null {
  if (!token) return null

  const [payloadB64, signature] = token.split('.')
  if (!payloadB64 || !signature) return null
  if (sign(payloadB64) !== signature) return null

  try {
    const parsed = JSON.parse(base64UrlDecode(payloadB64)) as {
      id?: string
      email?: string
      collection?: 'users' | 'admins'
      exp?: number
    }

    if (!parsed.id || !parsed.email || !parsed.collection || !parsed.exp) return null
    if (parsed.exp <= Math.floor(Date.now() / 1000)) return null

    return {
      id: parsed.id,
      email: parsed.email,
      collection: parsed.collection,
    }
  } catch {
    return null
  }
}

function relationId(value: unknown): string | null {
  if (typeof value === 'string' || typeof value === 'number') return String(value)
  if (typeof value === 'object' && value !== null && 'id' in value) {
    const nested = (value as { id?: unknown }).id
    if (typeof nested === 'string' || typeof nested === 'number') return String(nested)
  }
  return null
}

function parseBookingIdFromPath(url: string): string | null {
  const pathname = new URL(url).pathname
  const match = pathname.match(/\/api\/bookings\/([^/]+)\/checkout$/)
  if (!match?.[1]) return null
  return decodeURIComponent(match[1])
}

export const createCheckoutSessionEndpoint: Endpoint = {
  path: '/bookings/:id/checkout',
  method: 'post',
  handler: async (req) => {
    const bookingId = parseBookingIdFromPath(req.url || '')
    const parsedParams = paramsSchema.safeParse({ id: bookingId })
    if (!parsedParams.success) {
      return errorResponse(400, 'Invalid booking id', 'INVALID_BOOKING_ID')
    }

    const cookies = parseCookieHeader(req.headers.get('cookie'))
    const sessionToken = cookies[AUTH_SESSION_COOKIE]
    const identity = verifySessionToken(sessionToken)

    if (!identity || identity.collection !== 'users') {
      return errorResponse(401, 'Unauthorized', 'UNAUTHORIZED')
    }

    const booking = await req.payload.findByID({
      collection: 'bookings',
      id: parsedParams.data.id,
      depth: 1,
      overrideAccess: true,
    }).catch(() => null)

    if (!booking) {
      return errorResponse(404, 'Booking not found', 'BOOKING_NOT_FOUND')
    }

    const bookingUserId = relationId(booking.user)
    if (!bookingUserId || bookingUserId !== identity.id) {
      return errorResponse(403, 'Forbidden', 'BOOKING_ACCESS_DENIED')
    }

    if (booking.status !== 'pending_payment') {
      return errorResponse(409, 'Booking cannot be paid in its current state', 'BOOKING_NOT_PENDING_PAYMENT')
    }

    const startTime = new Date(booking.startTime)
    if (Number.isNaN(startTime.getTime()) || startTime.getTime() <= Date.now()) {
      return errorResponse(409, 'Booking expired', 'BOOKING_EXPIRED')
    }

    const totalCents = Number(booking.totalCents)
    if (!Number.isFinite(totalCents) || totalCents <= 0) {
      return errorResponse(400, 'Invalid booking amount', 'INVALID_BOOKING_AMOUNT')
    }

    const serviceId = relationId(booking.service)
    if (!serviceId) {
      return errorResponse(400, 'Booking service is missing', 'BOOKING_SERVICE_MISSING')
    }

    const service =
      typeof booking.service === 'object' && booking.service
        ? booking.service
        : await req.payload.findByID({
            collection: 'services',
            id: serviceId,
            depth: 0,
            overrideAccess: true,
          }).catch(() => null)

    if (!service || !service.name) {
      return errorResponse(400, 'Booking service is invalid', 'BOOKING_SERVICE_INVALID')
    }

    const clientUrl = process.env.CLIENT_URL?.replace(/\/$/, '')
    if (!clientUrl) {
      return errorResponse(500, 'Server configuration is missing CLIENT_URL', 'SERVER_CONFIG_ERROR')
    }

    const currency = String(booking.currency || 'eur').toLowerCase()
    const stripe = getStripeClient()
    const expiresAt = Math.floor(Date.now() / 1000) + 30 * 60

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency,
            unit_amount: Math.round(totalCents),
            product_data: {
              name: service.name,
              description: service.shortDescription || `Booking ${service.name}`,
            },
          },
        },
      ],
      customer_email: identity.email,
      success_url: `${clientUrl}/bookings/${booking.id}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${clientUrl}/bookings/${booking.id}/cancel`,
      expires_at: expiresAt,
      metadata: {
        bookingId: String(booking.id),
        userId: identity.id,
      },
      payment_intent_data: {
        metadata: {
          bookingId: String(booking.id),
          userId: identity.id,
        },
      },
    })

    await req.payload.update({
      collection: 'bookings',
      id: booking.id,
      overrideAccess: true,
      req,
      data: {
        stripeCheckoutSessionId: session.id,
        stripePaymentIntentId:
          typeof session.payment_intent === 'string' ? session.payment_intent : undefined,
      },
    })

    if (!session.url) {
      return errorResponse(500, 'Stripe checkout URL missing', 'CHECKOUT_URL_MISSING')
    }

    return Response.json({ url: session.url })
  },
}
