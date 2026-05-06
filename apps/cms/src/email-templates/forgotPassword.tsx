type ForgotPasswordTemplateParams = {
  resetUrl: string
  firstName?: string | null
}

export function renderForgotPasswordEmail({
  resetUrl,
  firstName,
}: ForgotPasswordTemplateParams): string {
  const greeting = firstName?.trim() ? `Bonjour ${firstName.trim()},` : 'Bonjour,'

  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Réinitialisation du mot de passe — Fitbepad</title>
</head>
<body style="margin:0;padding:0;background:#f2f2f2;font-family:Arial,Helvetica,sans-serif;-webkit-font-smoothing:antialiased;">

  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
    <tr>
      <td align="center" style="padding:40px 16px;">

        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:560px;">

          <!-- Accent top bar -->
          <tr>
            <td style="background:#52ad77;height:4px;font-size:0;line-height:0;">&nbsp;</td>
          </tr>

          <!-- Header -->
          <tr>
            <td style="background:#1d1d1b;padding:32px 36px 28px;">
              <p style="margin:0 0 10px;font-size:10px;letter-spacing:5px;text-transform:uppercase;color:#52ad77;font-weight:700;">Fitbepad</p>
              <h1 style="margin:0;font-size:26px;font-weight:800;line-height:1.15;color:#ffffff;text-transform:uppercase;letter-spacing:-0.5px;">
                Réinitialisation<br/>du mot de passe
              </h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background:#ffffff;padding:36px 36px 24px;">
              <p style="margin:0 0 18px;font-size:15px;line-height:1.7;color:#1d1d1b;font-weight:600;">${greeting}</p>
              <p style="margin:0 0 24px;font-size:14px;line-height:1.8;color:#555555;">
                Vous avez demandé la réinitialisation de votre mot de passe Fitbepad.
                Cliquez sur le bouton ci-dessous pour choisir un nouveau mot de passe.
              </p>

              <!-- CTA button -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td style="background:#1d1d1b;">
                    <a
                      href="${resetUrl}"
                      style="display:inline-block;padding:14px 28px;background:#1d1d1b;color:#ffffff;text-decoration:none;font-weight:700;font-size:13px;letter-spacing:1.5px;text-transform:uppercase;"
                    >
                      Réinitialiser mon mot de passe
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Divider -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-top:32px;">
                <tr>
                  <td style="border-top:1px solid #ebebeb;font-size:0;line-height:0;">&nbsp;</td>
                </tr>
              </table>

              <p style="margin:20px 0 8px;font-size:12px;line-height:1.7;color:#888888;">
                Ce lien est valable <strong style="color:#1d1d1b;">1 heure</strong> et ne peut être utilisé qu'une seule fois.
              </p>
              <p style="margin:0;font-size:12px;line-height:1.7;color:#888888;">
                Si vous n'êtes pas à l'origine de cette demande, ignorez simplement cet email — votre mot de passe ne sera pas modifié.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f9f9f9;padding:20px 36px;border-top:1px solid #ebebeb;">
              <p style="margin:0;font-size:11px;line-height:1.6;color:#aaaaaa;">
                Email automatique · <strong style="color:#888888;">Fitbepad</strong> · Fitness, Padel &amp; Bien-être<br/>
                Merci de ne pas répondre directement à ce message.
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
