import Stripe from 'stripe'
import type { Endpoint } from 'payload'

import { getStripeClient } from '../lib/stripe'

type BookingLike = {
  id: number | string
  status?: string | null
  paymentStatus?: string | null
  stripeCheckoutSessionId?: string | null
  stripePaymentIntentId?: string | null
  user?: unknown
  coupon?: unknown
}

function errorResponse(status: number, error: string, code: string) {
  return Response.json({ error, code }, { status })
}

function relationId(value: unknown): string | null {
  if (typeof value === 'string' || typeof value === 'number') return String(value)
  if (typeof value === 'object' && value !== null && 'id' in value) {
    const nested = (value as { id?: unknown }).id
    if (typeof nested === 'string' || typeof nested === 'number') return String(nested)
  }
  return null
}

function metadataString(value: unknown): string | null {
  return typeof value === 'string' && value.length > 0 ? value : null
}

async function sendBookingConfirmationEmail(params: {
  to: string
  bookingId: string
}): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.RESEND_FROM_EMAIL
  if (!apiKey || !from) return

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [params.to],
      subject: 'Votre reservation est confirmee',
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.5;">
          <h2>Paiement confirme</h2>
          <p>Votre reservation #${params.bookingId} est confirmee.</p>
          <p>Merci pour votre confiance.</p>
        </div>
      `,
    }),
  })
}

async function findBookingFromSession(
  req: Parameters<Endpoint['handler']>[0],
  session: Stripe.Checkout.Session,
): Promise<BookingLike | null> {
  const bookingIdFromMetadata = metadataString(session.metadata?.bookingId)
  if (bookingIdFromMetadata) {
    const booking = await req.payload.findByID({
      collection: 'bookings',
      id: bookingIdFromMetadata,
      depth: 1,
      overrideAccess: true,
    }).catch(() => null)
    if (booking) return booking as BookingLike
  }

  const lookup = await req.payload.find({
    collection: 'bookings',
    depth: 1,
    limit: 1,
    overrideAccess: true,
    // Payload where typings are stricter than dynamic operators here.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    where: { stripeCheckoutSessionId: { equals: session.id } } as any,
  })
  return (lookup.docs[0] as BookingLike | undefined) ?? null
}

async function findBookingFromPaymentIntent(
  req: Parameters<Endpoint['handler']>[0],
  intent: Stripe.PaymentIntent,
): Promise<BookingLike | null> {
  const bookingIdFromMetadata = metadataString(intent.metadata?.bookingId)
  if (bookingIdFromMetadata) {
    const booking = await req.payload.findByID({
      collection: 'bookings',
      id: bookingIdFromMetadata,
      depth: 1,
      overrideAccess: true,
    }).catch(() => null)
    if (booking) return booking as BookingLike
  }

  const lookup = await req.payload.find({
    collection: 'bookings',
    depth: 1,
    limit: 1,
    overrideAccess: true,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    where: { stripePaymentIntentId: { equals: intent.id } } as any,
  })
  return (lookup.docs[0] as BookingLike | undefined) ?? null
}

export const stripeWebhookEndpoint: Endpoint = {
  path: '/stripe/webhook',
  method: 'post',
  handler: async (req) => {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
    if (!webhookSecret) {
      return errorResponse(500, 'Missing STRIPE_WEBHOOK_SECRET', 'STRIPE_CONFIG_ERROR')
    }

    const signature = req.headers.get('stripe-signature')
    if (!signature) {
      return errorResponse(400, 'Missing stripe-signature header', 'MISSING_SIGNATURE')
    }

    const rawBody = await req.text?.()
    if (!rawBody) {
      return errorResponse(400, 'Webhook body is empty', 'EMPTY_BODY')
    }

    let event: Stripe.Event
    try {
      event = getStripeClient().webhooks.constructEvent(rawBody, signature, webhookSecret)
    } catch {
      return errorResponse(400, 'Invalid Stripe signature', 'INVALID_SIGNATURE')
    }

    try {
      if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session
        const booking = await findBookingFromSession(req, session)
        if (!booking) return Response.json({ received: true, ignored: true })

        if (booking.paymentStatus === 'paid' || booking.status === 'confirmed') {
          return Response.json({ received: true, idempotent: true })
        }

        const userId = relationId(booking.user)
        const sessionUserId = metadataString(session.metadata?.userId)
        if (!userId || (sessionUserId && sessionUserId !== userId)) {
          return errorResponse(400, 'Invalid booking metadata', 'INVALID_METADATA')
        }

        const updated = await req.payload.update({
          collection: 'bookings',
          id: booking.id,
          overrideAccess: true,
          req,
          depth: 1,
          data: {
            status: 'confirmed',
            paymentStatus: 'paid',
            stripeCheckoutSessionId: session.id,
            stripePaymentIntentId:
              typeof session.payment_intent === 'string' ? session.payment_intent : undefined,
          },
        })

        const userEmail =
          typeof updated.user === 'object' && updated.user && 'email' in updated.user
            ? String((updated.user as { email?: string }).email || '')
            : ''
        if (userEmail) {
          await sendBookingConfirmationEmail({
            to: userEmail,
            bookingId: String(updated.id),
          })
        }

        return Response.json({ received: true })
      }

      if (event.type === 'checkout.session.expired') {
        const session = event.data.object as Stripe.Checkout.Session
        const booking = await findBookingFromSession(req, session)
        if (!booking) return Response.json({ received: true, ignored: true })

        if (booking.status === 'canceled' || booking.paymentStatus === 'expired') {
          return Response.json({ received: true, idempotent: true })
        }

        await req.payload.update({
          collection: 'bookings',
          id: booking.id,
          overrideAccess: true,
          req,
          data: {
            status: 'canceled',
            paymentStatus: 'expired',
            cancelledAt: new Date().toISOString(),
            stripeCheckoutSessionId: session.id,
            stripePaymentIntentId:
              typeof session.payment_intent === 'string' ? session.payment_intent : undefined,
          },
        })

        return Response.json({ received: true })
      }

      if (event.type === 'payment_intent.payment_failed') {
        const intent = event.data.object as Stripe.PaymentIntent
        const booking = await findBookingFromPaymentIntent(req, intent)
        if (!booking) return Response.json({ received: true, ignored: true })

        if (booking.paymentStatus === 'failed') {
          return Response.json({ received: true, idempotent: true })
        }

        await req.payload.update({
          collection: 'bookings',
          id: booking.id,
          overrideAccess: true,
          req,
          data: {
            paymentStatus: 'failed',
            stripePaymentIntentId: intent.id,
          },
        })

        return Response.json({ received: true })
      }

      return Response.json({ received: true, ignored: true })
    } catch {
      return errorResponse(500, 'Webhook processing failed', 'WEBHOOK_PROCESSING_ERROR')
    }
  },
}
