import { NextResponse } from "next/server";
import { getFranceFuelPrice } from "@/lib/fuel-prices";

export const revalidate = 900;

export async function GET() {
  return NextResponse.json(await getFranceFuelPrice(revalidate));
}
