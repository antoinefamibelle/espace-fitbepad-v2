import { NextRequest, NextResponse } from 'next/server';

import { getAuthenticatedPayloadUser } from '@frontend/lib/server/auth-identity';
import { getPayloadClient } from '@frontend/lib/server/payload';

function readStringField(body: Record<string, unknown>, key: string, fallback?: string): string | undefined {
  const value = body[key];
  if (typeof value === 'string') return value;
  if (value === null) return '';
  if (value === undefined) return fallback;
  return fallback;
}

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedPayloadUser(request);
    if (!user || user.collection !== 'users') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error('Failed to fetch profile', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch profile' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const existing = await getAuthenticatedPayloadUser(request);
    if (!existing || existing.collection !== 'users') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    let body: Record<string, unknown> = {};
    try {
      body = (await request.json()) as Record<string, unknown>;
    } catch {
      return NextResponse.json({ success: false, error: 'Invalid JSON body for profile update' }, { status: 400 });
    }

    const allowed = {
      firstName: readStringField(body, 'firstName', existing.firstName ?? ''),
      lastName: readStringField(body, 'lastName', existing.lastName ?? ''),
      phone: readStringField(body, 'phone', existing.phone ?? ''),
      address: readStringField(body, 'address', existing.address ?? ''),
      city: readStringField(body, 'city', existing.city ?? ''),
      zipCode: readStringField(body, 'zipCode', existing.zipCode ?? ''),
      locale: (readStringField(body, 'locale', existing.locale ?? 'fr') || null) as 'en' | 'fr' | null | undefined,
      timezone: readStringField(body, 'timezone', existing.timezone ?? 'UTC'),
    };

    const payload = await getPayloadClient();
    const updatedUser = await payload.update({
      collection: 'users',
      id: existing.id,
      overrideAccess: true,
      data: allowed,
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error('Failed to update profile', error);
    return NextResponse.json({ success: false, error: 'Failed to update profile' }, { status: 500 });
  }
}
