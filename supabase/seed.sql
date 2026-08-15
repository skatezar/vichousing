-- ============================================================
-- VIC Housing — Seed Data
-- Run AFTER schema.sql in your Supabase SQL editor
-- ============================================================

-- ============================================================
-- TEST USER
-- Creates a user via auth.users + matching profile.
-- Password: VicHousing2026!
-- Email:    demo@unido.org  (UN Staff — full access)
-- ============================================================

-- Insert into auth.users (Supabase internal table)
insert into auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_user_meta_data,
  created_at,
  updated_at,
  aud,
  role
) values (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  '00000000-0000-0000-0000-000000000000',
  'demo@unido.org',
  -- bcrypt hash of "VicHousing2026!"
  crypt('VicHousing2026!', gen_salt('bf')),
  now(),
  '{"full_name": "Dr. Anna Weber", "organization": "UNIDO", "is_un_staff": true, "phone": "+43 1 26026 0"}'::jsonb,
  now(),
  now(),
  'authenticated',
  'authenticated'
) on conflict (id) do nothing;

-- Profile is auto-created by the trigger, but insert directly as a fallback
insert into public.profiles (id, email, full_name, organization, is_un_staff, phone)
values (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'demo@unido.org',
  'Dr. Anna Weber',
  'UNIDO',
  true,
  '+43 1 26026 0'
) on conflict (id) do update set
  full_name = excluded.full_name,
  organization = excluded.organization,
  is_un_staff = excluded.is_un_staff,
  phone = excluded.phone;

-- ============================================================
-- SAMPLE LISTINGS
-- ============================================================

insert into public.listings (
  id, user_id, title, description, type, status,
  price, property_type, bedrooms, bathrooms, area_sqm,
  floor, total_floors, address, district, available_from,
  furnished, parking, balcony, elevator, pets_allowed,
  images, amenities
) values

-- 1. Penthouse near VIC
(
  'L0000001-0000-0000-0000-000000000001',
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'Penthouse with Danube & VIC views',
  'Exceptional 4-bedroom penthouse on the 14th floor, 5 minutes walk from the VIC campus. 200m² of open-plan living with floor-to-ceiling windows overlooking the Danube and the iconic UNO-City towers. Private 40m² terrace, fully equipped chef''s kitchen, two underground parking spaces. Concierge service 24/7. Ideal for senior staff or ambassadors.',
  'rent', 'active',
  5800, 'penthouse', 4, 3, 200,
  14, 14,
  'Donizettiweg 6, 1220 Wien', '22nd — Donaustadt',
  '2026-09-01',
  true, true, true, true, false,
  ARRAY[
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200',
    'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200',
    'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=1200'
  ],
  ARRAY['Air Conditioning', 'Concierge', 'Smart Home', 'Wine Cellar', 'Gym']
),

-- 2. Elegant 3BR in Donaustadt
(
  'L0000002-0000-0000-0000-000000000002',
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'Elegant 3-bedroom apartment — 10 min to VIC',
  'Beautifully designed 3-bedroom apartment in a modern building with premium finishes. South-facing living room with parquet floors throughout. Fully furnished with high-quality furniture. Underfloor heating, integrated kitchen appliances. The U1 Kagran stop is 3 minutes on foot. Perfect for a family relocating to Vienna.',
  'rent', 'active',
  2400, 'apartment', 3, 2, 112,
  5, 9,
  'Wagramer Straße 49, 1220 Wien', '22nd — Donaustadt',
  '2026-09-15',
  true, true, true, true, true,
  ARRAY[
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200',
    'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200'
  ],
  ARRAY['Underfloor Heating', 'Air Conditioning', 'Storage Room', 'Bike Storage']
),

-- 3. Modern studio — Alsergrund
(
  'L0000003-0000-0000-0000-000000000003',
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'Bright studio in Alsergrund — diplomatic district',
  'Compact and thoughtfully designed 40m² studio on the 2nd floor of a quiet Gründerzeit building. Separate sleeping alcove, modern bathroom, fully equipped kitchenette. Close to the AKH hospital campus, University of Vienna, and multiple U-Bahn lines. Ideal for single diplomats or interns. No pets.',
  'rent', 'active',
  990, 'studio', 1, 1, 40,
  2, 5,
  'Alserbachstraße 14, 1090 Wien', '9th — Alsergrund',
  '2026-10-01',
  true, false, false, false, false,
  ARRAY[
    'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=1200',
    'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=1200'
  ],
  ARRAY['Air Conditioning', 'Laundry Room']
),

