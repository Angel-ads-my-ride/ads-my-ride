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
            <div style="width:36px;height:36px;background:#3f3f46;border-radius:10px;display:inline-flex;align-items:center;justify-content:center;">
              <span style="color:#fff;font-weight:800;font-size:16px;">A</span>
            </div>
            <span style="font-weight:800;font-size:18px;color:#111;">Ads <span style="color:#3f3f46;">My Ride</span></span>
          </div>
        </div>

        <h1 style="font-size:22px;font-weight:700;color:#111;margin:0 0 8px;">Bienvenue, ${name} 👋</h1>
        <p style="color:#6b7280;font-size:15px;line-height:1.6;margin:0 0 24px;">
          Ton compte Ads My Ride est créé. Tu peux dès maintenant parcourir les campagnes disponibles et postuler à celles compatibles avec ton véhicule.
        </p>

        <a href="${BASE_URL}/dashboard"
          style="display:inline-block;background:#3f3f46;color:#fff;font-weight:700;font-size:15px;padding:12px 28px;border-radius:12px;text-decoration:none;">
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

export async function sendAdSubmittedToAdmin(adTitle: string, advertiserName: string) {
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) return;
  await getResend().emails.send({
    from: FROM,
    to: adminEmail,
    subject: `Nouvelle annonce à valider : ${adTitle}`,
    html: `
      <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:32px 24px;background:#fff;">
        <div style="margin-bottom:24px;">
          <span style="font-weight:800;font-size:18px;color:#111;">Ads <span style="color:#3f3f46;">My Ride</span></span>
        </div>
        <h1 style="font-size:20px;font-weight:700;color:#111;margin:0 0 8px;">Nouvelle annonce soumise</h1>
        <p style="color:#6b7280;font-size:15px;line-height:1.6;margin:0 0 24px;">
          <strong>${advertiserName}</strong> a soumis une annonce en attente de validation :<br/>
          <strong style="color:#111;">${adTitle}</strong>
        </p>
        <a href="${BASE_URL}/admin/ads" style="display:inline-block;background:#3f3f46;color:#fff;font-weight:700;font-size:15px;padding:12px 28px;border-radius:12px;text-decoration:none;">
          Voir dans l'admin →
        </a>
      </div>
    `,
  });
}

export async function sendAdApproved(to: string, adTitle: string) {
  await getResend().emails.send({
    from: FROM,
    to,
    subject: `✓ Votre annonce est publiée : ${adTitle}`,
    html: `
      <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:32px 24px;background:#fff;">
        <div style="margin-bottom:24px;">
          <span style="font-weight:800;font-size:18px;color:#111;">Ads <span style="color:#3f3f46;">My Ride</span></span>
        </div>
        <h1 style="font-size:20px;font-weight:700;color:#111;margin:0 0 8px;">Annonce approuvée !</h1>
        <p style="color:#6b7280;font-size:15px;line-height:1.6;margin:0 0 24px;">
          Votre annonce <strong style="color:#111;">${adTitle}</strong> a été validée et est maintenant visible sur la plateforme.
        </p>
        <a href="${BASE_URL}/advertiser/dashboard" style="display:inline-block;background:#3f3f46;color:#fff;font-weight:700;font-size:15px;padding:12px 28px;border-radius:12px;text-decoration:none;">
          Voir mon dashboard →
        </a>
      </div>
    `,
  });
}

export async function sendAdRejected(to: string, adTitle: string, message: string) {
  await getResend().emails.send({
    from: FROM,
    to,
    subject: `Annonce refusée : ${adTitle}`,
    html: `
      <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:32px 24px;background:#fff;">
        <div style="margin-bottom:24px;">
          <span style="font-weight:800;font-size:18px;color:#111;">Ads <span style="color:#3f3f46;">My Ride</span></span>
        </div>
        <h1 style="font-size:20px;font-weight:700;color:#111;margin:0 0 8px;">Annonce refusée</h1>
        <p style="color:#6b7280;font-size:15px;line-height:1.6;margin:0 0 16px;">
          Votre annonce <strong style="color:#111;">${adTitle}</strong> n'a pas pu être approuvée.
        </p>
        <div style="background:#fef2f2;border:1px solid #fecaca;border-radius:12px;padding:16px;margin-bottom:24px;">
          <p style="color:#dc2626;font-size:14px;margin:0;"><strong>Motif :</strong> ${message}</p>
        </div>
        <a href="${BASE_URL}/advertiser/dashboard" style="display:inline-block;background:#3f3f46;color:#fff;font-weight:700;font-size:15px;padding:12px 28px;border-radius:12px;text-decoration:none;">
          Mon dashboard →
        </a>
      </div>
    `,
  });
}

