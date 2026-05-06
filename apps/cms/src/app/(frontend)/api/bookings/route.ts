import { NextRequest, NextResponse } from 'next/server';

import { getAuthenticatedPayloadUser } from '@frontend/lib/server/auth-identity';
import { mapPayloadBooking } from '@frontend/lib/server/booking-transform';
import { getPayloadClient } from '@frontend/lib/server/payload';
import {
  sendBookingCreatedCustomerConfirmation,
  sendBookingCreatedOwnerNotification,
} from '@/lib/transactionalEmail';

interface CreateBookingBody {
  date: string;
  startTime: string;
  startTimeIso?: string;
  serviceId: string;
  coachId: string;
  couponCode?: string;
  customerNotes?: string;
}

function toUtcIsoFromLocalTime(date: string, time: string, timeZone: string): string {
  const [year, month, day] = date.split('-').map(Number);
  const [hours, minutes] = time.split(':').map(Number);

  const utcGuess = new Date(Date.UTC(year, month - 1, day, hours, minutes, 0));
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  const parts = formatter.formatToParts(utcGuess);
  const lookup = (type: string) => parts.find((part) => part.type === type)?.value || '00';
  const zonedUtcEquivalent = Date.UTC(
    Number(lookup('year')),
    Number(lookup('month')) - 1,
    Number(lookup('day')),
    Number(lookup('hour')),
    Number(lookup('minute')),
    Number(lookup('second')),
  );
  const offsetMs = zonedUtcEquivalent - utcGuess.getTime();
  return new Date(Date.UTC(year, month - 1, day, hours, minutes, 0) - offsetMs).toISOString();
}

async function resolveCouponId(code?: string): Promise<number | undefined> {
  if (!code) return undefined;
  const normalized = code.trim().toUpperCase();
  if (!normalized) return undefined;

  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: 'coupons',
    limit: 1,
    overrideAccess: true,
    where: { code: { equals: normalized } },
  });
  return result.docs[0]?.id;
}

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedPayloadUser(request);
    if (!user || user.collection !== 'users') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    const body = (await request.json()) as CreateBookingBody;

    if (!body.date || !body.startTime || !body.serviceId || !body.coachId) {
      return NextResponse.json(
        { success: false, error: 'date, startTime, serviceId and coachId are required' },
        { status: 400 },
      );
    }

    const userTimeZone = (user as any).timezone || 'UTC';
    const startTimeIso = body.startTimeIso || toUtcIsoFromLocalTime(body.date, body.startTime, userTimeZone);
    const couponId = await resolveCouponId(body.couponCode);

    const payload = await getPayloadClient();
    const created = await payload.create({
      collection: 'bookings',
      overrideAccess: true,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: {
        user: Number(user.id),
        service: body.serviceId,
        coach: body.coachId,
        coupon: couponId ?? null,
        startTime: startTimeIso,
        timezone: userTimeZone,
        customerNotes: body.customerNotes || '',
        status: 'pending_payment',
        paymentStatus: 'unpaid',
      } as any,
    });

    const bookingWithRelations = await payload.findByID({
      collection: 'bookings',
      id: created.id,
      depth: 1,
      overrideAccess: true,
    });

    const customer =
      typeof bookingWithRelations.user === 'object' && bookingWithRelations.user && 'email' in bookingWithRelations.user
        ? (bookingWithRelations.user as { email?: string; firstName?: string; lastName?: string })
        : null;
    const service =
      typeof bookingWithRelations.service === 'object' && bookingWithRelations.service && 'name' in bookingWithRelations.service
        ? (bookingWithRelations.service as { name?: string })
        : null;
    const coach =
      typeof bookingWithRelations.coach === 'object' && bookingWithRelations.coach && 'displayName' in bookingWithRelations.coach
        ? (bookingWithRelations.coach as { displayName?: string })
        : null;

    if (customer?.email) {
      const customerName = [customer.firstName, customer.lastName].filter(Boolean).join(' ').trim() || undefined;
      const emailData = {
        bookingId: String(bookingWithRelations.id),
        customerEmail: customer.email,
        customerName,
        startTimeIso: bookingWithRelations.startTime || undefined,
        serviceName: service?.name || undefined,
        coachName: coach?.displayName || undefined,
      };
      await sendBookingCreatedOwnerNotification(payload, emailData);
      await sendBookingCreatedCustomerConfirmation(payload, emailData);
    }

    return NextResponse.json(
      { success: true, booking: mapPayloadBooking(created) },
      { status: 201 },
    );
  } catch (error) {
    console.error('Failed to create booking', error);
    return NextResponse.json({ success: false, error: 'Failed to create booking' }, { status: 500 });
  }
}
