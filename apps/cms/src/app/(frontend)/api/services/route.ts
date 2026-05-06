import { NextResponse } from 'next/server';

import { getPayloadClient } from '@frontend/lib/server/payload';
import { mapService } from './map-service';

export async function GET() {
  try {
    const payload = await getPayloadClient();
    const { docs } = await payload.find({
      collection: 'services',
      depth: 1,
      sort: 'sortOrder',
      where: { isActive: { equals: true } },
      overrideAccess: true,
    });

    const services = docs.map(mapService);
    return NextResponse.json({ success: true, services });
  } catch (error) {
    console.error('Failed to fetch services', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch services' }, { status: 500 });
  }
}
