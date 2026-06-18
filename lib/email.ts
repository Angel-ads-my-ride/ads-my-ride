import { Resend } from "resend";

const FROM = "Ads My Ride <noreply@adsmyride.com>";
const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://adsmyride.com";

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

export async function sendWelcomeEmail(to: string, name: string) {
  await getResend().emails.send({
    from: FROM,
    to,
    subject: "Bienvenue sur Ads My Ride 🚗",
    html: `
      <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:32px 24px;background:#fff;">
        <div style="text-align:center;margin-bottom:32px;">
          <div style="display:inline-flex;align-items:center;gap:8px;">
            <div style="width:36px;height:36px;background:#f97316;border-radius:10px;display:inline-flex;align-items:center;justify-content:center;">
              <span style="color:#fff;font-weight:800;font-size:16px;">A</span>
            </div>
            <span style="font-weight:800;font-size:18px;color:#111;">Ads <span style="color:#f97316;">My Ride</span></span>
          </div>
        </div>

        <h1 style="font-size:22px;font-weight:700;color:#111;margin:0 0 8px;">Bienvenue, ${name} 👋</h1>
        <p style="color:#6b7280;font-size:15px;line-height:1.6;margin:0 0 24px;">
          Ton compte Ads My Ride est créé. Tu peux dès maintenant parcourir les campagnes disponibles et postuler à celles compatibles avec ton véhicule.
        </p>

        <a href="${BASE_URL}/dashboard"
          style="display:inline-block;background:#f97316;color:#fff;font-weight:700;font-size:15px;padding:12px 28px;border-radius:12px;text-decoration:none;">
          Accéder à mon espace →
        </a>

        <hr style="border:none;border-top:1px solid #f3f4f6;margin:32px 0;" />
        <p style="color:#9ca3af;font-size:12px;margin:0;">
          Si tu n'es pas à l'origine de cette inscription, ignore cet email.
        </p>
      </div>
    `,
  });
}

export async function sendPasswordResetEmail(to: string, token: string) {
  const resetUrl = `${BASE_URL}/auth/reset-password?token=${token}`;

  await getResend().emails.send({
    from: FROM,
    to,
    subject: "Réinitialisation de ton mot de passe",
    html: `
      <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:32px 24px;background:#fff;">
        <div style="text-align:center;margin-bottom:32px;">
          <div style="display:inline-flex;align-items:center;gap:8px;">
            <div style="width:36px;height:36px;background:#f97316;border-radius:10px;display:inline-flex;align-items:center;justify-content:center;">
              <span style="color:#fff;font-weight:800;font-size:16px;">A</span>
            </div>
            <span style="font-weight:800;font-size:18px;color:#111;">Ads <span style="color:#f97316;">My Ride</span></span>
          </div>
        </div>

        <h1 style="font-size:22px;font-weight:700;color:#111;margin:0 0 8px;">Réinitialise ton mot de passe</h1>
        <p style="color:#6b7280;font-size:15px;line-height:1.6;margin:0 0 24px;">
          Tu as demandé à réinitialiser ton mot de passe. Clique sur le bouton ci-dessous — ce lien est valable <strong>1 heure</strong>.
        </p>

        <a href="${resetUrl}"
          style="display:inline-block;background:#f97316;color:#fff;font-weight:700;font-size:15px;padding:12px 28px;border-radius:12px;text-decoration:none;">
          Réinitialiser mon mot de passe →
        </a>

        <hr style="border:none;border-top:1px solid #f3f4f6;margin:32px 0;" />
        <p style="color:#9ca3af;font-size:12px;margin:0;">
          Si tu n'as pas demandé de réinitialisation, ignore cet email. Ton mot de passe ne sera pas modifié.
        </p>
      </div>
    `,
  });
}
