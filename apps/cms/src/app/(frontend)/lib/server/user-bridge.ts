import 'server-only';

import { getPayloadClient, PayloadRequestError } from './payload';

export interface SocialIdentityInput {
  provider: 'google';
  providerUserId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatarUrl?: string;
  locale?: string;
  timezone?: string;
}

export interface PayloadUser {
  id: string;
  collection?: 'users' | 'admins';
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatarUrl?: string;
  locale?: string;
  timezone?: string;
  address?: string;
  city?: string;
  zipCode?: string;
  isAdmin?: boolean;
}

export interface UpsertPayloadIdentityResult extends PayloadUser {
  wasCreated: boolean;
}

function normalizeLocale(locale?: string): 'fr' | 'en' {
  if (!locale) return 'fr';
  return locale.toLowerCase().startsWith('fr') ? 'fr' : 'en';
}

function toClientUser(user: any, collection: 'users' | 'admins'): PayloadUser {
  return {
    id: String(user.id),
    collection,
    email: user.email || '',
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    phone: user.phone || '',
    avatarUrl: user.avatarUrl || '',
    locale: user.locale || 'fr',
    timezone: user.timezone || 'UTC',
    address: user.address || '',
    city: user.city || '',
    zipCode: user.zipCode || '',
    isAdmin: collection === 'admins' || Boolean(user.isAdmin),
  };
}

export async function upsertPayloadIdentity(input: SocialIdentityInput): Promise<UpsertPayloadIdentityResult> {
  const payload = await getPayloadClient();
  const { provider, providerUserId, email } = input;
  const normalizedEmail = email.toLowerCase();

  const userIdentityData = {
    authProvider: provider,
    authProviderUserId: providerUserId,
    email: normalizedEmail,
    firstName: input.firstName || '',
    lastName: input.lastName || '',
    phone: input.phone || '',
    avatarUrl: input.avatarUrl || '',
    locale: normalizeLocale(input.locale),
    timezone: input.timezone || 'UTC',
    emailVerifiedAt: new Date().toISOString(),
  };

  const adminIdentityData = {
    authProvider: provider,
    authProviderUserId: providerUserId,
    email: normalizedEmail,
    firstName: input.firstName || '',
    lastName: input.lastName || '',
    avatarUrl: input.avatarUrl || '',
    lastSocialLoginAt: new Date().toISOString(),
  };

  // Check admins first — by providerId then by email
  const adminByProvider = await payload.find({
    collection: 'admins',
    depth: 0,
    limit: 1,
    overrideAccess: true,
    where: { authProviderUserId: { equals: providerUserId } },
  });
  if (adminByProvider.docs[0]) {
    const updated = await payload.update({
      collection: 'admins',
      id: adminByProvider.docs[0].id,
      depth: 0,
      overrideAccess: true,
      data: { ...adminIdentityData, isActive: adminByProvider.docs[0].isActive ?? true },
    });
    return { ...toClientUser(updated, 'admins'), wasCreated: false };
  }

  const adminByEmail = await payload.find({
    collection: 'admins',
    depth: 0,
    limit: 1,
    overrideAccess: true,
    where: { email: { equals: normalizedEmail } },
  });
  if (adminByEmail.docs[0]) {
    const updated = await payload.update({
      collection: 'admins',
      id: adminByEmail.docs[0].id,
      depth: 0,
      overrideAccess: true,
      data: { ...adminIdentityData, isActive: adminByEmail.docs[0].isActive ?? true },
    });
    return { ...toClientUser(updated, 'admins'), wasCreated: false };
  }

  // Check users — by providerId then by email
  const userByProvider = await payload.find({
    collection: 'users',
    depth: 0,
    limit: 1,
    overrideAccess: true,
    where: { authProviderUserId: { equals: providerUserId } },
  });
  if (userByProvider.docs[0]) {
    const updated = await payload.update({
      collection: 'users',
      id: userByProvider.docs[0].id,
      depth: 0,
      overrideAccess: true,
      data: userIdentityData,
    });
    return { ...toClientUser(updated, 'users'), wasCreated: false };
  }

  const userByEmail = await payload.find({
    collection: 'users',
    depth: 0,
    limit: 1,
    overrideAccess: true,
    where: { email: { equals: normalizedEmail } },
  });
  if (userByEmail.docs[0]) {
    const updated = await payload.update({
      collection: 'users',
      id: userByEmail.docs[0].id,
      depth: 0,
      overrideAccess: true,
      data: userIdentityData,
    });
    return { ...toClientUser(updated, 'users'), wasCreated: false };
  }

  // Create new user
  const created = await payload.create({
    collection: 'users',
    depth: 0,
    overrideAccess: true,
    data: userIdentityData,
  });
  return { ...toClientUser(created, 'users'), wasCreated: true };
}

export async function findPayloadUserById(userId: string): Promise<PayloadUser | null> {
  try {
    const payload = await getPayloadClient();
    const user = await payload.findByID({
      collection: 'users',
      id: userId,
      depth: 0,
      overrideAccess: true,
    });
    if (!user) return null;
    return toClientUser(user, 'users');
  } catch (error) {
    if (error instanceof PayloadRequestError && error.status === 404) return null;
    // Payload throws a NotFound error for missing docs — treat as null
    if (error instanceof Error && error.message?.toLowerCase().includes('not found')) return null;
    throw error;
  }
}
