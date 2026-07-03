import { redirect } from "next/navigation";

export default function AdvertiserLoginRedirect() {
  redirect("/auth/login");
}
