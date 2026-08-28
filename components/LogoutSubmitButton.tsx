"use client";

import { useFormStatus } from "react-dom";
import { LogOut } from "lucide-react";

type LogoutSubmitButtonProps = {
  label?: string;
  pendingLabel?: string;
  variant?: "sidebar" | "navbar";
};

export default function LogoutSubmitButton({
  label = "Déconnexion",
  pendingLabel = "Déconnexion…",
  variant = "sidebar",
}: LogoutSubmitButtonProps) {
  const { pending } = useFormStatus();
  const isSidebar = variant === "sidebar";

  return (
    <button
      type="submit"
      disabled={pending}
      aria-busy={pending}
      className={
        isSidebar
          ? "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-500 hover:text-red-600 hover:bg-red-50 transition-all duration-150 text-sm cursor-pointer active:scale-[0.98] disabled:cursor-wait disabled:opacity-70"
          : "inline-flex min-w-[116px] items-center justify-center text-sm text-gray-500 hover:text-red-600 border border-gray-300 hover:border-red-300 hover:bg-red-50 px-4 py-2 rounded-lg transition-all duration-150 font-medium cursor-pointer active:scale-[0.98] disabled:cursor-wait disabled:opacity-70"
      }
    >
      {isSidebar && <LogOut className={`w-4 h-4 ${pending ? "animate-pulse" : ""}`} />}
      {pending ? pendingLabel : label}
    </button>
  );
}
