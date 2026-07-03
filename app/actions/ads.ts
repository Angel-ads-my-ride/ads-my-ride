"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/session";
import { db } from "@/lib/db";
import { sendAdSubmittedToAdmin, sendBookingAccepted, sendBookingRejected } from "@/lib/email";
import { fileToAdImageDataUri, ImageTooLargeError } from "@/lib/image";

type AdState = { error?: string; success?: boolean; isDraft?: boolean } | undefined;

export async function saveAd(_prev: AdState, formData: FormData): Promise<AdState> {
  const session = await getSession();
  if (!session || session.role !== "ADVERTISER") return { error: "Non autorisé." };

  const adId = (formData.get("adId") as string) || null;
  const intent = formData.get("intent") as string; // "publish" | "draft"
  const isDraft = intent !== "publish";

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const pricePerDay = parseFloat(formData.get("pricePerDay") as string);
  const totalBudget = parseFloat(formData.get("totalBudget") as string);
  const imageFile = formData.get("imageFile") as File | null;
  const isConfidential = formData.get("isConfidential") === "true";
  const maxApplicants = formData.get("maxApplicants") ? parseInt(formData.get("maxApplicants") as string) : null;
  const autoAccept = formData.get("autoAccept") === "true";
  const eligibleModelsRaw = formData.get("eligibleModels") as string;
  const countriesRaw = formData.get("countries") as string;
  const vehicleConditionsRaw = formData.get("vehicleConditions") as string;
  const modelSelectionMode = (formData.get("modelSelectionMode") as string) === "MANUAL" ? "MANUAL" : "ALL_EXCEPT";

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

  if (!isDraft && modelSelectionMode === "MANUAL" && eligibleModels.length === 0) {
    return { error: "Sélectionnez au moins un modèle de véhicule éligible." };
  }

  let countries: string[] = [];
  try {
    countries = JSON.parse(countriesRaw || "[]");
  } catch {
    countries = [];
  }

  let vehicleConditions: string[] = [];
  try {
    vehicleConditions = JSON.parse(vehicleConditionsRaw || "[]");
  } catch {
    vehicleConditions = [];
  }

  let imageUrl: string | null = null;
  try {
    imageUrl = await fileToAdImageDataUri(imageFile);
  } catch (err) {
    return { error: err instanceof ImageTooLargeError ? err.message : "Image invalide." };
  }

  const status = isDraft ? "DRAFT" : "PENDING_REVIEW";

  let ad;
  if (adId) {
    const existing = await db.ad.findFirst({ where: { id: adId, advertiserId: session.userId } });
    if (!existing) return { error: "Annonce introuvable." };

    ad = await db.ad.update({
      where: { id: existing.id },
      data: {
        title,
        description,
        pricePerDay,
        totalBudget,
        remainingBudget: totalBudget,
        imageUrl: imageUrl || existing.imageUrl,
        isConfidential,
        maxApplicants,
        autoAccept,
        status,
        countries,
        vehicleConditions,
        modelSelectionMode,
      },
    });

    // No createMany/deleteMany (require a transaction) — replace models one by one.
    const oldModels = await db.adCarModel.findMany({ where: { adId: existing.id } });
    for (const m of oldModels) {
      await db.adCarModel.delete({ where: { id: m.id } });
    }
  } else {
    ad = await db.ad.create({
      data: {
        title,
        description,
        pricePerDay,
        totalBudget,
        remainingBudget: totalBudget,
        imageUrl: imageUrl || null,
        isConfidential,
        maxApplicants,
        autoAccept,
        status,
        countries,
        vehicleConditions,
        modelSelectionMode,
        isActive: false,
        advertiserId: session.userId,
      },
    });
  }

  for (const m of eligibleModels) {
    await db.adCarModel.create({ data: { adId: ad.id, brand: m.brand, model: m.model } });
  }

  if (!isDraft) {
    const advertiser = await db.user.findUnique({
      where: { id: session.userId },
      select: { name: true, companyName: true, email: true },
    });
    sendAdSubmittedToAdmin(title, advertiser?.name ?? "", advertiser?.companyName ?? null, advertiser?.email ?? "").catch(() => null);
  }

  revalidatePath("/advertiser/dashboard");
  return { success: true, isDraft };
}

export async function toggleAdActive(adId: string, newState: boolean) {
  const session = await getSession();
  if (!session || session.role !== "ADVERTISER") return;

  // updateMany requires a transaction, which the Neon HTTP driver doesn't support
  // once it actually has a row to update — verify ownership, then update by id.
  const ad = await db.ad.findFirst({ where: { id: adId, advertiserId: session.userId }, select: { id: true } });
  if (!ad) return;

  await db.ad.update({ where: { id: ad.id }, data: { isActive: newState } });

  revalidatePath("/advertiser/dashboard");
}

export async function deleteAd(adId: string) {
  const session = await getSession();
  if (!session || session.role !== "ADVERTISER") return;

  const ad = await db.ad.findFirst({ where: { id: adId, advertiserId: session.userId }, select: { id: true } });
  if (!ad) return;

  await db.ad.delete({ where: { id: ad.id } });

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

  const isListed = ad.eligibleModels.some(
    (m: { brand: string; model: string }) =>
      m.brand.toLowerCase() === user.carBrand!.toLowerCase() &&
      m.model.toLowerCase() === user.carModel!.toLowerCase()
  );
  // ALL_EXCEPT: every model is eligible unless listed (excluded).
  // MANUAL: only listed models are eligible.
  const isEligible = ad.modelSelectionMode === "MANUAL" ? isListed : !isListed;
  if (!isEligible) return { error: "Votre véhicule n'est pas éligible pour cette annonce." };

  if (ad.maxApplicants) {
    const bookingCount = await db.booking.count({
      where: { adId, status: { in: ["PENDING", "CONFIRMED"] } },
    });
    if (bookingCount >= ad.maxApplicants) return { error: "Plus de places disponibles pour cette annonce." };
  }

  const bookingStatus = ad.autoAccept ? "CONFIRMED" : "PENDING";

  await db.booking.create({
    data: { userId: session.userId, adId, status: bookingStatus, earnings: 0 },
  });

  revalidatePath("/dashboard");
  return { success: true };
}

export async function acceptBooking(bookingId: string) {
  const session = await getSession();
  if (!session || session.role !== "ADVERTISER") return;

  const booking = await db.booking.findUnique({
    where: { id: bookingId },
    include: { ad: { select: { advertiserId: true, title: true } }, user: { select: { email: true } } },
  });
  if (!booking || booking.ad.advertiserId !== session.userId) return;

  await db.booking.update({ where: { id: bookingId }, data: { status: "CONFIRMED" } });
  sendBookingAccepted(booking.user.email, booking.ad.title).catch(() => null);
  revalidatePath(`/advertiser/ads/${booking.adId}`);
}

export async function rejectBooking(bookingId: string) {
  const session = await getSession();
  if (!session || session.role !== "ADVERTISER") return;

  const booking = await db.booking.findUnique({
    where: { id: bookingId },
    include: { ad: { select: { advertiserId: true, title: true } }, user: { select: { email: true } } },
  });
  if (!booking || booking.ad.advertiserId !== session.userId) return;

  await db.booking.update({ where: { id: bookingId }, data: { status: "CANCELLED" } });
  sendBookingRejected(booking.user.email, booking.ad.title).catch(() => null);
  revalidatePath(`/advertiser/ads/${booking.adId}`);
}

export async function incrementViewCount(adId: string) {
  await db.ad.update({ where: { id: adId }, data: { viewCount: { increment: 1 } } });
}
