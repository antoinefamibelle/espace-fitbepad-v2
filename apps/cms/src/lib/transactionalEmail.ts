type EmailClient = {
  sendEmail: (message: {
    to: string | string[]
    subject: string
    html: string
    text?: string
  }) => Promise<unknown>
}

import {
  renderBookingCreatedCustomerTemplate,
  renderBookingCreatedOwnerTemplate,
  renderBookingPaidCustomerTemplate,
  renderBookingPaidOwnerTemplate,
  renderContactCustomerTemplate,
  renderContactOwnerTemplate,
  renderSignupCustomerTemplate,
  renderSignupOwnerTemplate,
} from '../email-templates/transactional'

export type ContactEmailData = {
  firstName: string
  lastName: string
  email: string
  phone?: string
  question: string
}

export type BookingEmailData = {
  bookingId: string
  customerEmail: string
  customerName?: string
  startTimeIso?: string
  serviceName?: string
  coachName?: string
}

export type SignupEmailData = {
  email: string
  firstName?: string
  lastName?: string
  provider: 'password' | 'google'
}

export function getOwnerEmails(): string[] {
  const raw = process.env.OWNER_EMAILS || ''
  if (!raw.trim()) return []

  return [...new Set(raw.split(';').map((value) => value.trim().toLowerCase()).filter(Boolean))]
}

async function sendOwnerEmail(client: EmailClient, subject: string, html: string, text: string): Promise<void> {
  const owners = getOwnerEmails()
  if (!owners.length) return

  await client.sendEmail({
    to: owners,
    subject,
    html,
    text,
  })
}

async function safeSend(taskName: string, send: () => Promise<void>): Promise<void> {
  try {
    await send()
  } catch (error) {
    console.error(`[email:${taskName}]`, error)
  }
}

export async function sendContactOwnerNotification(client: EmailClient, data: ContactEmailData): Promise<void> {
  const template = renderContactOwnerTemplate(data)

  await safeSend('contact-owner', async () => {
    await sendOwnerEmail(client, template.subject, template.html, template.text)
  })
}

export async function sendContactCustomerConfirmation(client: EmailClient, data: ContactEmailData): Promise<void> {
  const template = renderContactCustomerTemplate(data)

  await safeSend('contact-customer', async () => {
    await client.sendEmail({
      to: data.email,
      subject: template.subject,
      html: template.html,
      text: template.text,
    })
  })
}

export async function sendBookingCreatedOwnerNotification(
  client: EmailClient,
  data: BookingEmailData,
): Promise<void> {
  const template = renderBookingCreatedOwnerTemplate(data)

  await safeSend('booking-created-owner', async () => {
    await sendOwnerEmail(client, template.subject, template.html, template.text)
  })
}

export async function sendBookingCreatedCustomerConfirmation(
  client: EmailClient,
  data: BookingEmailData,
): Promise<void> {
  const template = renderBookingCreatedCustomerTemplate(data)

  await safeSend('booking-created-customer', async () => {
    await client.sendEmail({
      to: data.customerEmail,
      subject: template.subject,
      html: template.html,
      text: template.text,
    })
  })
}

export async function sendBookingPaidOwnerNotification(client: EmailClient, data: BookingEmailData): Promise<void> {
  const template = renderBookingPaidOwnerTemplate(data)

  await safeSend('booking-paid-owner', async () => {
    await sendOwnerEmail(client, template.subject, template.html, template.text)
  })
}

export async function sendBookingPaidCustomerConfirmation(
  client: EmailClient,
  data: BookingEmailData,
): Promise<void> {
  const template = renderBookingPaidCustomerTemplate(data)

  await safeSend('booking-paid-customer', async () => {
    await client.sendEmail({
      to: data.customerEmail,
      subject: template.subject,
      html: template.html,
      text: template.text,
    })
  })
}

export async function sendSignupOwnerNotification(client: EmailClient, data: SignupEmailData): Promise<void> {
  const template = renderSignupOwnerTemplate(data)

  await safeSend('signup-owner', async () => {
    await sendOwnerEmail(client, template.subject, template.html, template.text)
  })
}

export async function sendSignupCustomerWelcome(client: EmailClient, data: SignupEmailData): Promise<void> {
  const template = renderSignupCustomerTemplate(data)

  await safeSend('signup-customer', async () => {
    await client.sendEmail({
      to: data.email,
      subject: template.subject,
      html: template.html,
      text: template.text,
    })
  })
}
