import { NextRequest, NextResponse } from 'next/server';

import { getAuthenticatedPayloadUser } from '@frontend/lib/server/auth-identity';
import { mapPayloadBooking } from '@frontend/lib/server/booking-transform';
import { getPayloadClient } from '@frontend/lib/server/payload';

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedPayloadUser(request);
    if (!user || user.collection !== 'users') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    const params = request.nextUrl.searchParams;
    const limit = Number(params.get('limit') || 20);
    const offset = Number(params.get('offset') || 0);

    const where: Record<string, any> = { user: { equals: user.id } };
    const status = params.get('status');
    if (status) where.status = { equals: status };
    const dateFrom = params.get('dateFrom');
    if (dateFrom) where.startTime = { ...where.startTime, greater_than_equal: `${dateFrom}T00:00:00.000Z` };
    const dateTo = params.get('dateTo');
    if (dateTo) where.startTime = { ...where.startTime, less_than_equal: `${dateTo}T23:59:59.999Z` };

    const payload = await getPayloadClient();
    const response = await payload.find({
      collection: 'bookings',
      depth: 2,
      sort: '-startTime',
      limit,
      page: Math.floor(offset / limit) + 1,
      overrideAccess: true,
      where,
    });

    const bookings = response.docs.map(mapPayloadBooking);
    return NextResponse.json({ success: true, bookings });
  } catch (error) {
    console.error('Failed to list user bookings', error);
    return NextResponse.json({ success: false, error: 'Failed to list bookings' }, { status: 500 });
  }
}
