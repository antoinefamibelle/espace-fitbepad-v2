import { NextRequest, NextResponse } from 'next/server';

import { getPayloadClient } from '@frontend/lib/server/payload';
import { mapService } from '../map-service';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const payload = await getPayloadClient();
    const doc = await payload.findByID({
      collection: 'services',
      id,
      depth: 1,
      overrideAccess: true,
    });
    return NextResponse.json({ success: true, service: mapService(doc) });
  } catch (error) {
    console.error('Failed to fetch service', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch service' }, { status: 500 });
  }
}
