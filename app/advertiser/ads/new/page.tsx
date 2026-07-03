import { redirect } from "next/navigation";

export default function NewAdRedirect() {
  redirect("/advertiser/dashboard");
}
