"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { VIENNA_DISTRICTS } from "@/lib/utils";
import { Upload, Plus, X, CheckCircle } from "lucide-react";

const AMENITY_OPTIONS = [
  "Air Conditioning", "Underfloor Heating", "Garden", "Terrace", "Storage Room",
  "Concierge", "Gym", "Swimming Pool", "Smart Home", "Sauna", "Wine Cellar",
  "Laundry Room", "Bike Storage", "EV Charging",
];

export default function NewListingPage() {
  const supabase = createClient();
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    description: "",
    type: "rent" as "rent" | "sell",
    price: "",
    property_type: "apartment",
    bedrooms: "2",
    bathrooms: "1",
    area_sqm: "",
    floor: "",
    total_floors: "",
    address: "",
    district: "",
    available_from: "",
    furnished: false,
    parking: false,
    balcony: false,
    elevator: false,
    pets_allowed: false,
    amenities: [] as string[],
    images: [] as string[],
  });
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [imageInput, setImageInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState(1);

  function toggleAmenity(a: string) {
    setForm((f) => ({
      ...f,
      amenities: f.amenities.includes(a)
        ? f.amenities.filter((x) => x !== a)
        : [...f.amenities, a],
    }));
  }

  function addImageUrl() {
    const url = imageInput.trim();
    if (url && !imageUrls.includes(url)) {
      setImageUrls((prev) => [...prev, url]);
      setImageInput("");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title || !form.price || !form.area_sqm || !form.address || !form.district || !form.available_from) {
      setError("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    setError("");

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push("/auth/login");
      return;
    }

    const { error: err } = await supabase.from("listings").insert({
      user_id: user.id,
      title: form.title,
      description: form.description,
      type: form.type,
      price: Number(form.price),
      property_type: form.property_type,
      bedrooms: Number(form.bedrooms),
      bathrooms: Number(form.bathrooms),
      area_sqm: Number(form.area_sqm),
      floor: form.floor ? Number(form.floor) : null,
      total_floors: form.total_floors ? Number(form.total_floors) : null,
      address: form.address,
      district: form.district,
      available_from: form.available_from,
      furnished: form.furnished,
      parking: form.parking,
      balcony: form.balcony,
      elevator: form.elevator,
      pets_allowed: form.pets_allowed,
      amenities: form.amenities,
      images: imageUrls,
      status: "active",
    });

    setLoading(false);
    if (err) {
      setError("Failed to create listing. " + err.message);
    } else {
      router.push("/dashboard");
    }
  }

  const inputCls = "luxury-input w-full px-4 py-3 rounded-sm font-sans text-sm";
  const labelCls = "stat-label block mb-2";

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <div className="mb-8">
        <p className="stat-label mb-1">New Listing</p>
        <h1 className="font-serif text-3xl text-[var(--navy)]">List Your Property</h1>
        <p className="font-sans text-sm text-[var(--warm-gray)] mt-2">
          Fill in the details below. Your listing will be visible to all VIC Housing visitors.
        </p>
      </div>

      {/* Progress steps */}
      <div className="flex items-center gap-2 mb-8">
        {["Basics", "Details", "Amenities", "Photos"].map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <button
              onClick={() => setStep(i + 1)}
              className={`flex items-center gap-2 font-sans text-xs uppercase tracking-wider transition-colors ${
                step === i + 1
                  ? "text-[var(--gold-dark)] font-semibold"
                  : step > i + 1
                  ? "text-green-600"
                  : "text-[var(--warm-gray)]"
              }`}
            >
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                step > i + 1
                  ? "bg-green-100 text-green-600"
                  : step === i + 1
                  ? "bg-[var(--navy)] text-white"
                  : "bg-[var(--cream)] border divider text-[var(--warm-gray)]"
              }`}>
                {step > i + 1 ? "✓" : i + 1}
              </span>
              <span className="hidden sm:block">{s}</span>
            </button>
            {i < 3 && <div className="w-8 h-px bg-[#e8e0d5]" />}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Step 1 — Basics */}
        {step === 1 && (
          <div className="luxury-card rounded-sm p-6 space-y-5">
            <h2 className="font-serif text-xl text-[var(--navy)]">Basic Information</h2>

            <div>
              <label className={labelCls}>Listing Type *</label>
              <div className="flex rounded-sm overflow-hidden border divider">
                {[{ value: "rent", label: "For Rent" }, { value: "sell", label: "For Sale" }].map(({ value, label }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setForm({ ...form, type: value as any })}
                    className={`flex-1 py-3 font-sans text-sm uppercase tracking-wider transition-colors ${
                      form.type === value
                        ? "bg-[var(--navy)] text-white"
                        : "bg-white text-[var(--warm-gray)] hover:bg-[var(--cream)]"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className={labelCls}>Property Title *</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Bright 3-bed apartment in Döbling"
                className={inputCls}
                required
              />
            </div>

            <div>
              <label className={labelCls}>Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Describe the property, neighbourhood, transport links..."
                rows={5}
                className={inputCls + " resize-none"}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>
                  {form.type === "rent" ? "Monthly Rent (€) *" : "Sale Price (€) *"}
                </label>
                <input
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  placeholder={form.type === "rent" ? "1800" : "450000"}
                  className={inputCls}
                  required
                />
              </div>
              <div>
                <label className={labelCls}>Property Type *</label>
                <select
                  value={form.property_type}
                  onChange={(e) => setForm({ ...form, property_type: e.target.value })}
                  className={inputCls}
                >
                  {["apartment", "house", "studio", "penthouse", "townhouse"].map((t) => (
                    <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                  ))}
                </select>
              </div>
            </div>

            <button type="button" onClick={() => setStep(2)} className="btn-gold px-8 py-3 rounded-sm text-sm">
              Continue →
            </button>
          </div>
        )}

        {/* Step 2 — Details */}
        {step === 2 && (
          <div className="luxury-card rounded-sm p-6 space-y-5">
            <h2 className="font-serif text-xl text-[var(--navy)]">Property Details</h2>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className={labelCls}>Bedrooms *</label>
                <select value={form.bedrooms} onChange={(e) => setForm({ ...form, bedrooms: e.target.value })} className={inputCls}>
                  {[1,2,3,4,5,6].map((n) => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>Bathrooms *</label>
                <select value={form.bathrooms} onChange={(e) => setForm({ ...form, bathrooms: e.target.value })} className={inputCls}>
                  {[1,2,3,4].map((n) => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>Area (m²) *</label>
                <input
                  type="number"
                  value={form.area_sqm}
                  onChange={(e) => setForm({ ...form, area_sqm: e.target.value })}
                  placeholder="85"
                  className={inputCls}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Floor</label>
                <input type="number" value={form.floor} onChange={(e) => setForm({ ...form, floor: e.target.value })} placeholder="3" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Total Floors</label>
                <input type="number" value={form.total_floors} onChange={(e) => setForm({ ...form, total_floors: e.target.value })} placeholder="6" className={inputCls} />
              </div>
            </div>

            <div>
              <label className={labelCls}>Street Address *</label>
              <input
                type="text"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                placeholder="Wagramer Straße 5, 1220 Wien"
                className={inputCls}
                required
              />
            </div>

            <div>
              <label className={labelCls}>District *</label>
              <select value={form.district} onChange={(e) => setForm({ ...form, district: e.target.value })} className={inputCls} required>
                <option value="">Select district</option>
                {VIENNA_DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>

            <div>
              <label className={labelCls}>Available From *</label>
              <input
                type="date"
                value={form.available_from}
                onChange={(e) => setForm({ ...form, available_from: e.target.value })}
                className={inputCls}
                required
              />
            </div>

            <div className="flex gap-3">
              <button type="button" onClick={() => setStep(1)} className="btn-outline px-6 py-3 rounded-sm text-sm">← Back</button>
              <button type="button" onClick={() => setStep(3)} className="btn-gold px-8 py-3 rounded-sm text-sm">Continue →</button>
            </div>
          </div>
        )}

        {/* Step 3 — Amenities */}
        {step === 3 && (
          <div className="luxury-card rounded-sm p-6 space-y-5">
            <h2 className="font-serif text-xl text-[var(--navy)]">Features & Amenities</h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { key: "furnished", label: "Furnished" },
                { key: "parking", label: "Parking" },
                { key: "balcony", label: "Balcony / Terrace" },
                { key: "elevator", label: "Elevator" },
                { key: "pets_allowed", label: "Pets Allowed" },
              ].map(({ key, label }) => (
                <label key={key} className="flex items-center gap-3 p-3 border divider rounded-sm cursor-pointer hover:border-[var(--gold)] transition-colors">
                  <input
                    type="checkbox"
                    checked={(form as any)[key]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.checked })}
                    className="accent-[var(--gold)] w-4 h-4"
                  />
                  <span className="font-sans text-sm text-[var(--navy)]">{label}</span>
                </label>
              ))}
            </div>

            <div>
              <p className={labelCls}>Additional Amenities</p>
              <div className="flex flex-wrap gap-2">
                {AMENITY_OPTIONS.map((a) => (
                  <button
                    key={a}
                    type="button"
                    onClick={() => toggleAmenity(a)}
                    className={`amenity-tag cursor-pointer transition-all ${
                      form.amenities.includes(a)
                        ? "!bg-[var(--navy)] !text-white"
                        : "hover:border hover:border-[var(--gold)]"
                    }`}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button type="button" onClick={() => setStep(2)} className="btn-outline px-6 py-3 rounded-sm text-sm">← Back</button>
              <button type="button" onClick={() => setStep(4)} className="btn-gold px-8 py-3 rounded-sm text-sm">Continue →</button>
            </div>
          </div>
        )}

        {/* Step 4 — Photos */}
        {step === 4 && (
          <div className="luxury-card rounded-sm p-6 space-y-5">
            <h2 className="font-serif text-xl text-[var(--navy)]">Photos</h2>
            <p className="font-sans text-sm text-[var(--warm-gray)]">
              Add image URLs (e.g. from Imgur, Cloudinary). You can add up to 10 images.
            </p>

            <div className="flex gap-2">
              <input
                type="url"
                value={imageInput}
                onChange={(e) => setImageInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addImageUrl())}
                placeholder="https://example.com/photo.jpg"
                className={inputCls + " flex-1"}
              />
              <button type="button" onClick={addImageUrl} className="btn-gold px-4 py-3 rounded-sm">
                <Plus size={16} />
              </button>
            </div>

            {imageUrls.length > 0 && (
              <div className="grid grid-cols-3 gap-3">
                {imageUrls.map((url, i) => (
                  <div key={i} className="relative group aspect-square rounded-sm overflow-hidden border divider">
                    <img src={url} alt="" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.src = "")} />
                    <button
                      type="button"
                      onClick={() => setImageUrls((prev) => prev.filter((_, j) => j !== i))}
                      className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={12} />
                    </button>
                    {i === 0 && (
                      <span className="absolute bottom-1 left-1 font-sans text-[9px] uppercase tracking-wider bg-[var(--navy)]/80 text-white px-2 py-0.5 rounded-sm">
                        Primary
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}

            {error && (
              <p className="font-sans text-sm text-red-500 bg-red-50 px-4 py-2.5 rounded-sm">{error}</p>
            )}

            <div className="flex gap-3">
              <button type="button" onClick={() => setStep(3)} className="btn-outline px-6 py-3 rounded-sm text-sm">← Back</button>
              <button
                type="submit"
                disabled={loading}
                className="btn-gold px-8 py-3 rounded-sm text-sm flex items-center gap-2 disabled:opacity-60"
              >
                <CheckCircle size={16} />
                {loading ? "Publishing..." : "Publish Listing"}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
