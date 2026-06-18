"use server";

import { randomBytes } from "crypto";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { sendPasswordResetEmail } from "@/lib/email";

type State = { error?: string; success?: boolean } | undefined;

export async function requestPasswordReset(_prev: State, formData: FormData): Promise<State> {
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  if (!email) return { error: "Email requis." };

  try {
    const user = await db.user.findUnique({ where: { email } });

    if (user) {
      await db.passwordResetToken.deleteMany({ where: { email } });

      const token = randomBytes(32).toString("hex");
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1h

      await db.passwordResetToken.create({ data: { email, token, expiresAt } });
      await sendPasswordResetEmail(email, token);
    }

    // Toujours retourner succès pour ne pas révéler si l'email existe
    return { success: true };
  } catch {
    return { error: "Une erreur est survenue. Veuillez réessayer." };
  }
}

export async function resetPassword(_prev: State, formData: FormData): Promise<State> {
  const token = formData.get("token") as string;
  const password = formData.get("password") as string;
  const confirm = formData.get("confirm") as string;

  if (!token) return { error: "Lien invalide." };
  if (!password || password.length < 8) return { error: "Le mot de passe doit faire au moins 8 caractères." };
  if (password !== confirm) return { error: "Les mots de passe ne correspondent pas." };

  try {
    const record = await db.passwordResetToken.findUnique({ where: { token } });

    if (!record || record.expiresAt < new Date()) {
      return { error: "Ce lien est expiré ou invalide. Faites une nouvelle demande." };
    }

    const hashed = await bcrypt.hash(password, 10);
    await db.user.update({ where: { email: record.email }, data: { password: hashed } });
    await db.passwordResetToken.delete({ where: { token } });

    return { success: true };
  } catch {
    return { error: "Une erreur est survenue. Veuillez réessayer." };
  }
}