-- 4. Family house — Döbling
(
  'L0000004-0000-0000-0000-000000000004',
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'Detached villa in Döbling — garden & garage',
  'Magnificent 5-bedroom detached villa in the prestigious 19th district, preferred by ambassadors and senior UN officials. Set on a 600m² garden plot with mature trees. Double garage, outdoor terrace, wine cellar, and separate staff quarters. A rare opportunity in Vienna''s most exclusive residential neighbourhood. Available for long-term rent or purchase.',
  'sell', 'active',
  2850000, 'house', 5, 4, 320,
  null, 2,
  'Hartäckerstraße 30, 1190 Wien', '19th — Döbling',
  '2026-11-01',
  false, true, true, false, true,
  ARRAY[
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200',
    'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1200',
    'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1200',
    'https://images.unsplash.com/photo-1599427303058-f04cbcf4756f?w=1200'
  ],
  ARRAY['Garden', 'Wine Cellar', 'Smart Home', 'EV Charging', 'Sauna']
),

-- 5. 2BR apartment for sale — Innere Stadt
(
  'L0000005-0000-0000-0000-000000000005',
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'Historic 2BR apartment in the 1st district',
  'Stunning Altbau apartment on the 3rd floor of a historic Ringstraße-era building. High ceilings (3.4m), original parquet flooring, decorative stucco ceilings. Two spacious bedrooms, large salon, eat-in kitchen. The building has been fully renovated. Steps from the Burgtheater and Rathaus. An extraordinary opportunity to own in Vienna''s most storied neighbourhood.',
  'sell', 'active',
  890000, 'apartment', 2, 2, 130,
  3, 5,
  'Universitätsring 8, 1010 Wien', '1st — Innere Stadt',
  '2026-10-15',
  false, false, false, true, false,
  ARRAY[
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200',
    'https://images.unsplash.com/photo-1600121848594-d8644e57abab?w=1200',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200'
  ],
  ARRAY['Air Conditioning', 'Concierge']
),

-- 6. Modern 2BR — Leopoldstadt
(
  'L0000006-0000-0000-0000-000000000006',
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'Contemporary 2BR near Prater — unfurnished',
  'Newly built 2-bedroom apartment in a stylish development near the Prater park. Open-plan living and dining, fully equipped kitchen, generous balcony overlooking tree-lined streets. Underground parking space included. U1 Praterstern is a 5-minute walk. Great for couples or small families. Available unfurnished — bring your own style.',
  'rent', 'active',
  1750, 'apartment', 2, 1, 78,
  4, 7,
  'Praterstraße 62, 1020 Wien', '2nd — Leopoldstadt',
  '2026-09-01',
  false, true, true, true, true,
  ARRAY[
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200',
    'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=1200'
  ],
  ARRAY['Bike Storage', 'Storage Room', 'EV Charging']
),

-- 7. Luxury 1BR — Währing
(
  'L0000007-0000-0000-0000-000000000007',
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'Luxury 1-bedroom in Währing — fully serviced',
  'Premium 1-bedroom apartment in a boutique serviced building with hotel-style amenities. Concierge, weekly housekeeping included, rooftop terrace, gym, and co-working lounge. Perfect for newly arrived UN staff awaiting permanent accommodation. Flexible lease terms from 3 months. All utilities included in the rent.',
  'rent', 'active',
  2100, 'apartment', 1, 1, 58,
  6, 8,
  'Gentzgasse 11, 1180 Wien', '18th — Währing',
  '2026-08-20',
  true, false, true, true, false,
  ARRAY[
    'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=1200',
    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200',
    'https://images.unsplash.com/photo-1588854337115-1c67d9247e4d?w=1200'
  ],
  ARRAY['Concierge', 'Gym', 'Air Conditioning', 'Smart Home']
),

-- 8. Townhouse — Hietzing
(
  'L0000008-0000-0000-0000-000000000008',
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'Townhouse in Hietzing — next to Schönbrunn',
  'Elegant 4-bedroom townhouse in the leafy 13th district, adjacent to Schönbrunn Palace gardens. Three floors of beautifully appointed living space, private patio, and a single-car garage. Recently renovated kitchen and bathrooms. Schools, tram lines, and the U4 all within easy reach. A prestigious address for senior diplomatic families.',
  'rent', 'active',
  3900, 'townhouse', 4, 3, 185,
  null, 3,
  'Lainzer Straße 5, 1130 Wien', '13th — Hietzing',
  '2026-10-01',
  true, true, true, false, true,
  ARRAY[
    'https://images.unsplash.com/photo-1576941089067-2de3c901e126?w=1200',
    'https://images.unsplash.com/photo-1600047509358-9dc75507daeb?w=1200',
    'https://images.unsplash.com/photo-1605146769289-440113cc3d00?w=1200'
  ],
  ARRAY['Garden', 'Air Conditioning', 'Storage Room', 'Bike Storage']
);
