"use client";

import { useState } from "react";
import { CheckCircle, XCircle } from "lucide-react";
import { acceptBooking, rejectBooking } from "@/app/actions/ads";

export default function BookingActions({ bookingId }: { bookingId: string }) {
  const [loading, setLoading] = useState<"accept" | "reject" | null>(null);
  const [done, setDone] = useState(false);

  async function handle(action: "accept" | "reject") {
    setLoading(action);
    if (action === "accept") await acceptBooking(bookingId);
    else await rejectBooking(bookingId);
    setDone(true);
    setLoading(null);
  }

  if (done) return null;

  return (
    <div className="flex gap-2 flex-shrink-0">
      <button
        onClick={() => handle("accept")}
        disabled={loading !== null}
        className="flex items-center gap-1 text-xs bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/20 px-2.5 py-1 rounded-lg transition-colors disabled:opacity-50"
      >
        <CheckCircle className="w-3.5 h-3.5" />
        {loading === "accept" ? "…" : "Accepter"}
      </button>
      <button
        onClick={() => handle("reject")}
        disabled={loading !== null}
        className="flex items-center gap-1 text-xs bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 px-2.5 py-1 rounded-lg transition-colors disabled:opacity-50"
      >
        <XCircle className="w-3.5 h-3.5" />
        {loading === "reject" ? "…" : "Refuser"}
      </button>
    </div>
  );
}
