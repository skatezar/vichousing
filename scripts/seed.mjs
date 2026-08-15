#!/usr/bin/env node
/**
 * VIC Housing seed script
 * Usage: node scripts/seed.mjs
 * Requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import ws from "ws";

const __dir = dirname(fileURLToPath(import.meta.url));

// Load .env.local manually
const envPath = join(__dir, "../.env.local");
const env = readFileSync(envPath, "utf8");
const envVars = Object.fromEntries(
  env.split("\n")
    .filter((l) => l.includes("=") && !l.startsWith("#"))
    .map((l) => [l.split("=")[0].trim(), l.split("=").slice(1).join("=").trim()])
);

const SUPABASE_URL = envVars["NEXT_PUBLIC_SUPABASE_URL"];
const SERVICE_KEY = envVars["SUPABASE_SERVICE_ROLE_KEY"];

if (!SUPABASE_URL || SUPABASE_URL.includes("your-project")) {
  console.error("❌ Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local first.");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
  realtime: { transport: ws },
});

const DEMO_USER_ID = "a1b2c3d4-e5f6-7890-abcd-ef1234567890";
const DEMO_EMAIL = "demo@unido.org";
const DEMO_PASSWORD = "VicHousing2026!";

const LISTINGS = [
  {
    id: "00000000-0000-0000-0000-000000000001",
    title: "Penthouse with Danube & VIC views",
    description:
      "Exceptional 4-bedroom penthouse on the 14th floor, 5 minutes walk from the VIC campus. 200m² of open-plan living with floor-to-ceiling windows overlooking the Danube and the iconic UNO-City towers. Private 40m² terrace, fully equipped chef's kitchen, two underground parking spaces. Concierge service 24/7. Ideal for senior staff or ambassadors.",
    type: "rent",
    price: 5800,
    property_type: "penthouse",
    bedrooms: 4,
    bathrooms: 3,
    area_sqm: 200,
    floor: 14,
    total_floors: 14,
    address: "Donizettiweg 6, 1220 Wien",
    district: "22nd — Donaustadt",
    available_from: "2026-09-01",
    furnished: true,
    parking: true,
    balcony: true,
    elevator: true,
    pets_allowed: false,
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200",
      "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=1200",
    ],
    amenities: ["Air Conditioning", "Concierge", "Smart Home", "Wine Cellar", "Gym"],
  },
  {
    id: "00000000-0000-0000-0000-000000000002",
    title: "Elegant 3-bedroom apartment — 10 min to VIC",
    description:
      "Beautifully designed 3-bedroom apartment in a modern building with premium finishes. South-facing living room with parquet floors throughout. Fully furnished with high-quality furniture. Underfloor heating, integrated kitchen appliances. The U1 Kagran stop is 3 minutes on foot. Perfect for a family relocating to Vienna.",
    type: "rent",
    price: 2400,
    property_type: "apartment",
    bedrooms: 3,
    bathrooms: 2,
    area_sqm: 112,
    floor: 5,
    total_floors: 9,
    address: "Wagramer Straße 49, 1220 Wien",
    district: "22nd — Donaustadt",
    available_from: "2026-09-15",
    furnished: true,
    parking: true,
    balcony: true,
    elevator: true,
    pets_allowed: true,
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200",
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200",
    ],
    amenities: ["Underfloor Heating", "Air Conditioning", "Storage Room", "Bike Storage"],
  },
  {
    id: "00000000-0000-0000-0000-000000000003",
    title: "Bright studio in Alsergrund — diplomatic district",
    description:
      "Compact and thoughtfully designed 40m² studio on the 2nd floor of a quiet Gründerzeit building. Separate sleeping alcove, modern bathroom, fully equipped kitchenette. Close to the AKH hospital campus, University of Vienna, and multiple U-Bahn lines. Ideal for single diplomats or interns.",
    type: "rent",
    price: 990,
    property_type: "studio",
    bedrooms: 1,
    bathrooms: 1,
    area_sqm: 40,
    floor: 2,
    total_floors: 5,
    address: "Alserbachstraße 14, 1090 Wien",
    district: "9th — Alsergrund",
    available_from: "2026-10-01",
    furnished: true,
    parking: false,
    balcony: false,
    elevator: false,
    pets_allowed: false,
    images: [
      "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=1200",
      "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=1200",
    ],
    amenities: ["Air Conditioning", "Laundry Room"],
  },
  {
    id: "00000000-0000-0000-0000-000000000004",
    title: "Detached villa in Döbling — garden & garage",
    description:
      "Magnificent 5-bedroom detached villa in the prestigious 19th district, preferred by ambassadors and senior UN officials. Set on a 600m² garden plot with mature trees. Double garage, outdoor terrace, wine cellar, and separate staff quarters. A rare opportunity in Vienna's most exclusive residential neighbourhood.",
    type: "sell",
    price: 2850000,
    property_type: "house",
    bedrooms: 5,
    bathrooms: 4,
    area_sqm: 320,
    floor: null,
    total_floors: 2,
    address: "Hartäckerstraße 30, 1190 Wien",
    district: "19th — Döbling",
    available_from: "2026-11-01",
    furnished: false,
    parking: true,
    balcony: true,
    elevator: false,
    pets_allowed: true,
    images: [
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200",
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1200",
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1200",
      "https://images.unsplash.com/photo-1599427303058-f04cbcf4756f?w=1200",
    ],
    amenities: ["Garden", "Wine Cellar", "Smart Home", "EV Charging", "Sauna"],
  },
  {
    id: "00000000-0000-0000-0000-000000000005",
    title: "Historic 2BR apartment in the 1st district",
    description:
      "Stunning Altbau apartment on the 3rd floor of a historic Ringstraße-era building. High ceilings (3.4m), original parquet flooring, decorative stucco ceilings. Two spacious bedrooms, large salon, eat-in kitchen. Steps from the Burgtheater and Rathaus. An extraordinary opportunity to own in Vienna's most storied neighbourhood.",
    type: "sell",
    price: 890000,
    property_type: "apartment",
    bedrooms: 2,
    bathrooms: 2,
    area_sqm: 130,
    floor: 3,
    total_floors: 5,
    address: "Universitätsring 8, 1010 Wien",
    district: "1st — Innere Stadt",
    available_from: "2026-10-15",
    furnished: false,
    parking: false,
    balcony: false,
    elevator: true,
    pets_allowed: false,
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200",
      "https://images.unsplash.com/photo-1600121848594-d8644e57abab?w=1200",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200",
    ],
    amenities: ["Air Conditioning", "Concierge"],
  },
  {
    id: "00000000-0000-0000-0000-000000000006",
    title: "Contemporary 2BR near Prater — unfurnished",
    description:
      "Newly built 2-bedroom apartment in a stylish development near the Prater park. Open-plan living and dining, fully equipped kitchen, generous balcony overlooking tree-lined streets. Underground parking space included. U1 Praterstern is a 5-minute walk. Great for couples or small families.",
    type: "rent",
    price: 1750,
    property_type: "apartment",
    bedrooms: 2,
    bathrooms: 1,
    area_sqm: 78,
    floor: 4,
    total_floors: 7,
    address: "Praterstraße 62, 1020 Wien",
    district: "2nd — Leopoldstadt",
    available_from: "2026-09-01",
    furnished: false,
    parking: true,
    balcony: true,
    elevator: true,
    pets_allowed: true,
    images: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200",
      "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=1200",
    ],
    amenities: ["Bike Storage", "Storage Room", "EV Charging"],
  },
  {
    id: "00000000-0000-0000-0000-000000000007",
    title: "Luxury 1-bedroom in Währing — fully serviced",
    description:
      "Premium 1-bedroom apartment in a boutique serviced building with hotel-style amenities. Concierge, weekly housekeeping included, rooftop terrace, gym, and co-working lounge. Perfect for newly arrived UN staff awaiting permanent accommodation. Flexible lease terms from 3 months. All utilities included.",
    type: "rent",
    price: 2100,
    property_type: "apartment",
    bedrooms: 1,
    bathrooms: 1,
    area_sqm: 58,
    floor: 6,
    total_floors: 8,
    address: "Gentzgasse 11, 1180 Wien",
    district: "18th — Währing",
    available_from: "2026-08-20",
    furnished: true,
    parking: false,
    balcony: true,
    elevator: true,
    pets_allowed: false,
    images: [
      "https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=1200",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200",
      "https://images.unsplash.com/photo-1588854337115-1c67d9247e4d?w=1200",
    ],
    amenities: ["Concierge", "Gym", "Air Conditioning", "Smart Home"],
  },
  {
    id: "00000000-0000-0000-0000-000000000008",
    title: "Townhouse in Hietzing — next to Schönbrunn",
    description:
      "Elegant 4-bedroom townhouse in the leafy 13th district, adjacent to Schönbrunn Palace gardens. Three floors of beautifully appointed living space, private patio, and a single-car garage. Recently renovated kitchen and bathrooms. Schools, tram lines, and the U4 all within easy reach.",
    type: "rent",
    price: 3900,
    property_type: "townhouse",
    bedrooms: 4,
    bathrooms: 3,
    area_sqm: 185,
    floor: null,
    total_floors: 3,
    address: "Lainzer Straße 5, 1130 Wien",
    district: "13th — Hietzing",
    available_from: "2026-10-01",
    furnished: true,
    parking: true,
    balcony: true,
    elevator: false,
    pets_allowed: true,
    images: [
      "https://images.unsplash.com/photo-1576941089067-2de3c901e126?w=1200",
      "https://images.unsplash.com/photo-1600047509358-9dc75507daeb?w=1200",
      "https://images.unsplash.com/photo-1605146769289-440113cc3d00?w=1200",
    ],
    amenities: ["Garden", "Air Conditioning", "Storage Room", "Bike Storage"],
  },
];

async function seed() {
  console.log("🌱 VIC Housing seed starting...\n");

  // ── 1. Create demo user ──────────────────────────────────────
  console.log("👤 Creating demo user (demo@unido.org)...");

  const { data: existingUser } = await supabase.auth.admin.listUsers();
  const alreadyExists = existingUser?.users?.find((u) => u.email === DEMO_EMAIL);

  let userId = DEMO_USER_ID;

  if (alreadyExists) {
    console.log("   User already exists, skipping creation.");
    userId = alreadyExists.id;
  } else {
    const { data: newUser, error: userErr } = await supabase.auth.admin.createUser({
      email: DEMO_EMAIL,
      password: DEMO_PASSWORD,
      email_confirm: true,
      user_metadata: {
        full_name: "Dr. Anna Weber",
        organization: "UNIDO",
        is_un_staff: true,
        phone: "+43 1 26026 0",
      },
    });

    if (userErr) {
      console.error("   ❌ Failed to create user:", userErr.message);
      process.exit(1);
    }

    userId = newUser.user.id;
    console.log(`   ✅ Created user: ${DEMO_EMAIL} (id: ${userId})`);
  }

  // Ensure profile exists
  const { error: profileErr } = await supabase.from("profiles").upsert({
    id: userId,
    email: DEMO_EMAIL,
    full_name: "Dr. Anna Weber",
    organization: "UNIDO",
    is_un_staff: true,
    phone: "+43 1 26026 0",
  });

  if (profileErr) console.warn("   ⚠ Profile upsert:", profileErr.message);
  else console.log("   ✅ Profile ready");

  // ── 2. Insert listings ───────────────────────────────────────
  console.log("\n🏠 Inserting listings...");

  for (const listing of LISTINGS) {
    const { error } = await supabase.from("listings").upsert({
      ...listing,
      user_id: userId,
      status: "active",
    });

    if (error) {
      console.error(`   ❌ ${listing.title}: ${error.message}`);
    } else {
      console.log(`   ✅ ${listing.title}`);
    }
  }

  // ── Done ─────────────────────────────────────────────────────
  console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Seed complete!

Demo account
  Email:    ${DEMO_EMAIL}
  Password: ${DEMO_PASSWORD}
  Role:     UNIDO · UN Staff (full access)

${LISTINGS.length} listings inserted.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
