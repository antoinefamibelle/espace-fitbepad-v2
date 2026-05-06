import { NextRequest, NextResponse } from 'next/server';

import { AUTH_SESSION_COOKIE, AUTH_SESSION_TTL_SECONDS } from '@frontend/lib/auth/constants';
import { createSessionToken } from '@frontend/lib/server/auth-session';
import { getPayloadClient } from '@frontend/lib/server/payload';
import { sendSignupCustomerWelcome, sendSignupOwnerNotification } from '@/lib/transactionalEmail';

type RegisterBody = {
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
};

function asString(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

function asId(value: unknown): string {
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return String(value);
  return '';
}

export async function POST(request: NextRequest) {
  let body: RegisterBody;
  try {
    body = (await request.json()) as RegisterBody;
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid JSON body' }, { status: 400 });
  }

  const email = asString(body.email).trim().toLowerCase();
  const password = asString(body.password);
  const firstName = asString(body.firstName).trim();
  const lastName = asString(body.lastName).trim();

  if (!email || !password) {
    return NextResponse.json({ success: false, error: 'Email and password are required' }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json(
      { success: false, error: 'Password must contain at least 8 characters' },
      { status: 400 },
    );
  }

  try {
    const payload = await getPayloadClient();
    const userDoc = await payload.create({
      collection: 'users',
      overrideAccess: true,
      data: {
        email,
        password,
        firstName: firstName || undefined,
        lastName: lastName || undefined,
        locale: 'fr',
        timezone: 'Europe/Paris',
      },
    });

    await sendSignupOwnerNotification(payload, {
      email,
      firstName: firstName || undefined,
      lastName: lastName || undefined,
      provider: 'password',
    });
    await sendSignupCustomerWelcome(payload, {
      email,
      firstName: firstName || undefined,
      lastName: lastName || undefined,
      provider: 'password',
    });

    const identity = {
      id: asId(userDoc.id),
      email: asString(userDoc.email),
      firstName: asString(userDoc.firstName) || undefined,
      lastName: asString(userDoc.lastName) || undefined,
      avatarUrl: asString((userDoc as any).avatarUrl) || undefined,
      locale: asString((userDoc as any).locale) || undefined,
      timezone: asString((userDoc as any).timezone) || undefined,
      collection: 'users' as const,
      isAdmin: false,
    };
    if (!identity.id || !identity.email) {
      return NextResponse.json({ success: false, error: 'Invalid user payload from CMS' }, { status: 500 });
    }

    const token = createSessionToken(identity);
    const response = NextResponse.json({ success: true, user: identity });
    response.cookies.set(AUTH_SESSION_COOKIE, token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: AUTH_SESSION_TTL_SECONDS,
    });
    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to register account';
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
