"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { getSession, createSession } from "@/lib/session";
import { db } from "@/lib/db";
import { sendAdApproved, sendAdRejected, sendAdNeedsModification } from "@/lib/email";

type AuthState = { error?: string } | undefined;

export async function loginAdmin(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) return { error: "Email et mot de passe requis." };

  const user = await db.user.findUnique({ where: { email } });
  if (!user || user.role !== "SUPER_ADMIN") return { error: "Identifiants incorrects." };

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return { error: "Identifiants incorrects." };

  await createSession(user.id, user.role);
  redirect("/admin");
}

async function requireAdmin() {
  const session = await getSession();
  if (!session || session.role !== "SUPER_ADMIN") throw new Error("Non autorisé.");
  return session;
}

type ReviewDecision = "APPROVED" | "REJECTED" | "PENDING_MODIFICATION";

export async function reviewAd(adId: string, decision: ReviewDecision, message?: string) {
  await requireAdmin();

  const ad = await db.ad.findUnique({
    where: { id: adId },
    include: { advertiser: { select: { email: true, name: true } } },
  });
  if (!ad) throw new Error("Annonce introuvable.");

  await db.ad.update({
    where: { id: adId },
    data: {
      status: decision,
      adminMessage: message ?? null,
      isActive: decision === "APPROVED",
    },
  });

  if (decision === "APPROVED") {
    sendAdApproved(ad.advertiser.email, ad.title).catch(() => null);
  } else if (decision === "REJECTED") {
    sendAdRejected(ad.advertiser.email, ad.title, message ?? "").catch(() => null);
  } else if (decision === "PENDING_MODIFICATION") {
    sendAdNeedsModification(ad.advertiser.email, ad.title, message ?? "").catch(() => null);
  }

  revalidatePath("/admin/ads");
  revalidatePath(`/admin/ads/${adId}`);
}

export async function adminDeleteUser(userId: string) {
  await requireAdmin();
  await db.user.delete({ where: { id: userId } });
  revalidatePath("/admin/users");
}

export async function adminToggleUserRole(userId: string, newRole: string) {
  await requireAdmin();
  await db.user.update({ where: { id: userId }, data: { role: newRole } });
  revalidatePath("/admin/users");
}

export async function adminDeleteAd(adId: string) {
  await requireAdmin();
  await db.ad.delete({ where: { id: adId } });
  revalidatePath("/admin/ads");
}

export async function getAdminStats() {
  await requireAdmin();
  const [totalUsers, totalAds, pendingAds, totalBookings, totalViews] = await Promise.all([
    db.user.count(),
    db.ad.count(),
    db.ad.count({ where: { status: "PENDING_REVIEW" } }),
    db.booking.count(),
    db.ad.aggregate({ _sum: { viewCount: true } }),
  ]);
  return {
    totalUsers,
    totalAds,
    pendingAds,
    totalBookings,
    totalViews: totalViews._sum.viewCount ?? 0,
  };
}
