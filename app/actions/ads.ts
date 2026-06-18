"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/session";
import { db } from "@/lib/db";

type AdState = { error?: string; success?: boolean } | undefined;

export async function createAd(_prev: AdState, formData: FormData): Promise<AdState> {
  const session = await getSession();
  if (!session || session.role !== "ADVERTISER") return { error: "Non autorisé." };

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const pricePerDay = parseFloat(formData.get("pricePerDay") as string);
  const totalBudget = parseFloat(formData.get("totalBudget") as string);
  const imageUrl = formData.get("imageUrl") as string;
  const eligibleModelsRaw = formData.get("eligibleModels") as string;

  if (!title || !description || isNaN(pricePerDay) || isNaN(totalBudget)) {
    return { error: "Tous les champs obligatoires doivent être remplis." };
  }
  if (pricePerDay <= 0 || totalBudget <= 0) {
    return { error: "Les montants doivent être positifs." };
  }

  let eligibleModels: { brand: string; model: string }[] = [];
  try {
    eligibleModels = JSON.parse(eligibleModelsRaw || "[]");
  } catch {
    return { error: "Les modèles éligibles sont invalides." };
  }

  if (eligibleModels.length === 0) {
    return { error: "Sélectionnez au moins un modèle de véhicule éligible." };
  }

  await db.ad.create({
    data: {
      title,
      description,
      pricePerDay,
      totalBudget,
      remainingBudget: totalBudget,
      imageUrl: imageUrl || null,
      advertiserId: session.userId,
      eligibleModels: {
        create: eligibleModels,
      },
    },
  });

  revalidatePath("/advertiser/dashboard");
  redirect("/advertiser/dashboard");
}

export async function toggleAdActive(adId: string, newState: boolean) {
  const session = await getSession();
  if (!session || session.role !== "ADVERTISER") return;

  await db.ad.updateMany({
    where: { id: adId, advertiserId: session.userId },
    data: { isActive: newState },
  });

  revalidatePath("/advertiser/dashboard");
}

export async function deleteAd(adId: string) {
  const session = await getSession();
  if (!session || session.role !== "ADVERTISER") return;

  await db.ad.deleteMany({
    where: { id: adId, advertiserId: session.userId },
  });

  revalidatePath("/advertiser/dashboard");
}

export async function applyToAd(_prev: AdState, formData: FormData): Promise<AdState> {
  const session = await getSession();
  if (!session || session.role !== "CUSTOMER") return { error: "Vous devez être connecté en tant que conducteur." };

  const adId = formData.get("adId") as string;
  if (!adId) return { error: "Annonce invalide." };

  const existing = await db.booking.findFirst({
    where: { userId: session.userId, adId },
  });
  if (existing) return { error: "Vous avez déjà candidaté pour cette annonce." };

  const ad = await db.ad.findUnique({
    where: { id: adId },
    include: { eligibleModels: true },
  });
  if (!ad || !ad.isActive || ad.remainingBudget <= 0) {
    return { error: "Cette annonce n'est plus disponible." };
  }

  const user = await db.user.findUnique({ where: { id: session.userId } });
  if (!user?.carBrand || !user?.carModel) {
    return { error: "Veuillez renseigner votre véhicule dans votre profil avant de candidater." };
  }

  const isEligible = ad.eligibleModels.some(
    (m: { brand: string; model: string }) =>
      m.brand.toLowerCase() === user.carBrand!.toLowerCase() &&
      m.model.toLowerCase() === user.carModel!.toLowerCase()
  );

  if (!isEligible) {
    return { error: "Votre véhicule n'est pas éligible pour cette annonce." };
  }

  await db.booking.create({
    data: {
      userId: session.userId,
      adId,
      status: "PENDING",
      earnings: 0,
    },
  });

  revalidatePath("/dashboard");
  return { success: true };
}
