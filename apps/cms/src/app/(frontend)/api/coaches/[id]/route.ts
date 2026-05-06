import { NextRequest, NextResponse } from 'next/server';

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

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const payload = await getPayloadClient();
    const doc = await payload.findByID({
      collection: 'coaches',
      id,
      depth: 1,
      overrideAccess: true,
    });
    return NextResponse.json({ success: true, coach: mapCoach(doc) });
  } catch (error) {
    console.error('Failed to fetch coach', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch coach' }, { status: 500 });
  }
}
