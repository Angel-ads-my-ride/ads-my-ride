import { deleteSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export async function POST(_req: NextRequest) {
  await deleteSession();
  return Response.redirect(new URL("/", _req.url));
}
