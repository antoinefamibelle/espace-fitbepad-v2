import 'server-only';

import type { NextRequest } from 'next/server';

import { getAuthenticatedIdentityFromRequest } from './auth-session';
import { findPayloadUserById, type PayloadUser } from './user-bridge';

export async function getAuthenticatedPayloadUser(request: NextRequest): Promise<PayloadUser | null> {
  const identity = getAuthenticatedIdentityFromRequest(request);
  if (!identity) return null;

  if (identity.collection === 'admins') {
    return {
      id: identity.id,
      collection: 'admins',
      email: identity.email,
      firstName: identity.firstName,
      lastName: identity.lastName,
      avatarUrl: identity.avatarUrl,
      isAdmin: true,
    };
  }

  const user = await findPayloadUserById(identity.id);
  if (!user) return null;
  return {
    ...user,
    collection: 'users',
  };
}
