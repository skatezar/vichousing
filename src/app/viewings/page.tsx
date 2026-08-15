import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";
import { Calendar, CheckCircle, XCircle, Clock } from "lucide-react";
import { ViewingActions } from "./ViewingActions";

export default async function ViewingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  if (!profile?.is_un_staff) redirect("/listings");

  const [{ data: myRequests }, { data: incomingRequests }] = await Promise.all([
    supabase
      .from("viewings")
      .select("*, listings(id, title, type, price, district, user_id)")
      .eq("requester_id", user.id)
      .order("proposed_date", { ascending: true }),
    supabase
      .from("viewings")
      .select("*, listings!inner(id, title, type, price, district, user_id), profiles(full_name, email, organization)")
      .eq("listings.user_id", user.id)
      .order("proposed_date", { ascending: true }),
  ]);

  const statusIcon = (status: string) => {
    if (status === "confirmed") return <CheckCircle size={14} className="text-green-500" />;
    if (status === "cancelled") return <XCircle size={14} className="text-red-400" />;
    return <Clock size={14} className="text-amber-500" />;
  };

  const statusClass = (status: string) =>
    status === "confirmed"
      ? "bg-green-50 text-green-700"
      : status === "cancelled"
      ? "bg-red-50 text-red-600"
      : "bg-amber-50 text-amber-700";

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="mb-8">
        <p className="stat-label mb-1">Viewing Schedule</p>
        <h1 className="font-serif text-3xl text-[var(--navy)]">Property Viewings</h1>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* My requests */}
        <div>
          <h2 className="font-serif text-xl text-[var(--navy)] mb-4">My Requests</h2>
          {!myRequests?.length ? (
            <div className="luxury-card rounded-sm p-8 text-center">
              <Calendar size={28} className="text-[var(--gold-dark)] mx-auto mb-3 opacity-40" />
              <p className="font-sans text-sm text-[var(--warm-gray)]">No viewing requests yet.</p>
              <Link href="/listings" className="btn-gold px-6 py-2 rounded-sm text-xs mt-4 inline-block">
                Browse Properties
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {(myRequests as any[]).map((v) => (
                <div key={v.id} className="luxury-card rounded-sm p-5">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <p className="font-sans text-sm font-semibold text-[var(--navy)]">
                        {v.listings?.title}
                      </p>
                      <p className="font-sans text-xs text-[var(--warm-gray)] mt-0.5">
                        {v.listings?.district}
                      </p>
                    </div>
                    <span className={`flex items-center gap-1.5 font-sans text-xs px-2.5 py-1 rounded-sm ${statusClass(v.status)}`}>
                      {statusIcon(v.status)}
                      {v.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[var(--warm-gray)]">
                    <Calendar size={13} />
                    <span className="font-sans text-sm">
                      {formatDate(v.proposed_date)} at {v.proposed_time}
                    </span>
                  </div>
                  {v.notes && (
                    <p className="font-sans text-xs text-[var(--warm-gray)] mt-2 italic">
                      Note: {v.notes}
                    </p>
                  )}
                  <Link
                    href={`/listings/${v.listings?.id}`}
                    className="font-sans text-xs text-[var(--gold-dark)] hover:underline mt-3 block"
                  >
                    View listing →
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Incoming requests (for my listings) */}
        <div>
          <h2 className="font-serif text-xl text-[var(--navy)] mb-4">Incoming Requests</h2>
          {!incomingRequests?.length ? (
            <div className="luxury-card rounded-sm p-8 text-center">
              <Calendar size={28} className="text-[var(--gold-dark)] mx-auto mb-3 opacity-40" />
              <p className="font-sans text-sm text-[var(--warm-gray)]">
                No incoming viewing requests for your listings.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {(incomingRequests as any[]).map((v) => (
                <div key={v.id} className="luxury-card rounded-sm p-5">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <p className="font-sans text-sm font-semibold text-[var(--navy)]">
                        {v.profiles?.full_name}
                      </p>
                      <p className="font-sans text-xs text-[var(--warm-gray)]">
                        {v.profiles?.organization} · {v.profiles?.email}
                      </p>
                    </div>
                    <span className={`flex items-center gap-1.5 font-sans text-xs px-2.5 py-1 rounded-sm ${statusClass(v.status)}`}>
                      {statusIcon(v.status)}
                      {v.status}
                    </span>
                  </div>
                  <p className="font-sans text-xs text-[var(--warm-gray)] mb-2">
                    For: <span className="text-[var(--navy)]">{v.listings?.title}</span>
                  </p>
                  <div className="flex items-center gap-2 text-[var(--warm-gray)] mb-3">
                    <Calendar size={13} />
                    <span className="font-sans text-sm">
                      {formatDate(v.proposed_date)} at {v.proposed_time}
                    </span>
                  </div>
                  {v.notes && (
                    <p className="font-sans text-xs italic text-[var(--warm-gray)] mb-3">
                      "{v.notes}"
                    </p>
                  )}
                  {v.status === "pending" && (
                    <ViewingActions viewingId={v.id} />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
