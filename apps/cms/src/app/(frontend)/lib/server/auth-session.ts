import 'server-only';

import crypto from 'crypto';
import type { NextRequest } from 'next/server';
import { cookies } from 'next/headers';

import { AUTH_SESSION_COOKIE, AUTH_SESSION_TTL_SECONDS } from '@frontend/lib/auth/constants';

export type AuthCollection = 'users' | 'admins';

export interface AuthSessionIdentity {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  locale?: string;
  timezone?: string;
  isAdmin: boolean;
  collection: AuthCollection;
}

type SessionPayload = AuthSessionIdentity & {
  exp: number;
};

function base64UrlEncode(value: string): string {
  return Buffer.from(value, 'utf8').toString('base64url');
}

function base64UrlDecode(value: string): string {
  return Buffer.from(value, 'base64url').toString('utf8');
}

function getSessionSecret(): string {
  const secret = process.env.AUTH_SESSION_SECRET || process.env.PAYLOAD_SECRET;
  if (!secret) {
    throw new Error('AUTH_SESSION_SECRET or PAYLOAD_SECRET is required');
  }
  return secret;
}

function sign(payloadB64: string): string {
  const hmac = crypto.createHmac('sha256', getSessionSecret());
  hmac.update(payloadB64);
  return hmac.digest('base64url');
}

export function createSessionToken(identity: AuthSessionIdentity): string {
  const payload: SessionPayload = {
    ...identity,
    exp: Math.floor(Date.now() / 1000) + AUTH_SESSION_TTL_SECONDS,
  };
  const payloadB64 = base64UrlEncode(JSON.stringify(payload));
  return `${payloadB64}.${sign(payloadB64)}`;
}

export function verifySessionToken(token?: string | null): AuthSessionIdentity | null {
  if (!token) return null;
  const [payloadB64, signature] = token.split('.');
  if (!payloadB64 || !signature) return null;
  if (sign(payloadB64) !== signature) return null;

  try {
    const parsed = JSON.parse(base64UrlDecode(payloadB64)) as SessionPayload;
    if (!parsed?.id || !parsed?.email || !parsed?.collection) return null;
    if (parsed.exp <= Math.floor(Date.now() / 1000)) return null;
    return {
      id: parsed.id,
      email: parsed.email,
      firstName: parsed.firstName,
      lastName: parsed.lastName,
      avatarUrl: parsed.avatarUrl,
      locale: parsed.locale,
      timezone: parsed.timezone,
      isAdmin: Boolean(parsed.isAdmin || parsed.collection === 'admins'),
      collection: parsed.collection,
    };
  } catch {
    return null;
  }
}

export function getAuthTokenFromRequest(request: NextRequest): string | null {
  return request.cookies.get(AUTH_SESSION_COOKIE)?.value || null;
}

export function getAuthenticatedIdentityFromRequest(request: NextRequest): AuthSessionIdentity | null {
  return verifySessionToken(getAuthTokenFromRequest(request));
}

export async function getAuthenticatedIdentityFromCookies(): Promise<AuthSessionIdentity | null> {
  const cookieStore = await cookies();
  return verifySessionToken(cookieStore.get(AUTH_SESSION_COOKIE)?.value || null);
}
