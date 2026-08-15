import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { ListingCard } from "@/components/ListingCard";
import { FilterBar } from "@/components/FilterBar";
import type { Listing, ListingFilters } from "@/lib/types";
import { LayoutGrid, List } from "lucide-react";

interface ListingsPageProps {
  searchParams: Promise<Record<string, string>>;
}

async function ListingsGrid({ searchParams }: { searchParams: Record<string, string> }) {
  const supabase = await createClient();

  let query = supabase
    .from("listings")
    .select("*, profiles(*)")
    .eq("status", "active")
    .order("created_at", { ascending: false });

  if (searchParams.type) query = query.eq("type", searchParams.type);
  if (searchParams.property_type) query = query.eq("property_type", searchParams.property_type);
  if (searchParams.bedrooms) query = query.gte("bedrooms", Number(searchParams.bedrooms));
  if (searchParams.district) query = query.eq("district", searchParams.district);
  if (searchParams.furnished === "true") query = query.eq("furnished", true);
  if (searchParams.parking === "true") query = query.eq("parking", true);
  if (searchParams.pets_allowed === "true") query = query.eq("pets_allowed", true);
  if (searchParams.min_price) query = query.gte("price", Number(searchParams.min_price));
  if (searchParams.max_price) query = query.lte("price", Number(searchParams.max_price));
  if (searchParams.search) {
    query = query.or(
      `title.ilike.%${searchParams.search}%,address.ilike.%${searchParams.search}%,description.ilike.%${searchParams.search}%`
    );
  }

  const { data: listings, error } = await query;

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="font-sans text-[var(--warm-gray)]">Failed to load listings.</p>
      </div>
    );
  }

  if (!listings || listings.length === 0) {
    return (
      <div className="text-center py-24">
        <div className="w-16 h-16 rounded-sm bg-[var(--navy)] flex items-center justify-center mx-auto mb-4">
          <LayoutGrid size={24} className="text-[var(--gold-light)]" />
        </div>
        <h3 className="font-serif text-2xl text-[var(--navy)] mb-2">No listings found</h3>
        <p className="font-sans text-sm text-[var(--warm-gray)]">
          Try adjusting your filters or check back soon.
        </p>
      </div>
    );
  }

  return (
    <div>
      <p className="font-sans text-xs text-[var(--warm-gray)] mb-6 uppercase tracking-wider">
        {listings.length} {listings.length === 1 ? "property" : "properties"} found
      </p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {listings.map((listing) => (
          <ListingCard key={listing.id} listing={listing as unknown as Listing} />
        ))}
      </div>
    </div>
  );
}

export default async function ListingsPage({ searchParams }: ListingsPageProps) {
  const params = await searchParams;

  return (
    <div>
      <Suspense fallback={<div className="h-16 bg-white border-b animate-pulse" />}>
        <FilterBar />
      </Suspense>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="stat-label mb-1">
              {params.type === "rent" ? "For Rent" : params.type === "sell" ? "For Sale" : "All Properties"}
            </p>
            <h1 className="font-serif text-3xl text-[var(--navy)]">
              Vienna International Centre
            </h1>
          </div>
          <div className="hidden sm:flex items-center gap-1 bg-white border divider rounded-sm p-1">
            <button className="p-1.5 rounded-sm bg-[var(--navy)] text-white">
              <LayoutGrid size={14} />
            </button>
            <button className="p-1.5 rounded-sm text-[var(--warm-gray)] hover:bg-[var(--cream)]">
              <List size={14} />
            </button>
          </div>
        </div>

        <Suspense
          fallback={
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="luxury-card rounded-sm h-80 animate-pulse" />
              ))}
            </div>
          }
        >
          <ListingsGrid searchParams={params} />
        </Suspense>
      </div>
    </div>
  );
}
