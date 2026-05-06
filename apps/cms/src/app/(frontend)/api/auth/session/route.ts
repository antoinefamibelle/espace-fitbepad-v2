import { NextRequest, NextResponse } from 'next/server';

import { getAuthTokenFromRequest, getAuthenticatedIdentityFromRequest } from '@frontend/lib/server/auth-session';

export async function GET(request: NextRequest) {
  const identity = getAuthenticatedIdentityFromRequest(request);

  if (!identity) {
    return NextResponse.json({
      authenticated: false,
      user: null,
      token: null,
    });
  }

  return NextResponse.json({
    authenticated: true,
    user: identity,
    token: getAuthTokenFromRequest(request),
  });
}
