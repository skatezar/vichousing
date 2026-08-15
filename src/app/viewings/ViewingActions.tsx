"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { CheckCircle, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export function ViewingActions({ viewingId }: { viewingId: string }) {
  const supabase = createClient();
  const router = useRouter();
  const [loading, setLoading] = useState<"confirm" | "cancel" | null>(null);

  async function update(status: "confirmed" | "cancelled") {
    setLoading(status === "confirmed" ? "confirm" : "cancel");
    await supabase.from("viewings").update({ status }).eq("id", viewingId);
    setLoading(null);
    router.refresh();
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={() => update("confirmed")}
        disabled={!!loading}
        className="flex items-center gap-1.5 flex-1 justify-center py-2 rounded-sm bg-green-50 text-green-700 font-sans text-xs font-semibold hover:bg-green-100 transition-colors disabled:opacity-60"
      >
        <CheckCircle size={13} />
        {loading === "confirm" ? "Confirming..." : "Confirm"}
      </button>
      <button
        onClick={() => update("cancelled")}
        disabled={!!loading}
        className="flex items-center gap-1.5 flex-1 justify-center py-2 rounded-sm bg-red-50 text-red-600 font-sans text-xs font-semibold hover:bg-red-100 transition-colors disabled:opacity-60"
      >
        <XCircle size={13} />
        {loading === "cancel" ? "Declining..." : "Decline"}
      </button>
    </div>
  );
}
