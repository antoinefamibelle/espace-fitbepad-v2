import { NextRequest, NextResponse } from 'next/server';

import { AUTH_SESSION_COOKIE, AUTH_SESSION_TTL_SECONDS } from '@frontend/lib/auth/constants';
import { createSessionToken } from '@frontend/lib/server/auth-session';
import { getPayloadClient } from '@frontend/lib/server/payload';

type LoginBody = {
  email?: string;
  password?: string;
};

function stringValue(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

function idValue(value: unknown): string {
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return String(value);
  return '';
}

function normalizeIdentity(user: any, collection: 'users' | 'admins') {
  const id = idValue(user.id);
  const email = stringValue(user.email);
  if (!id || !email) return null;

  return {
    id,
    email,
    firstName: stringValue(user.firstName) || undefined,
    lastName: stringValue(user.lastName) || undefined,
    avatarUrl: stringValue(user.avatarUrl) || undefined,
    locale: stringValue(user.locale) || undefined,
    timezone: stringValue(user.timezone) || undefined,
    collection,
    isAdmin: collection === 'admins' || Boolean(user.isAdmin),
  } as const;
}

async function tryPayloadLogin(collection: 'users' | 'admins', email: string, password: string) {
  try {
    const payload = await getPayloadClient();
    const result = await payload.login({ collection, data: { email, password } });
    if (!result?.user) return null;
    return normalizeIdentity(result.user, collection);
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest) {
  let body: LoginBody;
  try {
    body = (await request.json()) as LoginBody;
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid JSON body' }, { status: 400 });
  }

  const email = stringValue(body.email).trim().toLowerCase();
  const password = stringValue(body.password);
  if (!email || !password) {
    return NextResponse.json({ success: false, error: 'Email and password are required' }, { status: 400 });
  }

  const adminIdentity = await tryPayloadLogin('admins', email, password);
  const identity = adminIdentity ?? (await tryPayloadLogin('users', email, password));

  if (!identity) {
    return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
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
}
