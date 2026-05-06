import crypto from 'crypto'

export type SessionIdentity = {
  id: string
  email: string
  collection: 'users' | 'admins'
}

function base64UrlDecode(value: string): string {
  return Buffer.from(value, 'base64url').toString('utf8')
}

function sign(payloadB64: string): string {
  const secret = process.env.AUTH_SESSION_SECRET || process.env.PAYLOAD_SECRET
  if (!secret) return ''

  const hmac = crypto.createHmac('sha256', secret)
  hmac.update(payloadB64)
  return hmac.digest('base64url')
}

export function parseCookieHeader(header: string | null): Record<string, string> {
  if (!header) return {}

  return header.split(';').reduce<Record<string, string>>((acc, part) => {
    const [rawKey, ...rawValue] = part.trim().split('=')
    const key = rawKey?.trim()
    if (!key) return acc
    acc[key] = decodeURIComponent(rawValue.join('=').trim())
    return acc
  }, {})
}

export function verifySessionToken(token: string | undefined): SessionIdentity | null {
  if (!token) return null

  const [payloadB64, signature] = token.split('.')
  if (!payloadB64 || !signature) return null
  if (sign(payloadB64) !== signature) return null

  try {
    const parsed = JSON.parse(base64UrlDecode(payloadB64)) as {
      id?: string
      email?: string
      collection?: 'users' | 'admins'
      exp?: number
    }

    if (!parsed.id || !parsed.email || !parsed.collection || !parsed.exp) return null
    if (parsed.exp <= Math.floor(Date.now() / 1000)) return null

    return {
      id: parsed.id,
      email: parsed.email,
      collection: parsed.collection,
    }
  } catch {
    return null
  }
}
