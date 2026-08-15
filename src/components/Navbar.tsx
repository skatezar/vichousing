"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  Home,
  Search,
  PlusCircle,
  MessageCircle,
  Calendar,
  LayoutDashboard,
  LogOut,
  Menu,
  X,
  Shield,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/listings", label: "Browse", icon: Search },
  { href: "/listings/new", label: "List Property", icon: PlusCircle, authRequired: true },
  { href: "/chat", label: "Messages", icon: MessageCircle, authRequired: true },
  { href: "/viewings", label: "Viewings", icon: Calendar, authRequired: true },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, authRequired: true },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!supabase) { setLoading(false); return; }

    supabase.auth.getUser().then(async ({ data: { user } }: { data: { user: any } }) => {
      if (user) {
        const { data } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();
        setProfile(data);
      }
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(async (_: any, session: any) => {
      if (session?.user) {
        const { data } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();
        setProfile(data);
      } else {
        setProfile(null);
      }
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    if (supabase) await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  const orgClass = profile?.organization
    ? `badge-${profile.organization.toLowerCase()}`
    : "badge-other";

  return (
    <nav className="bg-[var(--navy)] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-sm bg-gradient-to-br from-[var(--gold-dark)] to-[var(--gold-light)] flex items-center justify-center">
              <Home size={15} className="text-white" />
            </div>
            <div>
              <span className="font-serif text-white text-base tracking-wide">
                VIC Housing
              </span>
              <span className="hidden sm:block text-[9px] tracking-[0.2em] uppercase text-[var(--gold-light)] font-sans">
                Vienna International Centre
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            {NAV_ITEMS.map(({ href, label, icon: Icon, authRequired }) => {
              if (authRequired && !profile) return null;
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "nav-link flex items-center gap-1.5",
                    pathname.startsWith(href) && "!text-[var(--gold-light)]"
                  )}
                >
                  <Icon size={14} />
                  {label}
                </Link>
              );
            })}
          </div>

          {/* Auth */}
          <div className="hidden md:flex items-center gap-3">
            {!loading && (
              <>
                {profile ? (
                  <div className="flex items-center gap-3">
                    {profile.is_un_staff && (
                      <span className="flex items-center gap-1 text-[10px] text-[var(--gold-light)] font-sans tracking-widest uppercase">
                        <Shield size={11} />
                        Verified
                      </span>
                    )}
                    <span className={cn("org-badge", orgClass)}>
                      {profile.organization}
                    </span>
                    <button
                      onClick={handleSignOut}
                      className="nav-link flex items-center gap-1.5 hover:!text-red-400"
                    >
                      <LogOut size={14} />
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <Link href="/auth/login" className="nav-link">
                      Sign In
                    </Link>
                    <Link
                      href="/auth/register"
                      className="btn-gold text-xs px-4 py-2 rounded-sm"
                    >
                      Join — Staff Only
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden text-white p-2"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-[var(--navy-light)] border-t border-white/10 px-6 py-4 space-y-3">
          {NAV_ITEMS.map(({ href, label, icon: Icon, authRequired }) => {
            if (authRequired && !profile) return null;
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className={cn(
                  "nav-link flex items-center gap-2 py-2",
                  pathname.startsWith(href) && "!text-[var(--gold-light)]"
                )}
              >
                <Icon size={15} />
                {label}
              </Link>
            );
          })}
          <div className="pt-2 border-t border-white/10">
            {profile ? (
              <button
                onClick={handleSignOut}
                className="nav-link flex items-center gap-2 py-2 hover:!text-red-400"
              >
                <LogOut size={15} />
                Sign Out
              </button>
            ) : (
              <div className="flex flex-col gap-2">
                <Link href="/auth/login" onClick={() => setMenuOpen(false)} className="nav-link py-2">
                  Sign In
                </Link>
                <Link
                  href="/auth/register"
                  onClick={() => setMenuOpen(false)}
                  className="btn-gold text-xs px-4 py-2 rounded-sm text-center"
                >
                  Join — Staff Only
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
