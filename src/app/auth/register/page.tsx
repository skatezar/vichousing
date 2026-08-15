"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Lock, Mail, User, Building2, Eye, EyeOff, Shield, CheckCircle, AlertCircle } from "lucide-react";
import { isUNEmail, getOrgFromEmail, UN_EMAIL_DOMAINS } from "@/lib/utils";

export default function RegisterPage() {
  const supabase = createClient();
  const router = useRouter();
  const [form, setForm] = useState({
    email: "",
    password: "",
    full_name: "",
    phone: "",
  });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const isUNStaff = isUNEmail(form.email);
  const org = getOrgFromEmail(form.email);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { data, error: signUpErr } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          full_name: form.full_name,
          phone: form.phone,
          organization: org,
          is_un_staff: isUNStaff,
        },
      },
    });

    setLoading(false);

    if (signUpErr) {
      setError(signUpErr.message);
    } else {
      setSuccess(true);
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 bg-[var(--cream)]">
        <div className="luxury-card rounded-sm p-10 max-w-md w-full text-center">
          <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
          <h1 className="font-serif text-2xl text-[var(--navy)] mb-3">Check Your Email</h1>
          <p className="font-sans text-sm text-[var(--warm-gray)] leading-relaxed mb-6">
            We sent a confirmation link to <strong>{form.email}</strong>.
            {isUNStaff && " Your UN staff status has been automatically verified."}
          </p>
          {!isUNStaff && (
            <div className="bg-amber-50 border border-amber-200 rounded-sm p-4 mb-6">
              <p className="font-sans text-xs text-amber-700">
                <strong>Note:</strong> Your email is not a recognised UN domain. You can list properties,
                but interactions with listings require a verified UN staff email (
                {UN_EMAIL_DOMAINS.join(", ")}).
              </p>
            </div>
          )}
          <Link href="/auth/login" className="btn-gold px-8 py-3 rounded-sm text-sm inline-block">
            Go to Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Left */}
      <div className="hidden lg:flex flex-1 bg-[var(--navy)] flex-col items-center justify-center p-12 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(184,150,78,1) 20px, rgba(184,150,78,1) 21px)`,
          }}
        />
        <div className="relative z-10 text-center max-w-sm">
          <h2 className="font-serif text-3xl text-white mb-4">Join VIC Housing</h2>
          <p className="font-sans text-sm text-white/50 leading-relaxed mb-8">
            Vienna&apos;s exclusive real estate platform for international civil servants.
          </p>
          <div className="space-y-3 text-left">
            {[
              "Rent or buy from trusted colleagues",
              "Schedule viewings in minutes",
              "Chat & email in one place",
              "UN staff verification included",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <CheckCircle size={14} className="text-[var(--gold-light)] flex-shrink-0" />
                <span className="font-sans text-sm text-white/70">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right */}
      <div className="flex-1 lg:max-w-md flex items-center justify-center px-8 py-12 bg-[var(--cream)]">
        <div className="w-full max-w-sm">
          <Link href="/" className="block mb-8">
            <p className="font-sans text-xs tracking-widest uppercase text-[var(--warm-gray)]">
              ← VIC Housing
            </p>
          </Link>

          <h1 className="font-serif text-3xl text-[var(--navy)] mb-2">Create Account</h1>
          <p className="font-sans text-sm text-[var(--warm-gray)] mb-8">
            Open to all · UN staff get additional privileges.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="stat-label block mb-2">Full Name</label>
              <div className="relative">
                <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--warm-gray)]" />
                <input
                  type="text"
                  required
                  value={form.full_name}
                  onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                  placeholder="Dr. Jane Smith"
                  className="luxury-input w-full pl-9 pr-4 py-3 rounded-sm font-sans text-sm"
                />
              </div>
            </div>

            <div>
              <label className="stat-label block mb-2">Email Address</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--warm-gray)]" />
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@unido.org"
                  className="luxury-input w-full pl-9 pr-10 py-3 rounded-sm font-sans text-sm"
                />
                {form.email && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {isUNStaff ? (
                      <Shield size={15} className="text-green-500" />
                    ) : (
                      <AlertCircle size={15} className="text-amber-400" />
                    )}
                  </div>
                )}
              </div>
              {form.email && (
                <p className={`font-sans text-xs mt-1 flex items-center gap-1 ${isUNStaff ? "text-green-600" : "text-amber-600"}`}>
                  {isUNStaff ? (
                    <><Shield size={11} /> {org} staff — full access granted</>
                  ) : (
                    <><AlertCircle size={11} /> Non-UN email — listing only (read access)</>
                  )}
                </p>
              )}
            </div>

            <div>
              <label className="stat-label block mb-2">Phone (optional)</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+43 ..."
                className="luxury-input w-full px-4 py-3 rounded-sm font-sans text-sm"
              />
            </div>

            <div>
              <label className="stat-label block mb-2">Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--warm-gray)]" />
                <input
                  type={showPw ? "text" : "password"}
                  required
                  minLength={8}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Min 8 characters"
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
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p className="font-sans text-sm text-[var(--warm-gray)] text-center mt-6">
            Already a member?{" "}
            <Link href="/auth/login" className="text-[var(--gold-dark)] hover:underline font-medium">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
