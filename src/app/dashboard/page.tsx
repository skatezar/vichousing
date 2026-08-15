import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatPrice, formatDate } from "@/lib/utils";
import { Plus, Calendar, MessageCircle, Building2, Shield, Edit } from "lucide-react";
import type { Listing, Viewing } from "@/lib/types";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const [{ data: profile }, { data: myListings }, { data: myViewings }, { data: myConvos }] =
    await Promise.all([
      supabase.from("profiles").select("*").eq("id", user.id).single(),
      supabase.from("listings").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
      supabase.from("viewings").select("*, listings(title, type, price, district)").eq("requester_id", user.id).order("proposed_date", { ascending: true }),
      supabase.from("conversations").select("*, listings(title), messages(content, created_at)").or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`).order("created_at", { ascending: false }),
    ]);

  const activeListings = (myListings || []).filter((l: any) => l.status === "active");
  const pendingViewings = (myViewings || []).filter((v: any) => v.status === "pending");

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="flex items-start justify-between mb-10">
        <div>
          <p className="stat-label mb-1">Welcome back</p>
          <h1 className="font-serif text-3xl text-[var(--navy)]">
            {profile?.full_name || "Your Dashboard"}
          </h1>
          <div className="flex items-center gap-3 mt-2">
            <span className={`org-badge badge-${(profile?.organization || "other").toLowerCase()}`}>
              {profile?.organization}
            </span>
            {profile?.is_un_staff && (
              <span className="flex items-center gap-1 font-sans text-xs text-green-600">
                <Shield size={12} />
                UN Staff Verified
              </span>
            )}
          </div>
        </div>
        <Link href="/listings/new" className="btn-gold px-5 py-3 rounded-sm text-sm flex items-center gap-2">
          <Plus size={16} />
          New Listing
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        {[
          { icon: Building2, value: activeListings.length, label: "Active Listings" },
          { icon: Calendar, value: pendingViewings.length, label: "Pending Viewings" },
          { icon: MessageCircle, value: (myConvos || []).length, label: "Conversations" },
          { icon: Shield, value: profile?.is_un_staff ? "Yes" : "No", label: "UN Staff" },
        ].map(({ icon: Icon, value, label }) => (
          <div key={label} className="luxury-card rounded-sm p-5 text-center">
            <Icon size={20} className="text-[var(--gold-dark)] mx-auto mb-2" />
            <p className="font-serif text-2xl text-[var(--navy)]">{value}</p>
            <p className="stat-label mt-1">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* My Listings */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-xl text-[var(--navy)]">My Listings</h2>
            <Link href="/listings/new" className="font-sans text-xs text-[var(--gold-dark)] hover:underline flex items-center gap-1">
              <Plus size={12} />
              Add new
            </Link>
          </div>

          {!myListings?.length ? (
            <div className="luxury-card rounded-sm p-8 text-center">
              <Building2 size={32} className="text-[var(--gold-dark)] mx-auto mb-3 opacity-40" />
              <p className="font-sans text-sm text-[var(--warm-gray)]">No listings yet.</p>
              <Link href="/listings/new" className="btn-gold px-6 py-2 rounded-sm text-xs mt-4 inline-block">
                List a Property
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {myListings.map((l: any) => (
                <div key={l.id} className="luxury-card rounded-sm p-4 flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="font-sans text-sm font-semibold text-[var(--navy)] truncate">{l.title}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className={`font-sans text-xs px-2 py-0.5 rounded-sm uppercase tracking-wider ${
                        l.type === "rent" ? "bg-blue-50 text-blue-700" : "bg-amber-50 text-amber-700"
                      }`}>
                        {l.type === "rent" ? "Rent" : "Sale"}
                      </span>
                      <span className="font-sans text-xs text-[var(--warm-gray)]">
                        {formatPrice(l.price, l.type)}
                      </span>
                      <span className={`font-sans text-xs px-2 py-0.5 rounded-sm ${
                        l.status === "active" ? "bg-green-50 text-green-700" : "bg-gray-50 text-gray-500"
                      }`}>
                        {l.status}
                      </span>
                    </div>
                  </div>
                  <Link
                    href={`/listings/${l.id}`}
                    className="font-sans text-xs text-[var(--warm-gray)] hover:text-[var(--navy)] transition-colors flex items-center gap-1"
                  >
                    <Edit size={12} />
                    View
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming Viewings */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-xl text-[var(--navy)]">Upcoming Viewings</h2>
            <Link href="/viewings" className="font-sans text-xs text-[var(--gold-dark)] hover:underline">
              See all
            </Link>
          </div>

          {!myViewings?.length ? (
            <div className="luxury-card rounded-sm p-8 text-center">
              <Calendar size={32} className="text-[var(--gold-dark)] mx-auto mb-3 opacity-40" />
              <p className="font-sans text-sm text-[var(--warm-gray)]">No viewings scheduled.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {(myViewings as any[]).slice(0, 5).map((v) => (
                <div key={v.id} className="luxury-card rounded-sm p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-sans text-sm font-semibold text-[var(--navy)] truncate">
                        {v.listings?.title}
                      </p>
                      <p className="font-sans text-xs text-[var(--warm-gray)] mt-1">
                        {formatDate(v.proposed_date)} at {v.proposed_time}
                      </p>
                    </div>
                    <span className={`font-sans text-xs px-2 py-1 rounded-sm flex-shrink-0 ${
                      v.status === "confirmed"
                        ? "bg-green-50 text-green-700"
                        : v.status === "cancelled"
                        ? "bg-red-50 text-red-600"
                        : "bg-amber-50 text-amber-700"
                    }`}>
                      {v.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent conversations */}
      {(myConvos?.length ?? 0) > 0 && (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-xl text-[var(--navy)]">Recent Messages</h2>
            <Link href="/chat" className="font-sans text-xs text-[var(--gold-dark)] hover:underline">
              Open chat
            </Link>
          </div>
          <div className="space-y-3">
            {(myConvos as any[]).slice(0, 3).map((c) => (
              <Link key={c.id} href={`/chat?conversation=${c.id}`} className="luxury-card rounded-sm p-4 flex items-center gap-3 group block">
                <div className="w-9 h-9 rounded-full bg-[var(--navy)] flex items-center justify-center flex-shrink-0">
                  <MessageCircle size={14} className="text-[var(--gold-light)]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-sans text-sm font-semibold text-[var(--navy)] truncate">
                    {c.listings?.title}
                  </p>
                  <p className="font-sans text-xs text-[var(--warm-gray)] truncate">
                    {c.messages?.[0]?.content || "No messages yet"}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
