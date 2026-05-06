import type { Endpoint } from 'payload'

type SocialLoginBody = {
  provider?: 'google'
  providerUserId?: string
  email?: string
  firstName?: string
  lastName?: string
  phone?: string
  avatarUrl?: string
  locale?: string
  timezone?: string
  createIfMissing?: boolean
}

function hasValidBridgeSecret(headers: Headers): boolean {
  const expected = process.env.BRIDGE_INTERNAL_SECRET
  if (!expected) return false
  const provided = headers.get('x-bridge-secret')
  return Boolean(provided) && provided === expected
}

function cleanString(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined
  const trimmed = value.trim()
  return trimmed || undefined
}

function normalizeLocale(locale?: string): 'en' | 'fr' {
  if (!locale) return 'fr'
  return locale.toLowerCase().startsWith('fr') ? 'fr' : 'en'
}

function toPublicIdentity(user: any, collection: 'users' | 'admins') {
  return {
    collection,
    id: String(user.id),
    email: user.email || '',
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    phone: user.phone || '',
    avatarUrl: user.avatarUrl || '',
    locale: user.locale || 'fr',
    timezone: user.timezone || 'UTC',
    isAdmin: collection === 'admins' || Boolean(user.isAdmin),
  }
}

async function findAdminByProviderId(req: any, providerUserId: string) {
  const result = await req.payload.find({
    collection: 'admins',
    depth: 0,
    limit: 1,
    overrideAccess: true,
    where: {
      authProviderUserId: {
        equals: providerUserId,
      },
    },
  })

  return result.docs[0] || null
}

async function findAdminByEmail(req: any, email: string) {
  const result = await req.payload.find({
    collection: 'admins',
    depth: 0,
    limit: 1,
    overrideAccess: true,
    where: {
      email: {
        equals: email,
      },
    },
  })

  return result.docs[0] || null
}

async function findUserByProviderId(req: any, providerUserId: string) {
  const result = await req.payload.find({
    collection: 'users',
    depth: 0,
    limit: 1,
    overrideAccess: true,
    where: {
      authProviderUserId: {
        equals: providerUserId,
      },
    },
  })

  return result.docs[0] || null
}

async function findUserByEmail(req: any, email: string) {
  const result = await req.payload.find({
    collection: 'users',
    depth: 0,
    limit: 1,
    overrideAccess: true,
    where: {
      email: {
        equals: email,
      },
    },
  })

  return result.docs[0] || null
}

export const bridgeUserResolveEndpoint: Endpoint = {
  path: '/internal/auth/social-login',
  method: 'post',
  handler: async (req) => {
    if (!hasValidBridgeSecret(req.headers)) {
      return Response.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    let body: SocialLoginBody
    try {
      body = (await req.json?.()) as SocialLoginBody
    } catch {
      return Response.json({ success: false, error: 'Invalid JSON body' }, { status: 400 })
    }

    const provider = body?.provider || 'google'
    const providerUserId = cleanString(body?.providerUserId)
    const email = cleanString(body?.email)?.toLowerCase()
    const createIfMissing = body?.createIfMissing !== false

    if (!providerUserId || !email) {
      return Response.json(
        { success: false, error: 'providerUserId and email are required' },
        { status: 400 },
      )
    }

    const userIdentityData = {
      authProvider: provider,
      authProviderUserId: providerUserId,
      email: email || undefined,
      firstName: cleanString(body?.firstName) || '',
      lastName: cleanString(body?.lastName) || '',
      phone: cleanString(body?.phone) || '',
      avatarUrl: cleanString(body?.avatarUrl) || '',
      locale: normalizeLocale(cleanString(body?.locale)),
      timezone: cleanString(body?.timezone) || 'UTC',
      emailVerifiedAt: new Date().toISOString(),
    }
    const adminIdentityData = {
      authProvider: provider,
      authProviderUserId: providerUserId,
      email,
      firstName: cleanString(body?.firstName) || '',
      lastName: cleanString(body?.lastName) || '',
      avatarUrl: cleanString(body?.avatarUrl) || '',
      lastSocialLoginAt: new Date().toISOString(),
    }

    const existingAdminByProvider = await findAdminByProviderId(req, providerUserId)
    if (existingAdminByProvider) {
      const updated = await req.payload.update({
        collection: 'admins',
        id: existingAdminByProvider.id,
        depth: 0,
        overrideAccess: true,
        data: {
          ...adminIdentityData,
          isActive: existingAdminByProvider.isActive ?? true,
        },
      })
      return Response.json({
        success: true,
        identity: toPublicIdentity(updated, 'admins'),
        source: 'provider',
      })
    }

    const existingAdminByEmail = await findAdminByEmail(req, email)
    if (existingAdminByEmail) {
      const updated = await req.payload.update({
        collection: 'admins',
        id: existingAdminByEmail.id,
        depth: 0,
        overrideAccess: true,
        data: {
          ...adminIdentityData,
          email,
          isActive: existingAdminByEmail.isActive ?? true,
        },
      })
      return Response.json({
        success: true,
        identity: toPublicIdentity(updated, 'admins'),
        source: 'email',
      })
    }

    const existingUserByProvider = await findUserByProviderId(req, providerUserId)
    if (existingUserByProvider) {
      const updated = await req.payload.update({
        collection: 'users',
        id: existingUserByProvider.id,
        depth: 0,
        overrideAccess: true,
        data: userIdentityData,
      })
      return Response.json({
        success: true,
        identity: toPublicIdentity(updated, 'users'),
        source: 'provider',
      })
    }

    const existingUserByEmail = await findUserByEmail(req, email)
    if (existingUserByEmail) {
      const updated = await req.payload.update({
        collection: 'users',
        id: existingUserByEmail.id,
        depth: 0,
        overrideAccess: true,
        data: {
          ...userIdentityData,
          email,
        },
      })
      return Response.json({
        success: true,
        identity: toPublicIdentity(updated, 'users'),
        source: 'email',
      })
    }

    if (!createIfMissing) {
      return Response.json({ success: true, identity: null, source: 'none' })
    }

    const created = await req.payload.create({
      collection: 'users',
      depth: 0,
      overrideAccess: true,
      data: {
        ...userIdentityData,
        email,
      },
    })

    return Response.json({
      success: true,
      identity: toPublicIdentity(created, 'users'),
      source: 'created',
    })
  },
}