export async function sendAdNeedsModification(to: string, adTitle: string, message: string) {
  await getResend().emails.send({
    from: FROM,
    to,
    subject: `Modifications demandées : ${adTitle}`,
    html: `
      <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:32px 24px;background:#fff;">
        <div style="margin-bottom:24px;">
          <span style="font-weight:800;font-size:18px;color:#111;">Ads <span style="color:#3f3f46;">My Ride</span></span>
        </div>
        <h1 style="font-size:20px;font-weight:700;color:#111;margin:0 0 8px;">Modifications demandées</h1>
        <p style="color:#6b7280;font-size:15px;line-height:1.6;margin:0 0 16px;">
          Votre annonce <strong style="color:#111;">${adTitle}</strong> nécessite des ajustements avant d'être publiée.
        </p>
        <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:12px;padding:16px;margin-bottom:24px;">
          <p style="color:#92400e;font-size:14px;margin:0;"><strong>Message de l'équipe :</strong> ${message}</p>
        </div>
        <a href="${BASE_URL}/advertiser/dashboard" style="display:inline-block;background:#3f3f46;color:#fff;font-weight:700;font-size:15px;padding:12px 28px;border-radius:12px;text-decoration:none;">
          Modifier mon annonce →
        </a>
      </div>
    `,
  });
}

export async function sendBookingAccepted(to: string, adTitle: string) {
  await getResend().emails.send({
    from: FROM,
    to,
    subject: `Candidature acceptée : ${adTitle}`,
    html: `
      <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:32px 24px;background:#fff;">
        <div style="margin-bottom:24px;">
          <span style="font-weight:800;font-size:18px;color:#111;">Ads <span style="color:#3f3f46;">My Ride</span></span>
        </div>
        <h1 style="font-size:20px;font-weight:700;color:#111;margin:0 0 8px;">Candidature acceptée ! 🎉</h1>
        <p style="color:#6b7280;font-size:15px;line-height:1.6;margin:0 0 24px;">
          Votre candidature pour <strong style="color:#111;">${adTitle}</strong> a été acceptée. L'annonceur va vous contacter prochainement.
        </p>
        <a href="${BASE_URL}/dashboard" style="display:inline-block;background:#3f3f46;color:#fff;font-weight:700;font-size:15px;padding:12px 28px;border-radius:12px;text-decoration:none;">
          Voir mon espace →
        </a>
      </div>
    `,
  });
}

export async function sendBookingRejected(to: string, adTitle: string) {
  await getResend().emails.send({
    from: FROM,
    to,
    subject: `Candidature non retenue : ${adTitle}`,
    html: `
      <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:32px 24px;background:#fff;">
        <div style="margin-bottom:24px;">
          <span style="font-weight:800;font-size:18px;color:#111;">Ads <span style="color:#3f3f46;">My Ride</span></span>
        </div>
        <h1 style="font-size:20px;font-weight:700;color:#111;margin:0 0 8px;">Candidature non retenue</h1>
        <p style="color:#6b7280;font-size:15px;line-height:1.6;margin:0 0 24px;">
          Votre candidature pour <strong style="color:#111;">${adTitle}</strong> n'a pas été retenue cette fois. Continuez à parcourir les annonces !
        </p>
        <a href="${BASE_URL}" style="display:inline-block;background:#3f3f46;color:#fff;font-weight:700;font-size:15px;padding:12px 28px;border-radius:12px;text-decoration:none;">
          Voir les annonces →
        </a>
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
            <div style="width:36px;height:36px;background:#3f3f46;border-radius:10px;display:inline-flex;align-items:center;justify-content:center;">
              <span style="color:#fff;font-weight:800;font-size:16px;">A</span>
            </div>
            <span style="font-weight:800;font-size:18px;color:#111;">Ads <span style="color:#3f3f46;">My Ride</span></span>
          </div>
        </div>

        <h1 style="font-size:22px;font-weight:700;color:#111;margin:0 0 8px;">Réinitialise ton mot de passe</h1>
        <p style="color:#6b7280;font-size:15px;line-height:1.6;margin:0 0 24px;">
          Tu as demandé à réinitialiser ton mot de passe. Clique sur le bouton ci-dessous — ce lien est valable <strong>1 heure</strong>.
        </p>

        <a href="${resetUrl}"
          style="display:inline-block;background:#3f3f46;color:#fff;font-weight:700;font-size:15px;padding:12px 28px;border-radius:12px;text-decoration:none;">
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
