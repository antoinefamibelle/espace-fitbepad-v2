import { NextRequest, NextResponse } from 'next/server';

import { getAuthenticatedPayloadUser } from '@frontend/lib/server/auth-identity';
import { mapPayloadBooking } from '@frontend/lib/server/booking-transform';
import { getPayloadClient } from '@frontend/lib/server/payload';

function normalizeId(value: unknown): string | null {
  if (typeof value === 'string' || typeof value === 'number') return String(value);
  if (typeof value === 'object' && value !== null && 'id' in value) {
    const nestedId = (value as { id?: unknown }).id;
    if (typeof nestedId === 'string' || typeof nestedId === 'number') return String(nestedId);
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

    const bookingUser = normalizeId(booking.user);
    if (!booking || !bookingUser || bookingUser !== String(user.id)) {
      return NextResponse.json({ success: false, error: 'Booking not found' }, { status: 404 });
    }

    const updated = await payload.update({
      collection: 'bookings',
      id,
      overrideAccess: true,
      data: {
        status: 'cancelled',
        cancelledAt: new Date().toISOString(),
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Booking cancelled',
      booking: mapPayloadBooking(updated),
    });
  } catch (error) {
    console.error('Failed to cancel booking', error);
    return NextResponse.json({ success: false, error: 'Failed to cancel booking' }, { status: 500 });
  }
}
