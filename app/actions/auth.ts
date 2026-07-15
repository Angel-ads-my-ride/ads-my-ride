"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { createSession, deleteSession, getSession } from "@/lib/session";
import { sendWelcomeEmail, sendNewAdvertiserToAdmin } from "@/lib/email";
import { fileToAvatarDataUri, ImageTooLargeError } from "@/lib/image";

type AuthState = { error?: string; success?: boolean } | undefined;

export async function registerCustomer(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const carBrand = formData.get("carBrand") as string;
  const carModel = formData.get("carModel") as string;

  if (!name || !email || !password) {
    return { error: "Tous les champs sont requis." };
  }
  if (password.length < 8) {
    return { error: "Le mot de passe doit faire au moins 8 caractères." };
  }

  try {
    const existing = await db.user.findUnique({ where: { email } });
    if (existing) {
      return { error: "Un compte existe déjà avec cet email." };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await db.user.create({
      data: { name, email, password: hashedPassword, role: "CUSTOMER", carBrand, carModel },
    });

    await createSession(user.id, user.role);
    sendWelcomeEmail(email, name).catch(() => null);
  } catch {
    return { error: "Une erreur est survenue. Veuillez réessayer." };
  }
  redirect("/dashboard");
}

export async function loginUser(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email et mot de passe requis." };
  }

  let role: string;
  try {
    const user = await db.user.findUnique({ where: { email } });
    if (
      !user ||
      (user.role !== "CUSTOMER" && user.role !== "ADVERTISER" && user.role !== "SUPER_ADMIN")
    ) {
      return { error: "Identifiants incorrects." };
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return { error: "Identifiants incorrects." };
    }

    await createSession(user.id, user.role);
    role = user.role;
  } catch {
    return { error: "Une erreur est survenue. Veuillez réessayer." };
  }

  if (role === "ADVERTISER") redirect("/advertiser/dashboard");
  if (role === "SUPER_ADMIN") redirect("/admin");
  redirect("/dashboard");
}

export async function registerAdvertiser(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const companyName = formData.get("companyName") as string;
  const siret = formData.get("siret") as string;

  if (!name || !email || !password || !companyName) {
    return { error: "Tous les champs sont requis." };
  }
  if (password.length < 8) {
    return { error: "Le mot de passe doit faire au moins 8 caractères." };
  }

  try {
    const existing = await db.user.findUnique({ where: { email } });
    if (existing) {
      return { error: "Un compte existe déjà avec cet email." };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await db.user.create({
      data: { name, email, password: hashedPassword, role: "ADVERTISER", companyName, siret },
    });

    await createSession(user.id, user.role);
    sendWelcomeEmail(email, name).catch(() => null);
    sendNewAdvertiserToAdmin(name, companyName, email).catch(() => null);
  } catch {
    return { error: "Une erreur est survenue. Veuillez réessayer." };
  }
  redirect("/advertiser/dashboard");
}

export async function logout() {
  await deleteSession();
  redirect("/");
}

export async function updateCustomerProfile(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  const session = await getSession();
  if (!session || session.role !== "CUSTOMER") redirect("/auth/login");

  const carBrand = (formData.get("carBrand") as string) || null;
  const carModel = (formData.get("carModel") as string) || null;
  const avatarFile = formData.get("avatarFile") as File | null;

  let avatarUrl: string | null | undefined;
  try {
    avatarUrl = await fileToAvatarDataUri(avatarFile);
  } catch (err) {
    return { error: err instanceof ImageTooLargeError ? err.message : "Image invalide." };
  }

  try {
    await db.user.update({
      where: { id: session.userId },
      data: { carBrand, carModel, ...(avatarUrl ? { avatarUrl } : {}) },
    });
  } catch {
    return { error: "Une erreur est survenue. Veuillez réessayer." };
  }
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/settings");
  return { success: true };
}

export async function updateAdvertiserProfile(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  const session = await getSession();
  if (!session || session.role !== "ADVERTISER") redirect("/auth/login");

  const companyName = formData.get("companyName") as string;
  const siret = (formData.get("siret") as string) || null;
  const avatarFile = formData.get("avatarFile") as File | null;

  if (!companyName) {
    return { error: "Le nom de l'entreprise est requis." };
  }

  let avatarUrl: string | null | undefined;
  try {
    avatarUrl = await fileToAvatarDataUri(avatarFile);
  } catch (err) {
    return { error: err instanceof ImageTooLargeError ? err.message : "Image invalide." };
  }

  try {
    await db.user.update({
      where: { id: session.userId },
      data: { companyName, siret, ...(avatarUrl ? { avatarUrl } : {}) },
    });
  } catch {
    return { error: "Une erreur est survenue. Veuillez réessayer." };
  }
  revalidatePath("/advertiser/dashboard");
  revalidatePath("/advertiser/dashboard/settings");
  return { success: true };
}

export async function deleteOwnAccount() {
  const session = await getSession();
  if (!session) redirect("/");

  await db.user.delete({ where: { id: session.userId } });
  await deleteSession();
  redirect("/");
}
