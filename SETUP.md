# VIC Housing — Setup Guide

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) → New Project
2. Choose a name (e.g. `vichousing`) and a strong database password
3. Select Frankfurt or Vienna region for best latency

## 2. Run the Schema

In Supabase → SQL Editor, paste and run the entire contents of `supabase/schema.sql`.

## 3. Configure Environment Variables

Copy `.env.local` and fill in your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

Find these in Supabase → Project Settings → API.

## 4. Configure Supabase Auth

In Supabase → Authentication → URL Configuration:
- **Site URL**: `https://your-domain.com`
- **Redirect URLs**: `https://your-domain.com/auth/callback`

Optionally, customize the confirmation email template under Authentication → Email Templates.

## 5. Enable Realtime

In Supabase → Database → Replication, enable realtime for:
- `messages` table
- `viewings` table

(The schema SQL already runs `alter publication supabase_realtime add table ...`)

## 6. Deploy to Vercel

```bash
npx vercel
```

Or connect your GitHub repo to Vercel and add the environment variables in the Vercel dashboard.

## 7. (Optional) Seed Sample Data

Uncomment the sample data at the bottom of `supabase/schema.sql`, replace `YOUR-USER-ID` with a real UUID from your auth.users table, and run it.

---

## Access Model

| Action | Anyone | UN Staff Only |
|---|---|---|
| Browse listings | ✅ | ✅ |
| List a property | ✅ (after sign-up) | ✅ |
| Request a viewing | ❌ | ✅ |
| Send messages | ❌ | ✅ |
| Contact sellers | ❌ | ✅ |

UN Staff = anyone who signs up with an email from:
- `@unido.org`
- `@un.org`  
- `@iaea.org` / `@iaea.int`
- `@ctbto.org`
