type EmailTemplate = {
  subject: string
  html: string
  text: string
}

type ContactTemplateParams = {
  firstName: string
  lastName: string
  email: string
  phone?: string
  question: string
}

type BookingTemplateParams = {
  bookingId: string
  customerEmail: string
  customerName?: string
  startTimeIso?: string
  serviceName?: string
  coachName?: string
}

type SignupTemplateParams = {
  email: string
  firstName?: string
  lastName?: string
  provider: 'password' | 'google'
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

function formatName(firstName?: string, lastName?: string): string {
  const name = [firstName, lastName].filter(Boolean).join(' ').trim()
  return name || 'Client'
}

function providerLabel(provider: SignupTemplateParams['provider']): string {
  if (provider === 'google') return 'Google'
  return 'Email et mot de passe'
}

// ─── Shared layout ────────────────────────────────────────────────────────────

function renderLayout(params: {
  title: string
  subtitle?: string
  contentHtml: string
  footerNote?: string
}): string {
  const footerNote = params.footerNote || 'Email automatique · Ne pas répondre directement à ce message.'

  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(params.title)} — Fitbepad</title>
</head>
<body style="margin:0;padding:0;background:#f2f2f2;font-family:Arial,Helvetica,sans-serif;-webkit-font-smoothing:antialiased;">

  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
    <tr>
      <td align="center" style="padding:40px 16px;">

        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:600px;">

          <!-- Accent top bar -->
          <tr>
            <td style="background:#52ad77;height:4px;font-size:0;line-height:0;">&nbsp;</td>
          </tr>

          <!-- Header -->
          <tr>
            <td style="background:#1d1d1b;padding:28px 36px 24px;">
              <p style="margin:0 0 10px;font-size:10px;letter-spacing:5px;text-transform:uppercase;color:#52ad77;font-weight:700;">Fitbepad</p>
              <h1 style="margin:0;font-size:24px;font-weight:800;line-height:1.2;color:#ffffff;text-transform:uppercase;letter-spacing:-0.3px;">
                ${escapeHtml(params.title)}
              </h1>
              ${params.subtitle ? `<p style="margin:8px 0 0;font-size:13px;line-height:1.5;color:rgba(255,255,255,0.45);">${escapeHtml(params.subtitle)}</p>` : ''}
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background:#ffffff;padding:32px 36px 28px;">
              ${params.contentHtml}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f9f9f9;padding:18px 36px;border-top:1px solid #ebebeb;">
              <p style="margin:0;font-size:11px;line-height:1.6;color:#aaaaaa;">
                ${escapeHtml(footerNote)}<br/>
                <strong style="color:#888888;">Fitbepad</strong> · Fitness, Padel &amp; Bien-être
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>
  `
}

// ─── Components ───────────────────────────────────────────────────────────────

function renderInfoTable(items: Array<{ label: string; value: string }>): string {
  const rows = items
    .map(
      (item, index) => `
      <tr>
        <td style="padding:11px 0;border-bottom:1px solid #f0f0f0;font-size:11px;letter-spacing:0.8px;text-transform:uppercase;color:#999999;width:40%;vertical-align:top;">
          ${escapeHtml(item.label)}
        </td>
        <td style="padding:11px 0 11px 16px;border-bottom:1px solid #f0f0f0;font-size:13px;color:#1d1d1b;font-weight:600;vertical-align:top;">
          ${escapeHtml(item.value)}
        </td>
      </tr>
    `,
    )
    .join('')

  return `
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border-collapse:collapse;">
      ${rows}
    </table>
  `
}

function renderDivider(): string {
  return `
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:24px 0;">
      <tr>
        <td style="border-top:1px solid #ebebeb;font-size:0;line-height:0;">&nbsp;</td>
      </tr>
    </table>
  `
}

function renderCta(label: string, url: string): string {
  return `
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:24px 0 0;">
      <tr>
        <td style="background:#1d1d1b;">
          <a
            href="${url}"
            style="display:inline-block;padding:14px 28px;background:#1d1d1b;color:#ffffff;text-decoration:none;font-weight:700;font-size:12px;letter-spacing:1.5px;text-transform:uppercase;"
          >
            ${escapeHtml(label)}
          </a>
        </td>
      </tr>
    </table>
  `
}

function renderStatusBadge(label: string, color: string, textColor: string): string {
  return `<span style="display:inline-block;padding:3px 10px;background:${color};color:${textColor};font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;">${escapeHtml(label)}</span>`
}

// ─── Booking details block ─────────────────────────────────────────────────────

function renderBookingBlock(data: BookingTemplateParams): { html: string; text: string } {
  const items = [
    { label: 'Réservation', value: data.bookingId },
    { label: 'Service', value: data.serviceName || 'Non précisé' },
    { label: 'Coach', value: data.coachName || 'Non précisé' },
    { label: 'Date & Heure', value: data.startTimeIso || 'Non précisé' },
  ]

  return {
    html: `
      <p style="margin:0 0 12px;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:#999999;font-weight:700;">Détails du créneau</p>
      ${renderInfoTable(items)}
    `,
    text: items.map((i) => `${i.label}: ${i.value}`).join(', '),
  }
}

// ─── Templates ────────────────────────────────────────────────────────────────

export function renderContactOwnerTemplate(data: ContactTemplateParams): EmailTemplate {
  const fullName = formatName(data.firstName, data.lastName)

  const contentHtml = `
    <p style="margin:0 0 20px;font-size:14px;line-height:1.7;color:#555555;">
      Un visiteur a envoyé une demande via le formulaire de contact.
    </p>

    <p style="margin:0 0 12px;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:#999999;font-weight:700;">Contact</p>
    ${renderInfoTable([
      { label: 'Nom', value: fullName },
      { label: 'Email', value: data.email },
      { label: 'Téléphone', value: data.phone || 'Non renseigné' },
    ])}

    ${renderDivider()}

    <p style="margin:0 0 12px;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:#999999;font-weight:700;">Message</p>
    <p style="margin:0;font-size:14px;line-height:1.8;color:#1d1d1b;">${escapeHtml(data.question)}</p>
  `

  return {
    subject: `Nouveau message — ${fullName}`,
    html: renderLayout({
      title: 'Nouveau message',
      subtitle: 'Formulaire de contact',
      contentHtml,
    }),
    text: `Nouveau message de contact — Nom: ${fullName}, Email: ${data.email}, Téléphone: ${data.phone || 'Non renseigné'}, Message: ${data.question}`,
  }
}

export function renderContactCustomerTemplate(data: ContactTemplateParams): EmailTemplate {
  const fullName = formatName(data.firstName, data.lastName)

  const contentHtml = `
    <p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:#1d1d1b;font-weight:600;">Bonjour ${escapeHtml(fullName)},</p>
    <p style="margin:0 0 16px;font-size:14px;line-height:1.8;color:#555555;">
      Nous avons bien reçu votre message et nous vous remercions de nous avoir contactés.
    </p>
    <p style="margin:0 0 24px;font-size:14px;line-height:1.8;color:#555555;">
      Notre équipe reviendra vers vous dans les plus brefs délais.
    </p>
    ${renderDivider()}
    <p style="margin:0;font-size:13px;line-height:1.7;color:#888888;">
      À très bientôt chez Fitbepad.
    </p>
  `

  return {
    subject: 'Nous avons bien reçu votre message',
    html: renderLayout({
      title: 'Message reçu',
      subtitle: 'Nous vous répondons très vite',
      contentHtml,
    }),
    text: `Bonjour ${fullName}, nous avons bien reçu votre message et reviendrons vers vous rapidement.`,
  }
}

export function renderBookingCreatedOwnerTemplate(data: BookingTemplateParams): EmailTemplate {
  const block = renderBookingBlock(data)

  const contentHtml = `
    <p style="margin:0 0 20px;font-size:14px;line-height:1.7;color:#555555;">
      Une nouvelle réservation vient d'être créée et est en attente de paiement.
    </p>

    <p style="margin:0 0 12px;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:#999999;font-weight:700;">Client</p>
    ${renderInfoTable([
      { label: 'Nom', value: data.customerName || 'Non précisé' },
      { label: 'Email', value: data.customerEmail },
    ])}

    ${renderDivider()}

    ${block.html}
  `

  return {
    subject: 'Nouvelle réservation — En attente de paiement',
    html: renderLayout({
      title: 'Nouvelle réservation',
      subtitle: 'En attente de paiement',
      contentHtml,
    }),
    text: `Nouvelle réservation créée. Client: ${data.customerName || 'Non précisé'} (${data.customerEmail}). ${block.text}`,
  }
}

export function renderBookingCreatedCustomerTemplate(data: BookingTemplateParams): EmailTemplate {
  const block = renderBookingBlock(data)

  const contentHtml = `
    <p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:#1d1d1b;font-weight:600;">Bonjour ${escapeHtml(data.customerName || 'Client')},</p>
    <p style="margin:0 0 24px;font-size:14px;line-height:1.8;color:#555555;">
      Votre demande de réservation a bien été enregistrée. Vous recevrez une confirmation définitive dès que votre paiement aura été validé.
    </p>

    ${block.html}

    ${renderDivider()}

    <p style="margin:0;font-size:12px;line-height:1.7;color:#aaaaaa;">
      En cas de problème avec votre paiement, n'hésitez pas à nous contacter.
    </p>
  `

  return {
    subject: 'Votre réservation est enregistrée',
    html: renderLayout({
      title: 'Réservation enregistrée',
      subtitle: 'En attente de confirmation de paiement',
      contentHtml,
    }),
    text: `Votre demande de réservation est enregistrée. ${block.text}`,
  }
}

export function renderBookingPaidOwnerTemplate(data: BookingTemplateParams): EmailTemplate {
  const block = renderBookingBlock(data)

  const contentHtml = `
    <p style="margin:0 0 8px;font-size:14px;line-height:1.7;color:#555555;">
      Le paiement d'une réservation vient d'être confirmé.
    </p>
    <p style="margin:0 0 20px;">
      ${renderStatusBadge('Paiement validé', '#52ad77', '#1d1d1b')}
    </p>

    <p style="margin:0 0 12px;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:#999999;font-weight:700;">Client</p>
    ${renderInfoTable([
      { label: 'Nom', value: data.customerName || 'Non précisé' },
      { label: 'Email', value: data.customerEmail },
    ])}

    ${renderDivider()}

    ${block.html}
  `

  return {
    subject: 'Paiement confirmé — Réservation validée',
    html: renderLayout({
      title: 'Paiement confirmé',
      subtitle: 'La réservation est validée',
      contentHtml,
    }),
    text: `Paiement confirmé pour ${data.customerName || 'Non précisé'} (${data.customerEmail}). ${block.text}`,
  }
}

export function renderBookingPaidCustomerTemplate(data: BookingTemplateParams): EmailTemplate {
  const block = renderBookingBlock(data)

  const contentHtml = `
    <p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:#1d1d1b;font-weight:600;">Bonjour ${escapeHtml(data.customerName || 'Client')},</p>
    <p style="margin:0 0 8px;font-size:14px;line-height:1.8;color:#555555;">
      Votre paiement a été validé. Votre réservation est confirmée.
    </p>
    <p style="margin:0 0 24px;">
      ${renderStatusBadge('Réservation confirmée', '#52ad77', '#1d1d1b')}
    </p>

    ${block.html}

    ${renderDivider()}

    <p style="margin:0 0 8px;font-size:13px;line-height:1.7;color:#888888;">
      Annulation gratuite jusqu'à 24h avant la séance.
    </p>
    <p style="margin:0;font-size:13px;line-height:1.7;color:#888888;">
      À très bientôt sur nos courts et en salle.
    </p>
  `

  return {
    subject: 'Votre réservation est confirmée ✓',
    html: renderLayout({
      title: 'Réservation confirmée',
      subtitle: 'Paiement validé — À très bientôt',
      contentHtml,
    }),
    text: `Votre paiement est confirmé et votre réservation est validée. ${block.text}`,
  }
}

export function renderSignupOwnerTemplate(data: SignupTemplateParams): EmailTemplate {
  const fullName = formatName(data.firstName, data.lastName)

  const contentHtml = `
    <p style="margin:0 0 20px;font-size:14px;line-height:1.7;color:#555555;">
      Un nouveau compte vient d'être créé sur la plateforme.
    </p>

    <p style="margin:0 0 12px;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:#999999;font-weight:700;">Nouveau membre</p>
    ${renderInfoTable([
      { label: 'Nom', value: fullName },
      { label: 'Email', value: data.email },
      { label: 'Connexion', value: providerLabel(data.provider) },
    ])}
  `

  return {
    subject: `Nouveau membre — ${fullName}`,
    html: renderLayout({
      title: 'Nouveau membre',
      subtitle: 'Un compte vient d\'être créé',
      contentHtml,
    }),
    text: `Nouveau compte créé — Nom: ${fullName}, Email: ${data.email}, Méthode: ${providerLabel(data.provider)}.`,
  }
}

export function renderSignupCustomerTemplate(data: SignupTemplateParams): EmailTemplate {
  const fullName = formatName(data.firstName, data.lastName)

  const contentHtml = `
    <p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:#1d1d1b;font-weight:600;">Bienvenue ${escapeHtml(fullName)},</p>
    <p style="margin:0 0 16px;font-size:14px;line-height:1.8;color:#555555;">
      Votre compte Fitbepad a été créé avec succès. Vous pouvez dès maintenant réserver vos séances de fitness, padel ou bien-être.
    </p>

    ${renderDivider()}

    <p style="margin:0 0 12px;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:#999999;font-weight:700;">Votre espace membre</p>
    ${renderInfoTable([
      { label: 'Email', value: data.email },
      { label: 'Connexion', value: providerLabel(data.provider) },
    ])}

    ${renderDivider()}

    <p style="margin:0;font-size:13px;line-height:1.7;color:#888888;">
      À très bientôt chez Fitbepad.
    </p>
  `

  return {
    subject: 'Bienvenue chez Fitbepad',
    html: renderLayout({
      title: 'Bienvenue',
      subtitle: 'Votre compte est prêt',
      contentHtml,
    }),
    text: `Bonjour ${fullName}, votre compte Fitbepad a bien été créé. Bienvenue !`,
  }
}
