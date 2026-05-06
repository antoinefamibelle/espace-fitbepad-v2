import type { Endpoint } from 'payload'

import { sendContactCustomerConfirmation, sendContactOwnerNotification } from '../lib/transactionalEmail'

type ContactBody = {
  firstName?: unknown
  lastName?: unknown
  name?: unknown
  email?: unknown
  phone?: unknown
  question?: unknown
  message?: unknown
}

function asString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : ''
}

function splitName(name: string): { firstName: string; lastName: string } {
  const parts = name.split(/\s+/).filter(Boolean)
  if (!parts.length) return { firstName: '', lastName: '' }
  if (parts.length === 1) return { firstName: parts[0], lastName: '' }
  return { firstName: parts[0], lastName: parts.slice(1).join(' ') }
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

export const contactEndpoint: Endpoint = {
  path: '/contact',
  method: 'post',
  handler: async (req) => {
    const body = ((await req.json?.()) || {}) as ContactBody

    const email = asString(body.email).toLowerCase()
    const phone = asString(body.phone)
    const question = asString(body.question) || asString(body.message)
    const firstName = asString(body.firstName)
    const lastName = asString(body.lastName)
    const fallbackName = splitName(asString(body.name))
    const resolvedFirstName = firstName || fallbackName.firstName
    const resolvedLastName = lastName || fallbackName.lastName

    if (!email || !isValidEmail(email)) {
      return Response.json({ success: false, error: 'Invalid email address' }, { status: 400 })
    }

    if (!resolvedFirstName || !resolvedLastName || !question) {
      return Response.json(
        { success: false, error: 'firstName, lastName and question are required' },
        { status: 400 },
      )
    }

    await sendContactOwnerNotification(req.payload, {
      firstName: resolvedFirstName,
      lastName: resolvedLastName,
      email,
      phone: phone || undefined,
      question,
    })
    await sendContactCustomerConfirmation(req.payload, {
      firstName: resolvedFirstName,
      lastName: resolvedLastName,
      email,
      phone: phone || undefined,
      question,
    })

    return Response.json({
      success: true,
      message: 'Votre message a ete envoye avec succes.',
    })
  },
}
