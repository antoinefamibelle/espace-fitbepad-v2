import { NextResponse } from 'next/server';

import { getPayloadClient } from '@frontend/lib/server/payload';

function mapCoach(doc: any) {
  return {
    id: doc.id,
    name: doc.displayName,
    slug: doc.slug,
    email: doc.email,
    phone: doc.phone || '',
    bio: doc.bio || null,
    isActive: Boolean(doc.isActive),
  };
}

export async function GET() {
  try {
    const payload = await getPayloadClient();
    const { docs } = await payload.find({
      collection: 'coaches',
      depth: 1,
      sort: 'sortOrder',
      where: { isActive: { equals: true } },
      overrideAccess: true,
    });

    const coaches = docs.map(mapCoach);
    return NextResponse.json({ success: true, coaches, totalDocs: coaches.length });
  } catch (error) {
    console.error('Failed to fetch coaches', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch coaches' }, { status: 500 });
  }
}
