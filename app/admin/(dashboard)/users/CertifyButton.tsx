"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { adminCertifyAdvertiser } from "@/app/actions/admin";

export default function CertifyButton({ userId }: { userId: string }) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function certify() {
    startTransition(async () => {
      await adminCertifyAdvertiser(userId);
      router.refresh();
    });
  }

  return (
    <button
      onClick={certify}
      disabled={pending}
      className="flex-shrink-0 flex items-center gap-1.5 text-xs text-green-700 hover:text-green-800 bg-green-50 hover:bg-green-100 border border-green-200 px-3 py-1.5 rounded-lg font-medium transition-colors disabled:opacity-50"
    >
      <ShieldCheck className="w-3.5 h-3.5" />
      {pending ? "…" : "Certifier"}
    </button>
  );
}
