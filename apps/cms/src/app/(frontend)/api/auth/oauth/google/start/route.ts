import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

import { AUTH_OAUTH_STATE_COOKIE } from '@frontend/lib/auth/constants';

function getBaseUrl(request: NextRequest): string {
  return (
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.NEXT_PUBLIC_SERVER_URL ||
    `${request.nextUrl.protocol}//${request.nextUrl.host}`
  ).replace(/\/$/, '');
}

export async function GET(request: NextRequest) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) {
    return NextResponse.json({ success: false, error: 'Missing GOOGLE_CLIENT_ID' }, { status: 500 });
  }

  const state = crypto.randomBytes(24).toString('hex');
  const callbackUrl = `${getBaseUrl(request)}/api/auth/oauth/google/callback`;
  const redirectAfterLogin = request.nextUrl.searchParams.get('redirect') || '/profile';

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: callbackUrl,
    response_type: 'code',
    scope: 'openid email profile',
    prompt: 'select_account',
    state,
  });

  const response = NextResponse.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`);
  response.cookies.set(AUTH_OAUTH_STATE_COOKIE, `${state}:${redirectAfterLogin}`, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 10,
  });

  return response;
}
