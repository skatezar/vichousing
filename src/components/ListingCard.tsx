"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Bed,
  Bath,
  Maximize2,
  MapPin,
  Car,
  Wind,
  PawPrint,
  Shield,
} from "lucide-react";
import { formatPrice, formatDate, cn } from "@/lib/utils";
import type { Listing } from "@/lib/types";

interface ListingCardProps {
  listing: Listing;
  compact?: boolean;
}

export function ListingCard({ listing, compact }: ListingCardProps) {
  const primaryImage = listing.images?.[0] || "/placeholder-apartment.jpg";
  const org = listing.profiles?.organization?.toLowerCase() || "other";

  return (
    <Link href={`/listings/${listing.id}`} className="group block">
      <div className="luxury-card rounded-sm overflow-hidden">
        {/* Image */}
        <div className="relative overflow-hidden aspect-[4/3]">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--navy-light)] to-[var(--navy)] flex items-center justify-center">
            <span className="font-sans text-white/20 text-sm tracking-widest uppercase">
              VIC Housing
            </span>
          </div>
          {listing.images?.length > 0 && (
            <img
              src={primaryImage}
              alt={listing.title}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          )}
          {/* Overlays */}
          <div className="absolute top-3 left-3 flex gap-2">
            <span
              className={cn(
                "font-sans text-xs font-semibold px-2.5 py-1 rounded-sm uppercase tracking-wider",
                listing.type === "rent"
                  ? "bg-[var(--navy)] text-[var(--gold-light)]"
                  : "bg-[var(--gold)] text-white"
              )}
            >
              {listing.type === "rent" ? "For Rent" : "For Sale"}
            </span>
          </div>
          {listing.profiles?.is_un_staff && (
            <div className="absolute top-3 right-3">
              <span className="flex items-center gap-1 bg-white/95 text-[var(--navy)] font-sans text-[10px] font-semibold px-2 py-1 rounded-sm uppercase tracking-wider">
                <Shield size={10} className="text-[var(--gold-dark)]" />
                UN Staff
              </span>
            </div>
          )}
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/50 to-transparent" />
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Price + org */}
          <div className="flex items-start justify-between mb-2">
            <div>
              <p className="font-serif text-xl text-[var(--navy)] leading-tight">
                {formatPrice(listing.price, listing.type)}
              </p>
              <p className="font-sans text-xs text-[var(--warm-gray)] mt-0.5 uppercase tracking-wider">
                {listing.property_type}
              </p>
            </div>
            <span
              className={cn(
                "org-badge",
                `badge-${org}`
              )}
            >
              {listing.profiles?.organization || "Listed"}
            </span>
          </div>

          <h3 className="font-serif text-base text-[var(--navy)] mb-2 leading-snug line-clamp-1">
            {listing.title}
          </h3>

          <div className="flex items-center gap-1.5 text-[var(--warm-gray)] mb-4">
            <MapPin size={12} />
            <p className="font-sans text-xs truncate">{listing.district}</p>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 border-t divider pt-3">
            <div className="flex items-center gap-1.5">
              <Bed size={14} className="text-[var(--gold-dark)]" />
              <span className="font-sans text-xs text-[var(--navy)]">
                {listing.bedrooms} {listing.bedrooms === 1 ? "bed" : "beds"}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Bath size={14} className="text-[var(--gold-dark)]" />
              <span className="font-sans text-xs text-[var(--navy)]">
                {listing.bathrooms} {listing.bathrooms === 1 ? "bath" : "baths"}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Maximize2 size={14} className="text-[var(--gold-dark)]" />
              <span className="font-sans text-xs text-[var(--navy)]">
                {listing.area_sqm} m²
              </span>
            </div>
          </div>

          {/* Amenity icons */}
          {!compact && (
            <div className="flex gap-2 mt-3">
              {listing.parking && (
                <span className="amenity-tag flex items-center gap-1">
                  <Car size={11} /> Parking
                </span>
              )}
              {listing.balcony && (
                <span className="amenity-tag flex items-center gap-1">
                  <Wind size={11} /> Balcony
                </span>
              )}
              {listing.pets_allowed && (
                <span className="amenity-tag flex items-center gap-1">
                  <PawPrint size={11} /> Pets
                </span>
              )}
            </div>
          )}

          <p className="font-sans text-[10px] text-[var(--warm-gray)] mt-3 opacity-60">
            Listed {formatDate(listing.created_at)}
          </p>
        </div>
      </div>
    </Link>
  );
}
