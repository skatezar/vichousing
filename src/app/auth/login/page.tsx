"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Lock, Mail, Eye, EyeOff, Shield } from "lucide-react";

export default function LoginPage() {
  const supabase = createClient();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);

    if (err) {
      setError("Invalid email or password.");
    } else {
      router.push("/listings");
      router.refresh();
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left — decorative */}
      <div className="hidden lg:flex flex-1 bg-[var(--navy)] flex-col items-center justify-center p-12 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(184,150,78,1) 20px, rgba(184,150,78,1) 21px)`,
          }}
        />
        <div className="relative z-10 text-center max-w-sm">
          <div className="w-16 h-16 rounded-sm bg-gradient-to-br from-[var(--gold-dark)] to-[var(--gold-light)] flex items-center justify-center mx-auto mb-6">
            <Shield size={28} className="text-white" />
          </div>
          <h2 className="font-serif text-3xl text-white mb-4">Welcome back</h2>
          <p className="font-sans text-sm text-white/50 leading-relaxed">
            Your private real estate community for Vienna International Centre staff.
          </p>
          <div className="flex gap-2 justify-center mt-8 flex-wrap">
            {["UNIDO", "UN", "IAEA", "CTBTO"].map((org) => (
              <span key={org} className={`org-badge badge-${org.toLowerCase()}`}>{org}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Right — form */}
      <div className="flex-1 lg:max-w-md flex items-center justify-center px-8 py-12 bg-[var(--cream)]">
        <div className="w-full max-w-sm">
          <Link href="/" className="block mb-8">
            <p className="font-sans text-xs tracking-widest uppercase text-[var(--warm-gray)]">
              ← VIC Housing
            </p>
          </Link>

          <h1 className="font-serif text-3xl text-[var(--navy)] mb-2">Sign In</h1>
          <p className="font-sans text-sm text-[var(--warm-gray)] mb-8">
            Use your official UN organisation email.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="stat-label block mb-2">Email Address</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--warm-gray)]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@unido.org"
                  className="luxury-input w-full pl-9 pr-4 py-3 rounded-sm font-sans text-sm"
                />
              </div>
            </div>

            <div>
              <label className="stat-label block mb-2">Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--warm-gray)]" />
                <input
                  type={showPw ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="luxury-input w-full pl-9 pr-10 py-3 rounded-sm font-sans text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--warm-gray)] hover:text-[var(--navy)]"
                >
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {error && (
              <p className="font-sans text-sm text-red-500 bg-red-50 px-4 py-2.5 rounded-sm">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-gold w-full py-3 rounded-sm text-sm mt-2 disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="font-sans text-sm text-[var(--warm-gray)] text-center mt-6">
            Not a member?{" "}
            <Link href="/auth/register" className="text-[var(--gold-dark)] hover:underline font-medium">
              Join VIC Housing
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
