import { nodemailerAdapter } from '@payloadcms/email-nodemailer'

export function getPayloadEmailAdapter() {
  const fromAddress = process.env.EMAIL_FROM || process.env.SMTP_FROM_EMAIL
  const fromName = process.env.EMAIL_FROM_NAME || 'Fitbepad'
  const host = process.env.SMTP_HOST
  const port = Number(process.env.SMTP_PORT || 587)
  const secure = process.env.SMTP_SECURE === 'true'
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS

  if (!fromAddress) return undefined

  if (!host) {
    if (process.env.NODE_ENV === 'production') return undefined
    return nodemailerAdapter({
      defaultFromAddress: fromAddress,
      defaultFromName: fromName,
    })
  }

  return nodemailerAdapter({
    defaultFromAddress: fromAddress,
    defaultFromName: fromName,
    transportOptions: {
      host,
      port,
      secure,
      auth: user ? { user, pass } : undefined,
    },
  })
}
