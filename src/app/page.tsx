import Link from "next/link";
import {
  Shield,
  Search,
  Building2,
  Calendar,
  MessageCircle,
  ChevronRight,
  Lock,
  Star,
} from "lucide-react";

const ORGS = [
  { name: "UNIDO", full: "United Nations Industrial Development Organization", color: "badge-unido" },
  { name: "UN", full: "United Nations Office Vienna", color: "badge-un" },
  { name: "IAEA", full: "International Atomic Energy Agency", color: "badge-iaea" },
  { name: "CTBTO", full: "Comprehensive Nuclear-Test-Ban Treaty Organization", color: "badge-ctbto" },
];

const FEATURES = [
  {
    icon: Search,
    title: "Curated Listings",
    desc: "Browse apartments, houses, studios and penthouses across all Vienna districts — filtered for international staff.",
  },
  {
    icon: Shield,
    title: "UN-Staff Verified",
    desc: "Only verified VIC staff can enquire, bid or contact sellers. Your colleagues are your neighbours.",
  },
  {
    icon: Calendar,
    title: "Schedule Viewings",
    desc: "Request viewings directly through the platform with your preferred date and time slots.",
  },
  {
    icon: MessageCircle,
    title: "Live Chat & Email",
    desc: "Communicate with sellers in real-time via chat or send emails directly within the platform.",
  },
];

const STATS = [
  { value: "500+", label: "VIC Staff Members" },
  { value: "4", label: "UN Organisations" },
  { value: "23", label: "Vienna Districts" },
  { value: "100%", label: "Staff Exclusive" },
];

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[85vh] flex items-center justify-center bg-[var(--navy)] overflow-hidden">
        {/* Background pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `repeating-linear-gradient(
              45deg,
              transparent,
              transparent 20px,
              rgba(184,150,78,1) 20px,
              rgba(184,150,78,1) 21px
            )`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--navy)]/80 via-transparent to-[var(--navy)]" />

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          {/* Exclusive badge */}
          <div className="inline-flex items-center gap-2 border border-[var(--gold)]/40 rounded-sm px-4 py-2 mb-8">
            <Lock size={12} className="text-[var(--gold-light)]" />
            <span className="font-sans text-xs tracking-[0.2em] uppercase text-[var(--gold-light)]">
              Exclusively for VIC Vienna Staff
            </span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-white leading-tight mb-6">
            Your Home in Vienna,
            <br />
            <span className="gold-text">Among Colleagues</span>
          </h1>

          <p className="font-sans text-base sm:text-lg text-white/60 max-w-2xl mx-auto leading-relaxed mb-10">
            The private real estate platform for UNIDO, UN, IAEA and CTBTO staff
            at the Vienna International Centre. Find your next apartment, list
            your property, and connect with colleagues — all in one place.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/listings"
              className="btn-gold px-8 py-3.5 rounded-sm text-sm flex items-center gap-2"
            >
              <Search size={16} />
              Browse Properties
            </Link>
            <Link
              href="/auth/register"
              className="btn-outline px-8 py-3.5 rounded-sm text-sm flex items-center gap-2"
              style={{ borderColor: "rgba(184,150,78,0.5)", color: "var(--gold-light)" }}
            >
              <Shield size={16} />
              Join as Staff Member
            </Link>
          </div>

          {/* Org badges */}
          <div className="flex items-center justify-center gap-3 mt-12 flex-wrap">
            {ORGS.map((org) => (
              <span key={org.name} className={`org-badge ${org.color}`} title={org.full}>
                {org.name}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[var(--cream)] to-transparent" />
      </section>

      {/* Stats bar */}
      <section className="bg-white border-y divider">
        <div className="max-w-4xl mx-auto px-6 py-10 grid grid-cols-2 sm:grid-cols-4 gap-8">
          {STATS.map(({ value, label }) => (
            <div key={label} className="text-center">
              <p className="font-serif text-3xl text-[var(--navy)] mb-1">{value}</p>
              <p className="stat-label">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="stat-label mb-3">Everything you need</p>
            <h2 className="font-serif text-3xl sm:text-4xl text-[var(--navy)]">
              Built for International Staff
            </h2>
            <div className="w-12 h-px bg-[var(--gold)] mx-auto mt-4" />
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="luxury-card rounded-sm p-6">
                <div className="w-10 h-10 rounded-sm bg-[var(--navy)] flex items-center justify-center mb-4">
                  <Icon size={18} className="text-[var(--gold-light)]" />
                </div>
                <h3 className="font-serif text-lg text-[var(--navy)] mb-2">{title}</h3>
                <p className="font-sans text-sm text-[var(--warm-gray)] leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-6 bg-[var(--navy)]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <p className="stat-label mb-3 text-[var(--gold-light)]">Simple & secure</p>
            <h2 className="font-serif text-3xl sm:text-4xl text-white">How It Works</h2>
            <div className="w-12 h-px bg-[var(--gold)] mx-auto mt-4" />
          </div>

          <div className="grid sm:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Verify your staff email",
                desc: "Register with your official UNIDO, UN, IAEA or CTBTO email. Instant verification.",
                public: false,
              },
              {
                step: "02",
                title: "List or browse",
                desc: "Anyone can list a property. Only verified UN staff can enquire, bid and contact sellers.",
                public: true,
              },
              {
                step: "03",
                title: "Connect & move",
                desc: "Schedule viewings, chat in real-time or email directly. Find your Vienna home.",
                public: false,
              },
            ].map(({ step, title, desc }) => (
              <div key={step} className="relative">
                <div className="font-serif text-6xl text-[var(--gold)]/20 mb-3">{step}</div>
                <h3 className="font-serif text-xl text-white mb-2">{title}</h3>
                <p className="font-sans text-sm text-white/50 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Exclusive notice */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="luxury-card rounded-sm p-8 sm:p-12 text-center border-[var(--gold)]/30">
            <Star size={24} className="text-[var(--gold)] mx-auto mb-4" />
            <h2 className="font-serif text-2xl sm:text-3xl text-[var(--navy)] mb-4">
              Exclusive Access for VIC Staff
            </h2>
            <p className="font-sans text-sm text-[var(--warm-gray)] leading-relaxed max-w-lg mx-auto mb-8">
              This platform is an internal service for the Vienna International Centre
              community. Enquiries, viewings, and bids are strictly limited to verified
              UNIDO, UN, IAEA and CTBTO employees. Properties may be listed by the public,
              but only staff members may interact with sellers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/listings"
                className="btn-gold px-8 py-3 rounded-sm text-sm flex items-center justify-center gap-2"
              >
                Browse Listings
                <ChevronRight size={15} />
              </Link>
              <Link
                href="/auth/register"
                className="btn-outline px-8 py-3 rounded-sm text-sm flex items-center justify-center gap-2"
              >
                <Building2 size={15} />
                List Your Property
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
