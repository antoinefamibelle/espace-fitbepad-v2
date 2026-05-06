import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Cookie name is inlined here since middleware runs in edge runtime (cannot import server modules)
const AUTH_SESSION_COOKIE = 'fitbepad_auth_session';
const FORGOT_PASSWORD_LIMIT = 5;
const FORGOT_PASSWORD_WINDOW_MS = 15 * 60 * 1000;
const forgotPasswordRateLimitStore = new Map<string, number[]>();

// Payload CMS admin and REST API paths — always bypass, never apply custom auth checks
const PAYLOAD_BYPASS_PREFIXES = [
  '/admin',
  '/api/users',
  '/api/admins',
  '/api/bookings',
  '/api/payments',
  '/api/coaches',
  '/api/services',
  '/api/coupons',
  '/api/coupon-usages',
  '/api/payment-links',
  '/api/spaces',
  '/api/subscriptions',
  '/api/courses',
  '/api/media',
  '/api/graphql',
  '/api/internal',
  '/api/availability/occupancy',
];

const PUBLIC_PATH_PREFIXES = [
  '/api/webhooks',
  '/api/auth',
  '/api/availability',
  '/api/site',
  '/services',
  '/reservation',
  '/booking/success',
  '/booking/cancel',
  '/booking/status',
  '/nos-services',
  '/contact',
  '/legal',
];

function isPayloadPath(pathname: string): boolean {
  return PAYLOAD_BYPASS_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(prefix + '/'));
}

function isPublicRoute(pathname: string): boolean {
  if (
    pathname === '/' ||
    pathname === '/login' ||
    pathname === '/contact' ||
    pathname === '/conditions' ||
    pathname === '/confidentialite' ||
    pathname === '/favicon.ico'
  ) {
    return true;
  }
  return PUBLIC_PATH_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

function isProtectedRoute(pathname: string): boolean {
  return (
    pathname.startsWith('/profile') ||
    pathname.startsWith('/account') ||
    pathname.startsWith('/api/profile') ||
    pathname.startsWith('/planning') ||
    pathname.startsWith('/checkout')
  );
}

function hasAuthSession(req: NextRequest): boolean {
  return Boolean(req.cookies.get(AUTH_SESSION_COOKIE)?.value);
}

function unauthorized(req: NextRequest): NextResponse {
  if (req.nextUrl.pathname.startsWith('/api/')) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }
  const redirect = new URL('/login', req.url);
  redirect.searchParams.set('redirect', `${req.nextUrl.pathname}${req.nextUrl.search}`);
  return NextResponse.redirect(redirect);
}

function getRequestIp(req: NextRequest): string {
  const forwardedFor = req.headers.get('x-forwarded-for');
  if (forwardedFor) return forwardedFor.split(',')[0]?.trim() || 'unknown';
  return req.headers.get('x-real-ip') || 'unknown';
}

function isForgotPasswordRateLimited(req: NextRequest): boolean {
  const now = Date.now();
  const key = `${getRequestIp(req)}:forgot-password`;
  const timestamps = forgotPasswordRateLimitStore.get(key) || [];
  const recent = timestamps.filter((timestamp) => now - timestamp < FORGOT_PASSWORD_WINDOW_MS);

  if (recent.length >= FORGOT_PASSWORD_LIMIT) {
    forgotPasswordRateLimitStore.set(key, recent);
    return true;
  }

  recent.push(now);
  forgotPasswordRateLimitStore.set(key, recent);
  return false;
}

export default function middleware(req: NextRequest) {
  const pathname = new URL(req.url).pathname;
  const method = req.method;

  if (pathname === '/api/users/forgot-password' && method === 'POST' && isForgotPasswordRateLimited(req)) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.', code: 'RATE_LIMITED' },
      { status: 429 },
    );
  }

  // Let Payload CMS handle its own admin and REST API paths
  if (isPayloadPath(pathname)) {
    return NextResponse.next();
  }

  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  if (isProtectedRoute(pathname) && !hasAuthSession(req)) {
    return unauthorized(req);
  }

  if (pathname.startsWith('/api/bookings')) {
    const needsAuth =
      (pathname === '/api/bookings' && method === 'POST') ||
      pathname.includes('/checkout') ||
      pathname.includes('/retry-payment') ||
      pathname.includes('/cancel') ||
      pathname.startsWith('/api/bookings/me');
    if (needsAuth && !hasAuthSession(req)) {
      return unauthorized(req);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes (including webhooks)
    '/(api|trpc)(.*)',
  ],
};
