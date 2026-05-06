import { NextRequest, NextResponse } from 'next/server';

import { AUTH_OAUTH_STATE_COOKIE, AUTH_SESSION_COOKIE, AUTH_SESSION_TTL_SECONDS } from '@frontend/lib/auth/constants';
import { createSessionToken } from '@frontend/lib/server/auth-session';
import { getPayloadClient } from '@frontend/lib/server/payload';
import { upsertPayloadIdentity } from '@frontend/lib/server/user-bridge';
import { sendSignupCustomerWelcome, sendSignupOwnerNotification } from '@/lib/transactionalEmail';

type GoogleTokenResponse = {
  access_token: string;
};

type GoogleUserInfo = {
  sub: string;
  email: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
  locale?: string;
};

function getBaseUrl(request: NextRequest): string {
  return (
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.NEXT_PUBLIC_SERVER_URL ||
    `${request.nextUrl.protocol}//${request.nextUrl.host}`
  ).replace(/\/$/, '');
}

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code');
  const state = request.nextUrl.searchParams.get('state');
  const stateCookie = request.cookies.get(AUTH_OAUTH_STATE_COOKIE)?.value || '';
  const [expectedState, redirectAfterLogin] = stateCookie.split(':');

  if (!code || !state || !expectedState || state !== expectedState) {
    return NextResponse.redirect(`${getBaseUrl(request)}/login?error=oauth_state`);
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    return NextResponse.redirect(`${getBaseUrl(request)}/login?error=oauth_config`);
  }

  const callbackUrl = `${getBaseUrl(request)}/api/auth/oauth/google/callback`;

  const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: callbackUrl,
      grant_type: 'authorization_code',
    }),
    cache: 'no-store',
  });

  if (!tokenResponse.ok) {
    return NextResponse.redirect(`${getBaseUrl(request)}/login?error=oauth_token`);
  }

  const tokenBody = (await tokenResponse.json()) as GoogleTokenResponse;
  const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
    headers: { Authorization: `Bearer ${tokenBody.access_token}` },
    cache: 'no-store',
  });

  if (!userInfoResponse.ok) {
    return NextResponse.redirect(`${getBaseUrl(request)}/login?error=oauth_profile`);
  }

  const profile = (await userInfoResponse.json()) as GoogleUserInfo;
  if (!profile.email || !profile.sub) {
    return NextResponse.redirect(`${getBaseUrl(request)}/login?error=oauth_identity`);
  }

  const identity = await upsertPayloadIdentity({
    provider: 'google',
    providerUserId: profile.sub,
    email: profile.email.toLowerCase(),
    firstName: profile.given_name,
    lastName: profile.family_name,
    avatarUrl: profile.picture,
    locale: profile.locale,
  });

  if (identity.wasCreated && identity.collection === 'users') {
    const payload = await getPayloadClient();
    await sendSignupOwnerNotification(payload, {
      email: identity.email,
      firstName: identity.firstName,
      lastName: identity.lastName,
      provider: 'google',
    });
    await sendSignupCustomerWelcome(payload, {
      email: identity.email,
      firstName: identity.firstName,
      lastName: identity.lastName,
      provider: 'google',
    });
  }

  const authToken = createSessionToken({
    id: identity.id,
    email: identity.email,
    firstName: identity.firstName,
    lastName: identity.lastName,
    avatarUrl: identity.avatarUrl,
    locale: identity.locale,
    timezone: identity.timezone,
    collection: identity.collection === 'admins' ? 'admins' : 'users',
    isAdmin: Boolean(identity.isAdmin || identity.collection === 'admins'),
  });

  const targetPath = redirectAfterLogin || (identity.isAdmin ? '/admin' : '/profile');
  const response = NextResponse.redirect(`${getBaseUrl(request)}${targetPath}`);
  response.cookies.set(AUTH_OAUTH_STATE_COOKIE, '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  });
  response.cookies.set(AUTH_SESSION_COOKIE, authToken, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: AUTH_SESSION_TTL_SECONDS,
  });

  return response;
}
