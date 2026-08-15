import { createBrowserClient } from "@supabase/ssr";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Returns null during static prerendering when env vars are absent
export function createClient() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return null as any;
  return createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}
