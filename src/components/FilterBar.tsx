"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { VIENNA_DISTRICTS, cn } from "@/lib/utils";
import type { ListingFilters } from "@/lib/types";

export function FilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showAdvanced, setShowAdvanced] = useState(false);

  const [filters, setFilters] = useState<ListingFilters & { search?: string }>({
    type: (searchParams.get("type") as "rent" | "sell") || undefined,
    property_type: (searchParams.get("property_type") as any) || undefined,
    min_price: searchParams.get("min_price") ? Number(searchParams.get("min_price")) : undefined,
    max_price: searchParams.get("max_price") ? Number(searchParams.get("max_price")) : undefined,
    bedrooms: searchParams.get("bedrooms") ? Number(searchParams.get("bedrooms")) : undefined,
    district: searchParams.get("district") || undefined,
    furnished: searchParams.get("furnished") === "true" ? true : undefined,
    parking: searchParams.get("parking") === "true" ? true : undefined,
    pets_allowed: searchParams.get("pets_allowed") === "true" ? true : undefined,
    search: searchParams.get("search") || "",
  });

  function apply(updated: typeof filters) {
    const params = new URLSearchParams();
    Object.entries(updated).forEach(([k, v]) => {
      if (v !== undefined && v !== "" && v !== null) {
        params.set(k, String(v));
      }
    });
    router.push(`/listings?${params.toString()}`);
  }

  function clear() {
    const empty = {};
    setFilters({ search: "" });
    router.push("/listings");
  }

  const hasFilters = Object.entries(filters).some(([k, v]) => v !== undefined && v !== "" && k !== "search");

  return (
    <div className="bg-white border-b divider shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4">
        {/* Main row */}
        <div className="flex gap-3 flex-wrap items-center">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--warm-gray)]" />
            <input
              type="text"
              placeholder="Search by title, address..."
              value={filters.search || ""}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              onKeyDown={(e) => e.key === "Enter" && apply(filters)}
              className="luxury-input w-full pl-9 pr-4 py-2.5 rounded-sm text-sm font-sans"
            />
          </div>

          {/* Type */}
          <div className="flex rounded-sm overflow-hidden border divider">
            {[
              { value: "", label: "All" },
              { value: "rent", label: "Rent" },
              { value: "sell", label: "Buy" },
            ].map(({ value, label }) => (
              <button
                key={value}
                onClick={() => {
                  const updated = { ...filters, type: value as any || undefined };
                  setFilters(updated);
                  apply(updated);
                }}
                className={cn(
                  "px-4 py-2.5 font-sans text-xs uppercase tracking-wider transition-colors",
                  filters.type === (value || undefined)
                    ? "bg-[var(--navy)] text-white"
                    : "bg-white text-[var(--warm-gray)] hover:bg-[var(--cream)]"
                )}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Bedrooms */}
          <select
            value={filters.bedrooms || ""}
            onChange={(e) => {
              const updated = { ...filters, bedrooms: e.target.value ? Number(e.target.value) : undefined };
              setFilters(updated);
              apply(updated);
            }}
            className="luxury-input px-3 py-2.5 rounded-sm text-sm font-sans pr-8"
          >
            <option value="">Bedrooms</option>
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>{n}+ beds</option>
            ))}
          </select>

          {/* District */}
          <select
            value={filters.district || ""}
            onChange={(e) => {
              const updated = { ...filters, district: e.target.value || undefined };
              setFilters(updated);
              apply(updated);
            }}
            className="luxury-input px-3 py-2.5 rounded-sm text-sm font-sans pr-8 max-w-[200px]"
          >
            <option value="">All districts</option>
            {VIENNA_DISTRICTS.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>

          {/* Advanced toggle */}
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 rounded-sm border font-sans text-xs uppercase tracking-wider transition-colors",
              showAdvanced
                ? "bg-[var(--navy)] text-white border-[var(--navy)]"
                : "border-[var(--gold)] text-[var(--gold-dark)] hover:bg-[var(--gold)] hover:text-white"
            )}
          >
            <SlidersHorizontal size={13} />
            Filters {hasFilters && <span className="bg-[var(--gold)] text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px]">!</span>}
          </button>

          {hasFilters && (
            <button
              onClick={clear}
              className="flex items-center gap-1.5 text-xs font-sans text-[var(--warm-gray)] hover:text-red-500 transition-colors"
            >
              <X size={13} />
              Clear
            </button>
          )}
        </div>

        {/* Advanced filters */}
        {showAdvanced && (
          <div className="mt-4 pt-4 border-t divider grid grid-cols-2 sm:grid-cols-4 gap-4">
            {/* Property type */}
            <div>
              <p className="stat-label mb-2">Property Type</p>
              <select
                value={filters.property_type || ""}
                onChange={(e) => setFilters({ ...filters, property_type: e.target.value as any || undefined })}
                className="luxury-input w-full px-3 py-2 rounded-sm text-sm font-sans"
              >
                <option value="">Any</option>
                {["apartment", "house", "studio", "penthouse", "townhouse"].map((t) => (
                  <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                ))}
              </select>
            </div>

            {/* Min price */}
            <div>
              <p className="stat-label mb-2">Min Price (€)</p>
              <input
                type="number"
                placeholder="0"
                value={filters.min_price || ""}
                onChange={(e) => setFilters({ ...filters, min_price: e.target.value ? Number(e.target.value) : undefined })}
                className="luxury-input w-full px-3 py-2 rounded-sm text-sm font-sans"
              />
            </div>

            {/* Max price */}
            <div>
              <p className="stat-label mb-2">Max Price (€)</p>
              <input
                type="number"
                placeholder="No limit"
                value={filters.max_price || ""}
                onChange={(e) => setFilters({ ...filters, max_price: e.target.value ? Number(e.target.value) : undefined })}
                className="luxury-input w-full px-3 py-2 rounded-sm text-sm font-sans"
              />
            </div>

            {/* Checkboxes */}
            <div>
              <p className="stat-label mb-2">Amenities</p>
              <div className="space-y-2">
                {[
                  { key: "furnished", label: "Furnished" },
                  { key: "parking", label: "Parking" },
                  { key: "pets_allowed", label: "Pets Allowed" },
                ].map(({ key, label }) => (
                  <label key={key} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!(filters as any)[key]}
                      onChange={(e) => setFilters({ ...filters, [key]: e.target.checked ? true : undefined })}
                      className="accent-[var(--gold)] w-4 h-4"
                    />
                    <span className="font-sans text-sm text-[var(--navy)]">{label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Apply button */}
            <div className="col-span-2 sm:col-span-4 flex justify-end">
              <button
                onClick={() => apply(filters)}
                className="btn-gold px-6 py-2.5 rounded-sm text-sm"
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
