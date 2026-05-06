import 'server-only';
import nodemailer from 'nodemailer';

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

function createTransport() {
  if (process.env.MAILJET_API_KEY && process.env.MAILJET_API_SECRET) {
    return nodemailer.createTransport({
      host: 'in-v3.mailjet.com',
      port: 587,
      auth: {
        user: process.env.MAILJET_API_KEY,
        pass: process.env.MAILJET_API_SECRET,
      },
    });
  }

  if (process.env.SMTP_HOST) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === 'true',
      auth: process.env.SMTP_USER
        ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
        : undefined,
    });
  }

  // Fallback to ethereal/test transport in development
  return nodemailer.createTransport({ jsonTransport: true });
}

export async function sendEmail({ to, subject, html, from }: SendEmailOptions): Promise<void> {
  const transport = createTransport();
  const defaultFrom = process.env.EMAIL_FROM || process.env.CONTACT_EMAIL || 'noreply@fitbepad.fr';

  await transport.sendMail({
    from: from || defaultFrom,
    to,
    subject,
    html,
  });
}
