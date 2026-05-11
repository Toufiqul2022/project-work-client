"use client";

import Link from "next/link";

// ─── ICON ─────────────────────────────────────────────────────────────────────
const Icon = ({ d, size = 24, color = "currentColor" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d={d} />
  </svg>
);

// ─── DATA ─────────────────────────────────────────────────────────────────────
const features = [
  {
    icon: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z M12 7a3 3 0 100 6 3 3 0 000-6z",
    title: "Real-Time GPS Tracking",
    desc: "Track your child's exact location with precision GPS updates every 10 seconds. Get live map views, movement history, and route playback directly from the dashboard.",
    color: "text-green-400",
    iconBg: "bg-green-400/10 border-green-400/20",
    cardBorder: "border-green-400/20",
    badgeColor: "text-green-400 bg-green-400/10 border-green-400/20",
    glowColor: "hover:shadow-green-500/10",
    badge: "Core",
  },
  {
    icon: "M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z",
    title: "Health Monitoring",
    desc: "Continuous heart-rate and body-temperature sensing via the wearable IoT device. Instant notifications are sent if values fall outside the safe range.",
    color: "text-pink-400",
    iconBg: "bg-pink-400/10 border-pink-400/20",
    cardBorder: "border-pink-400/20",
    badgeColor: "text-pink-400 bg-pink-400/10 border-pink-400/20",
    glowColor: "hover:shadow-pink-500/10",
    badge: "IoT",
  },
  {
    icon: "M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 01-3.46 0",
    title: "SOS Emergency Alerts",
    desc: "One-press SOS button on the wearable instantly alerts all registered emergency contacts with GPS coordinates, health vitals, and a live tracking link.",
    color: "text-red-400",
    iconBg: "bg-red-400/10 border-red-400/20",
    cardBorder: "border-red-400/20",
    badgeColor: "text-red-400 bg-red-400/10 border-red-400/20",
    glowColor: "hover:shadow-red-500/10",
    badge: "Critical",
  },
  {
    icon: "M12 2L2 7l10 5 10-5-10-5z M2 17l10 5 10-5 M2 12l10 5 10-5",
    title: "Smart Safe Zones",
    desc: "Define custom geofence zones — school, home, playground. Receive instant alerts the moment your child enters or exits any defined zone.",
    color: "text-blue-400",
    iconBg: "bg-blue-400/10 border-blue-400/20",
    cardBorder: "border-blue-400/20",
    badgeColor: "text-blue-400 bg-blue-400/10 border-blue-400/20",
    glowColor: "hover:shadow-blue-500/10",
    badge: "Smart",
  },
  {
    icon: "M5 12.55a11 11 0 0114.08 0 M1.42 9a16 16 0 0121.16 0 M8.53 16.11a6 6 0 016.95 0 M12 20h.01",
    title: "Multi-Network Connectivity",
    desc: "Operates seamlessly over Wi-Fi, 4G LTE, and Bluetooth. The device automatically switches networks to ensure uninterrupted communication at all times.",
    color: "text-violet-400",
    iconBg: "bg-violet-400/10 border-violet-400/20",
    cardBorder: "border-violet-400/20",
    badgeColor: "text-violet-400 bg-violet-400/10 border-violet-400/20",
    glowColor: "hover:shadow-violet-500/10",
    badge: "Network",
  },
  {
    icon: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M9 11a4 4 0 100-8 4 4 0 000 8z M23 21v-2a4 4 0 00-3-3.87 M16 3.13a4 4 0 010 7.75",
    title: "Multi-Contact SOS Network",
    desc: "Register up to 5 trusted emergency contacts. When an alert is triggered, all contacts are notified simultaneously with full situational awareness.",
    color: "text-amber-400",
    iconBg: "bg-amber-400/10 border-amber-400/20",
    cardBorder: "border-amber-400/20",
    badgeColor: "text-amber-400 bg-amber-400/10 border-amber-400/20",
    glowColor: "hover:shadow-amber-500/10",
    badge: "Family",
  },
  {
    icon: "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8",
    title: "Activity & Safety Reports",
    desc: "Automated daily and weekly reports covering location history, health trends, alert logs, and device status. Exportable as PDF for record-keeping.",
    color: "text-emerald-400",
    iconBg: "bg-emerald-400/10 border-emerald-400/20",
    cardBorder: "border-emerald-400/20",
    badgeColor: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
    glowColor: "hover:shadow-emerald-500/10",
    badge: "Reports",
  },
  {
    icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
    title: "Anti-Kidnapping Detection",
    desc: "AI-powered movement analysis detects abnormal patterns — sudden speed changes, unusual routes, or forced device removal — triggering an automatic SOS.",
    color: "text-orange-400",
    iconBg: "bg-orange-400/10 border-orange-400/20",
    cardBorder: "border-orange-400/20",
    badgeColor: "text-orange-400 bg-orange-400/10 border-orange-400/20",
    glowColor: "hover:shadow-orange-500/10",
    badge: "AI",
  },
];

const stats = [
  { value: "< 10s", label: "GPS Update Interval" },
  { value: "5+", label: "Emergency Contacts" },
  { value: "99.9%", label: "Network Uptime" },
  { value: "72h", label: "Battery Life" },
];

// ─── FEATURE CARD ─────────────────────────────────────────────────────────────
function FeatureCard({ f }) {
  return (
    <div
      className={`
        group relative bg-white/[0.025] border ${f.cardBorder} rounded-2xl
        p-6 sm:p-7 flex flex-col gap-4
        transition-all duration-200
        hover:-translate-y-1 hover:shadow-2xl ${f.glowColor}
        cursor-default
      `}
    >
      {/* Icon + Badge row */}
      <div className="flex items-start justify-between">
        <div
          className={`w-12 h-12 rounded-[14px] border flex items-center justify-center shrink-0 ${f.iconBg}`}
        >
          <Icon d={f.icon} size={22} color="currentColor" className={f.color} />
        </div>
        <span
          className={`text-[10px] font-extrabold tracking-widest uppercase border rounded-lg px-2.5 py-0.5 ${f.badgeColor}`}
        >
          {f.badge}
        </span>
      </div>

      {/* Text */}
      <div>
        <h3 className="text-[17px] font-extrabold text-slate-200 tracking-tight mb-2">
          {f.title}
        </h3>
        <p className="text-[13.5px] text-gray-500 leading-relaxed">{f.desc}</p>
      </div>
    </div>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────
export default function FeaturesPage() {
  return (
    <main className="relative min-h-screen bg-[#0a0a12] text-slate-200 font-sans overflow-x-hidden">
      {/* Background radial glow */}
      <div
        className="fixed inset-0 pointer-events-none opacity-15 z-0"
        style={{
          background:
            "radial-gradient(circle at 20% 20%, #6D28D9 0%, transparent 50%), radial-gradient(circle at 80% 80%, #2563EB 0%, transparent 50%)",
        }}
      />

      <div className="relative z-10">
        {/* ── HERO ── */}
        <section className="text-center px-5 sm:px-8 pt-16 sm:pt-20 pb-12 sm:pb-16">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-700/10 border border-violet-600/30 text-[11px] font-extrabold text-violet-400 uppercase tracking-[0.12em] mb-7">
            <Icon
              d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
              size={12}
            />
            Platform Features
          </div>

          {/* Headline */}
          <h1
            className="text-[clamp(2rem,5vw,3.5rem)] font-black leading-[1.1] tracking-tight mb-5"
            style={{
              background:
                "linear-gradient(135deg, #ffffff 0%, #A78BFA 50%, #60A5FA 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Everything you need to keep
            <br className="hidden sm:block" /> your child safe
          </h1>

          {/* Subheading */}
          <p className="text-[clamp(0.95rem,2vw,1.1rem)] text-gray-500 max-w-[560px] mx-auto leading-[1.7] mb-10">
            SafeGuard combines IoT wearables, real-time GPS, health monitoring,
            and AI-powered detection into a single, unified platform designed
            for modern families.
          </p>

          {/* Stats row */}
          <div className="flex flex-wrap justify-center gap-3">
            {stats.map((s) => (
              <div
                key={s.label}
                className="px-6 py-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] text-center min-w-[110px]"
              >
                <div className="text-[26px] font-black text-violet-400 tracking-tight leading-none">
                  {s.value}
                </div>
                <div className="text-[11px] font-semibold text-gray-500 mt-1.5">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── FEATURES GRID ── */}
        <section className="max-w-[1200px] mx-auto px-5 sm:px-8 pb-24">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
            {features.map((f) => (
              <FeatureCard key={f.title} f={f} />
            ))}
          </div>

          {/* ── CTA ── */}
          <div className="text-center mt-16">
            <p className="text-sm text-gray-500 mb-5">
              Ready to protect what matters most?
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href="/auth/register"
                className="px-8 py-3.5 rounded-xl text-sm font-bold text-white no-underline bg-gradient-to-br from-violet-700 to-blue-600 shadow-[0_0_24px_rgba(109,40,217,0.35)] hover:shadow-[0_0_32px_rgba(109,40,217,0.5)] hover:brightness-110 transition-all duration-150"
              >
                Get Started Free
              </Link>
              <Link
                href="/contact"
                className="px-8 py-3.5 rounded-xl text-sm font-bold text-violet-400 no-underline bg-violet-700/10 border border-violet-600/30 hover:bg-violet-700/20 hover:border-violet-500/40 transition-all duration-150"
              >
                Talk to an Expert
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
