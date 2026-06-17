import { getSession } from "@/lib/session";
import Navbar from "@/components/Navbar";
import HomeClient from "@/components/HomeClient";
import { db } from "@/lib/db";

export default async function HomePage() {
  const session = await getSession();

  const ads = await db.ad
    .findMany({
      where: { isActive: true, remainingBudget: { gt: 0 } },
      include: {
        advertiser: { select: { name: true, companyName: true } },
        eligibleModels: true,
      },
      orderBy: { createdAt: "desc" },
    })
    .catch(() => []);

  let userCarBrand: string | null = null;
  let userCarModel: string | null = null;

  if (session?.userId) {
    const user = await db.user
      .findUnique({ where: { id: session.userId }, select: { carBrand: true, carModel: true } })
      .catch(() => null);
    userCarBrand = user?.carBrand ?? null;
    userCarModel = user?.carModel ?? null;
  }

  return (
    <>
      <Navbar role={session?.role} />
      <HomeClient
        ads={JSON.parse(JSON.stringify(ads))}
        initialBrand={userCarBrand}
        initialModel={userCarModel}
        isLoggedIn={!!session}
      />
    </>
  );
}
