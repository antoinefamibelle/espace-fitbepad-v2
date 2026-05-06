import { NextResponse } from 'next/server';

import { AUTH_SESSION_COOKIE } from '@frontend/lib/auth/constants';

export async function POST() {
  const response = NextResponse.json({ success: true });
  response.cookies.set(AUTH_SESSION_COOKIE, '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  });
  return response;
}
