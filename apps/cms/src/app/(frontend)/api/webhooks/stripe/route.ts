import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

import { getPayloadClient } from '@frontend/lib/server/payload';
import {
  sendBookingPaidCustomerConfirmation,
  sendBookingPaidOwnerNotification,
} from '@/lib/transactionalEmail';

const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

type PaymentPayload = {
  userId: string;
  bookingId: string;
  checkoutSessionId?: string;
  paymentIntentId?: string;
  amountCents?: number;
  currency?: string;
};

function metadataString(value: unknown): string | undefined {
  return typeof value === 'string' && value.length > 0 ? value : undefined;
}

async function upsertPaymentRecord(data: PaymentPayload, status: 'pending' | 'succeeded' | 'failed') {
  const { userId, bookingId, checkoutSessionId, paymentIntentId, amountCents, currency } = data;
  if (!checkoutSessionId && !paymentIntentId) return;

  const payload = await getPayloadClient();

  const where = (
    checkoutSessionId
      ? { stripeCheckoutSessionId: { equals: checkoutSessionId } }
      : { stripePaymentIntentId: { equals: String(paymentIntentId) } }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ) as any;

  const existing = await payload.find({
    collection: 'payments',
    limit: 1,
    depth: 0,
    overrideAccess: true,
    where,
  });

  const paymentData = {
    user: Number(userId),
    booking: Number(bookingId),
    stripeCheckoutSessionId: checkoutSessionId,
    stripePaymentIntentId: paymentIntentId,
    amountCents: amountCents || 0,
    currency: (currency || 'eur').toLowerCase(),
    status,
  };

  const doc = existing.docs[0];
  if (doc?.id) {
    await payload.update({
      collection: 'payments',
      id: doc.id,
      overrideAccess: true,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: paymentData as any,
    });
    return doc.id;
  }

  const created = await payload.create({
    collection: 'payments',
    overrideAccess: true,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: paymentData as any,
  });
  return created.id;
}

async function updateBookingStatus(bookingId: string, status: string, paymentStatus: string, paymentId?: string) {
  const payload = await getPayloadClient();
  const updateData: Record<string, unknown> = { status, paymentStatus };
  if (paymentId) updateData.payment = paymentId;

  await payload.update({
    collection: 'bookings',
    id: bookingId,
    overrideAccess: true,
    data: updateData,
  });
}

export async function POST(request: NextRequest) {
  if (!STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ success: false, error: 'Missing STRIPE_WEBHOOK_SECRET' }, { status: 500 });
  }

  const signature = request.headers.get('stripe-signature');
  if (!signature) {
    return NextResponse.json({ success: false, error: 'Missing stripe-signature header' }, { status: 400 });
  }

  const rawBody = await request.text();
  let event: Stripe.Event;
  try {
    event = Stripe.webhooks.constructEvent(rawBody, signature, STRIPE_WEBHOOK_SECRET);
  } catch (error) {
    console.error('Stripe webhook signature verification failed', error);
    return NextResponse.json({ success: false, error: 'Invalid signature' }, { status: 400 });
  }

  try {
    if (event.type === 'checkout.session.completed' || event.type === 'checkout.session.expired') {
      const session = event.data.object as Stripe.Checkout.Session;
      const bookingId = metadataString(session.metadata?.bookingId) || metadataString(session.client_reference_id);
      const userId = metadataString(session.metadata?.userId);
      if (!bookingId || !userId) {
        return NextResponse.json({ success: true, ignored: true, reason: 'Missing booking/user metadata' });
      }

      const paymentId = await upsertPaymentRecord(
        {
          userId,
          bookingId,
          checkoutSessionId: session.id,
          paymentIntentId: metadataString(session.payment_intent),
          amountCents: session.amount_total ?? undefined,
          currency: session.currency ?? undefined,
        },
        event.type === 'checkout.session.completed' ? 'succeeded' : 'failed',
      );

      if (event.type === 'checkout.session.completed') {
        await updateBookingStatus(bookingId, 'confirmed', 'paid', String(paymentId ?? ''));
        const payload = await getPayloadClient();
        const booking = await payload.findByID({
          collection: 'bookings',
          id: bookingId,
          depth: 1,
          overrideAccess: true,
        });

        const user =
          typeof booking.user === 'object' && booking.user && 'email' in booking.user
            ? (booking.user as { email?: string; firstName?: string; lastName?: string })
            : null;
        const service =
          typeof booking.service === 'object' && booking.service && 'name' in booking.service
            ? (booking.service as { name?: string })
            : null;
        const coach =
          typeof booking.coach === 'object' && booking.coach && 'displayName' in booking.coach
            ? (booking.coach as { displayName?: string })
            : null;

        if (user?.email) {
          const customerName = [user.firstName, user.lastName].filter(Boolean).join(' ').trim() || undefined;
          const emailData = {
            bookingId: String(booking.id),
            customerEmail: user.email,
            customerName,
            startTimeIso: booking.startTime || undefined,
            serviceName: service?.name || undefined,
            coachName: coach?.displayName || undefined,
          };
          await sendBookingPaidOwnerNotification(payload, emailData);
          await sendBookingPaidCustomerConfirmation(payload, emailData);
        }
      } else {
        await updateBookingStatus(bookingId, 'failed_payment', 'failed', String(paymentId ?? ''));
      }
    }

    if (event.type === 'payment_intent.payment_failed') {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const bookingId = metadataString(paymentIntent.metadata?.bookingId);
      const userId = metadataString(paymentIntent.metadata?.userId);
      if (!bookingId || !userId) {
        return NextResponse.json({ success: true, ignored: true, reason: 'Missing booking/user metadata' });
      }

      const paymentId = await upsertPaymentRecord(
        {
          userId,
          bookingId,
          paymentIntentId: paymentIntent.id,
          amountCents: paymentIntent.amount ?? undefined,
          currency: paymentIntent.currency ?? undefined,
        },
        'failed',
      );

      await updateBookingStatus(bookingId, 'failed_payment', 'failed', String(paymentId ?? ''));
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Stripe webhook processing failed', error);
    return NextResponse.json({ success: false, error: 'Webhook processing failed' }, { status: 500 });
  }
}
