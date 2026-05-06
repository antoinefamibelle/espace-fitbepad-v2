import { NextRequest, NextResponse } from 'next/server';

import { getAuthenticatedPayloadUser } from '@frontend/lib/server/auth-identity';
import { getPayloadClient } from '@frontend/lib/server/payload';
import { createCheckoutSession } from '@frontend/lib/stripe';

function relationId(value: unknown): string | null {
  if (!value) return null;
  if (typeof value === 'string' || typeof value === 'number') return String(value);
  if (typeof value === 'object' && value !== null && 'id' in value) {
    const maybeId = (value as { id?: unknown }).id;
    return typeof maybeId === 'string' || typeof maybeId === 'number' ? String(maybeId) : null;
  }
  return null;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getAuthenticatedPayloadUser(request);
    if (!user || user.collection !== 'users') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const payload = await getPayloadClient();
    const booking = await payload.findByID({
      collection: 'bookings',
      id,
      depth: 0,
      overrideAccess: true,
    });

    const bookingUser = relationId(booking.user);
    if (!booking || !bookingUser || bookingUser !== String(user.id)) {
      return NextResponse.json({ success: false, error: 'Booking not found' }, { status: 404 });
    }

    if (booking.status === 'cancelled' || booking.status === 'canceled') {
      return NextResponse.json({ success: false, error: 'Cancelled booking cannot be paid' }, { status: 400 });
    }

    const serviceId = relationId(booking.service);
    if (!serviceId) {
      return NextResponse.json({ success: false, error: 'Booking has no service' }, { status: 400 });
    }

    const service = await payload.findByID({
      collection: 'services',
      id: serviceId,
      depth: 0,
      overrideAccess: true,
    });

    const amountCents = Number((booking as any).totalCents || (booking as any).priceCents || service.priceCents || 0);
    if (!Number.isFinite(amountCents) || amountCents <= 0) {
      return NextResponse.json({ success: false, error: 'Invalid booking amount' }, { status: 400 });
    }

    const origin = request.nextUrl.origin;
    const successUrl = `${origin}/checkout/success?booking_id=${encodeURIComponent(id)}&session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${origin}/checkout/cancel?booking_id=${encodeURIComponent(id)}&session_id={CHECKOUT_SESSION_ID}`;

    const session = await createCheckoutSession({
      itemName: service.name || 'Reservation Fitbepad',
      itemDescription: (service as any).shortDescription || `Reservation ${service.name || 'service'} le ${booking.startTime || ''}`,
      amountCents,
      currency: String((service as any).currency || (booking as any).currency || 'eur').toLowerCase(),
      bookingId: id,
      userId: user.id,
      successUrl,
      cancelUrl,
    });

    if (!session.url) {
      return NextResponse.json({ success: false, error: 'Stripe checkout URL missing' }, { status: 500 });
    }

    await payload.update({
      collection: 'bookings',
      id,
      overrideAccess: true,
      data: {
        status: 'pending_payment',
        paymentStatus: 'unpaid',
        customerNotes: (booking as any).customerNotes || '',
        internalNotes: `checkout_session:${session.id}`,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
