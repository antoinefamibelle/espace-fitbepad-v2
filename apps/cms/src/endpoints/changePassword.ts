import { z } from 'zod'
import type { Endpoint } from 'payload'

import { AUTH_SESSION_COOKIE } from '../app/(frontend)/lib/auth/constants'
import { parseCookieHeader, verifySessionToken } from '../lib/authSession'
import { validatePasswordStrength } from '../lib/password'

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(1),
})

function errorResponse(status: number, error: string, code: string) {
  return Response.json({ error, code }, { status })
}

export async function parseChangePasswordBody(req: Parameters<Endpoint['handler']>[0]) {
  const body = await req.json?.().catch(() => null)
  const parsed = changePasswordSchema.safeParse(body)
  if (!parsed.success) return null
  return parsed.data
}

export const changePasswordEndpoint: Endpoint = {
  path: '/users/change-password',
  method: 'post',
  handler: async (req) => {
    const cookies = parseCookieHeader(req.headers.get('cookie'))
    const identity = verifySessionToken(cookies[AUTH_SESSION_COOKIE])
    if (!identity || identity.collection !== 'users') {
      return errorResponse(401, 'Unauthorized', 'UNAUTHORIZED')
    }

    const parsedBody = await parseChangePasswordBody(req)
    if (!parsedBody) {
      return errorResponse(400, 'Invalid request body', 'VALIDATION_ERROR')
    }

    const passwordError = validatePasswordStrength(parsedBody.newPassword)
    if (passwordError) {
      return errorResponse(400, passwordError, 'WEAK_PASSWORD')
    }

    const loginResult = await req.payload
      .login({
        collection: 'users',
        data: {
          email: identity.email,
          password: parsedBody.currentPassword,
        },
      })
      .catch(() => null)

    if (!loginResult?.user) {
      return errorResponse(400, 'Current password is incorrect', 'INVALID_CURRENT_PASSWORD')
    }

    await req.payload.update({
      collection: 'users',
      id: identity.id,
      overrideAccess: true,
      req,
      data: {
        password: parsedBody.newPassword,
      },
    })

    return Response.json({ success: true })
  },
}
