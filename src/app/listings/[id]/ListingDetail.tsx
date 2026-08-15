"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bed, Bath, Maximize2, MapPin, Calendar, Car, Wind,
  PawPrint, Sofa, Building2, Shield, ChevronLeft,
  ChevronRight, MessageCircle, CalendarPlus, Phone, Mail,
  Lock, ArrowLeft, ArrowUpDown,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { formatPrice, formatDate, cn } from "@/lib/utils";
import { ViewingModal } from "@/components/ViewingModal";
import type { Listing, Profile } from "@/lib/types";

interface Props {
  listing: Listing;
  currentProfile: Profile | null;
}

export function ListingDetail({ listing, currentProfile }: Props) {
  const supabase = createClient();
  const router = useRouter();
  const [imgIdx, setImgIdx] = useState(0);
  const [showViewing, setShowViewing] = useState(false);
  const [startingChat, setStartingChat] = useState(false);

  const isOwner = currentProfile?.id === listing.user_id;
  const canInteract = currentProfile?.is_un_staff;
  const images = listing.images?.length ? listing.images : [];

  async function startChat() {
    if (!currentProfile) return router.push("/auth/login");
    if (!canInteract) return;

    setStartingChat(true);

    // Check existing conversation
    const { data: existing } = await supabase
      .from("conversations")
      .select("id")
      .eq("listing_id", listing.id)
      .eq("buyer_id", currentProfile.id)
      .single();

    if (existing) {
      router.push(`/chat?conversation=${existing.id}`);
      return;
    }

    // Create new
    const { data: convo } = await supabase
      .from("conversations")
      .insert({
        listing_id: listing.id,
        buyer_id: currentProfile.id,
        seller_id: listing.user_id,
      })
      .select("id")
      .single();

    setStartingChat(false);
    if (convo) router.push(`/chat?conversation=${convo.id}`);
  }

  const amenities = [
    { icon: Sofa, label: "Furnished", active: listing.furnished },
    { icon: Car, label: "Parking", active: listing.parking },
    { icon: Wind, label: "Balcony", active: listing.balcony },
    { icon: ArrowUpDown, label: "Elevator", active: listing.elevator },
    { icon: PawPrint, label: "Pets Allowed", active: listing.pets_allowed },
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      {/* Back */}
      <Link
        href="/listings"
        className="inline-flex items-center gap-2 font-sans text-xs uppercase tracking-wider text-[var(--warm-gray)] hover:text-[var(--navy)] transition-colors mb-6"
      >
        <ArrowLeft size={14} />
        Back to listings
      </Link>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left — images + details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image gallery */}
          <div className="relative rounded-sm overflow-hidden aspect-[16/9] bg-[var(--navy-light)]">
            {images.length > 0 ? (
              <>
                <img
                  src={images[imgIdx]}
                  alt={listing.title}
                  className="w-full h-full object-cover"
                />
                {images.length > 1 && (
                  <>
                    <button
                      onClick={() => setImgIdx((i) => (i - 1 + images.length) % images.length)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <button
                      onClick={() => setImgIdx((i) => (i + 1) % images.length)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70"
                    >
                      <ChevronRight size={18} />
                    </button>
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                      {images.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setImgIdx(i)}
                          className={cn(
                            "w-1.5 h-1.5 rounded-full transition-all",
                            i === imgIdx ? "bg-white w-4" : "bg-white/50"
                          )}
                        />
                      ))}
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="font-sans text-white/20 text-sm tracking-widest uppercase">
                  VIC Housing
                </span>
              </div>
            )}

            {/* Type badge */}
            <div className="absolute top-4 left-4">
              <span className={cn(
                "font-sans text-xs font-semibold px-3 py-1.5 rounded-sm uppercase tracking-wider",
                listing.type === "rent"
                  ? "bg-[var(--navy)] text-[var(--gold-light)]"
                  : "bg-[var(--gold)] text-white"
              )}>
                {listing.type === "rent" ? "For Rent" : "For Sale"}
              </span>
            </div>

            {/* Thumbnail strip */}
            {images.length > 1 && (
              <div className="absolute bottom-4 right-4 flex gap-1">
                {images.slice(0, 4).map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setImgIdx(i)}
                    className={cn(
                      "w-12 h-9 rounded overflow-hidden border-2 transition-all",
                      i === imgIdx ? "border-[var(--gold)]" : "border-white/30"
                    )}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Title + address */}
          <div>
            <div className="flex items-start justify-between gap-4 mb-2">
              <h1 className="font-serif text-2xl sm:text-3xl text-[var(--navy)] leading-tight">
                {listing.title}
              </h1>
              {listing.profiles?.is_un_staff && (
                <span className="flex items-center gap-1 bg-[var(--cream)] border divider px-3 py-1.5 rounded-sm flex-shrink-0">
                  <Shield size={13} className="text-[var(--gold-dark)]" />
                  <span className="font-sans text-xs font-semibold text-[var(--navy)] uppercase tracking-wider">
                    UN Staff
                  </span>
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-[var(--warm-gray)]">
              <MapPin size={14} />
              <p className="font-sans text-sm">{listing.address} · {listing.district}</p>
            </div>
          </div>

          {/* Stats row */}
          <div className="luxury-card rounded-sm p-5 grid grid-cols-3 sm:grid-cols-5 gap-4">
            {[
              { icon: Bed, value: `${listing.bedrooms}`, label: "Bedrooms" },
              { icon: Bath, value: `${listing.bathrooms}`, label: "Bathrooms" },
              { icon: Maximize2, value: `${listing.area_sqm} m²`, label: "Area" },
              { icon: Building2, value: listing.floor ? `${listing.floor}/${listing.total_floors}` : "—", label: "Floor" },
              { icon: Calendar, value: formatDate(listing.available_from), label: "Available" },
            ].map(({ icon: Icon, value, label }) => (
              <div key={label} className="text-center">
                <Icon size={18} className="text-[var(--gold-dark)] mx-auto mb-1" />
                <p className="font-serif text-base text-[var(--navy)]">{value}</p>
                <p className="stat-label text-center mt-0.5">{label}</p>
              </div>
            ))}
          </div>

          {/* Description */}
          <div>
            <h2 className="font-serif text-xl text-[var(--navy)] mb-3">About this property</h2>
            <p className="font-sans text-sm text-[var(--warm-gray)] leading-relaxed whitespace-pre-line">
              {listing.description || "No description provided."}
            </p>
          </div>

          {/* Amenities */}
          <div>
            <h2 className="font-serif text-xl text-[var(--navy)] mb-3">Amenities</h2>
            <div className="flex flex-wrap gap-2">
              {amenities.map(({ icon: Icon, label, active }) => (
                <span
                  key={label}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-sm border font-sans text-sm",
                    active
                      ? "bg-[var(--cream)] border-[var(--gold)]/30 text-[var(--navy)]"
                      : "bg-white border-[#e8e0d5] text-[var(--warm-gray)] opacity-50 line-through"
                  )}
                >
                  <Icon size={14} className={active ? "text-[var(--gold-dark)]" : ""} />
                  {label}
                </span>
              ))}
            </div>
          </div>

          {/* Extra amenities */}
          {listing.amenities?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {listing.amenities.map((a: string) => (
                <span key={a} className="amenity-tag">{a}</span>
              ))}
            </div>
          )}
        </div>

        {/* Right — contact card */}
        <div className="space-y-4">
          {/* Price card */}
          <div className="luxury-card rounded-sm p-6 sticky top-20">
            <div className="mb-4 pb-4 border-b divider">
              <p className="font-serif text-3xl text-[var(--navy)]">
                {formatPrice(listing.price, listing.type)}
              </p>
              <p className="font-sans text-xs text-[var(--warm-gray)] mt-1 uppercase tracking-wider">
                {listing.property_type} · {listing.district}
              </p>
            </div>

            {/* Seller */}
            <div className="flex items-center gap-3 mb-5 pb-5 border-b divider">
              <div className="w-10 h-10 rounded-full bg-[var(--navy)] flex items-center justify-center flex-shrink-0">
                <span className="font-sans text-white font-semibold">
                  {listing.profiles?.full_name?.[0]?.toUpperCase() || "?"}
                </span>
              </div>
              <div>
                <p className="font-sans text-sm font-semibold text-[var(--navy)]">
                  {listing.profiles?.full_name || "Anonymous"}
                </p>
                <p className="font-sans text-xs text-[var(--warm-gray)]">
                  {listing.profiles?.organization}
                </p>
              </div>
            </div>

            {/* Actions */}
            {isOwner ? (
              <div className="space-y-3">
                <Link
                  href={`/listings/${listing.id}/edit`}
                  className="btn-outline w-full py-3 rounded-sm text-sm text-center block"
                >
                  Edit Listing
                </Link>
              </div>
            ) : canInteract ? (
              <div className="space-y-3">
                <button
                  onClick={() => setShowViewing(true)}
                  className="btn-gold w-full py-3 rounded-sm text-sm flex items-center justify-center gap-2"
                >
                  <CalendarPlus size={16} />
                  Schedule Viewing
                </button>
                <button
                  onClick={startChat}
                  disabled={startingChat}
                  className="btn-outline w-full py-3 rounded-sm text-sm flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  <MessageCircle size={16} />
                  {startingChat ? "Opening chat..." : "Send Message"}
                </button>
                {listing.profiles?.email && (
                  <a
                    href={`mailto:${listing.profiles.email}?subject=Enquiry: ${listing.title}`}
                    className="flex items-center justify-center gap-2 font-sans text-xs text-[var(--warm-gray)] hover:text-[var(--navy)] transition-colors py-2"
                  >
                    <Mail size={13} />
                    Email directly
                  </a>
                )}
                {listing.profiles?.phone && (
                  <a
                    href={`tel:${listing.profiles.phone}`}
                    className="flex items-center justify-center gap-2 font-sans text-xs text-[var(--warm-gray)] hover:text-[var(--navy)] transition-colors py-2"
                  >
                    <Phone size={13} />
                    {listing.profiles.phone}
                  </a>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                <div className="bg-[var(--cream)] border divider rounded-sm p-4 text-center">
                  <Lock size={20} className="text-[var(--gold)] mx-auto mb-2" />
                  <p className="font-sans text-sm text-[var(--navy)] font-semibold mb-1">
                    UN Staff Only
                  </p>
                  <p className="font-sans text-xs text-[var(--warm-gray)] leading-relaxed">
                    Viewing requests, messages and bids are exclusive to verified UNIDO, UN, IAEA and CTBTO staff.
                  </p>
                </div>
                <Link
                  href="/auth/register"
                  className="btn-gold w-full py-3 rounded-sm text-sm text-center block"
                >
                  Join as Staff Member
                </Link>
                <Link
                  href="/auth/login"
                  className="btn-outline w-full py-3 rounded-sm text-sm text-center block"
                >
                  Sign In
                </Link>
              </div>
            )}

            <p className="font-sans text-[10px] text-[var(--warm-gray)] text-center mt-4 opacity-60">
              Listed {formatDate(listing.created_at)}
            </p>
          </div>
        </div>
      </div>

      {/* Viewing modal */}
      {showViewing && (
        <ViewingModal
          listingId={listing.id}
          listingTitle={listing.title}
          onClose={() => setShowViewing(false)}
        />
      )}
    </div>
  );
}
