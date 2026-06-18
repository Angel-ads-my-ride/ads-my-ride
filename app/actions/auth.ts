"use server";

import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { createSession, deleteSession } from "@/lib/session";

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
  } catch {
    return { error: "Une erreur est survenue. Veuillez réessayer." };
  }
  redirect("/dashboard");
}

export async function loginCustomer(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email et mot de passe requis." };
  }

  try {
    const user = await db.user.findUnique({ where: { email } });
    if (!user || user.role !== "CUSTOMER") {
      return { error: "Identifiants incorrects." };
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return { error: "Identifiants incorrects." };
    }

    await createSession(user.id, user.role);
  } catch {
    return { error: "Une erreur est survenue. Veuillez réessayer." };
  }
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
  } catch {
    return { error: "Une erreur est survenue. Veuillez réessayer." };
  }
  redirect("/advertiser/dashboard");
}

export async function loginAdvertiser(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email et mot de passe requis." };
  }

  try {
    const user = await db.user.findUnique({ where: { email } });
    if (!user || user.role !== "ADVERTISER") {
      return { error: "Identifiants incorrects." };
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return { error: "Identifiants incorrects." };
    }

    await createSession(user.id, user.role);
  } catch {
    return { error: "Une erreur est survenue. Veuillez réessayer." };
  }
  redirect("/advertiser/dashboard");
}

export async function logout() {
  await deleteSession();
  redirect("/");
}
