import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { createMobileToken } from "@/lib/session";

export async function POST(request: Request) {
  let body: { email?: unknown; password?: unknown };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Requête invalide." }, { status: 400 });
  }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";
  if (!email || !password) {
    return Response.json({ error: "Email et mot de passe requis." }, { status: 400 });
  }

  const user = await db.user.findUnique({
    where: { email },
    select: {
      id: true,
      password: true,
      role: true,
      name: true,
      email: true,
      carBrand: true,
      carModel: true,
      earnings: true,
      mobileOnboardingCompletedAt: true,
    },
  });
  if (!user || user.role !== "CUSTOMER" || !(await bcrypt.compare(password, user.password))) {
    return Response.json({ error: "Identifiants incorrects." }, { status: 401 });
  }

  const token = await createMobileToken(user.id, user.role);
  return Response.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      carBrand: user.carBrand,
      carModel: user.carModel,
      earnings: user.earnings,
      mobileOnboardingCompletedAt: user.mobileOnboardingCompletedAt,
    },
  });
}
