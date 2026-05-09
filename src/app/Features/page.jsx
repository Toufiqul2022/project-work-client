"use client";

import Link from "next/link";

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

const features = [
  {
    icon: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z M12 7a3 3 0 100 6 3 3 0 000-6z",
    title: "Real-Time GPS Tracking",
    desc: "Track your child's exact location with precision GPS updates every 10 seconds. Get live map views, movement history, and route playback directly from the dashboard.",
    color: "#22C55E",
    bg: "rgba(34,197,94,0.08)",
    border: "rgba(34,197,94,0.2)",
    badge: "Core",
  },
  {
    icon: "M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z",
    title: "Health Monitoring",
    desc: "Continuous heart-rate and body-temperature sensing via the wearable IoT device. Instant notifications are sent if values fall outside the safe range.",
    color: "#F472B6",
    bg: "rgba(244,114,182,0.08)",
    border: "rgba(244,114,182,0.2)",
    badge: "IoT",
  },
  {
    icon: "M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 01-3.46 0",
    title: "SOS Emergency Alerts",
    desc: "One-press SOS button on the wearable instantly alerts all registered emergency contacts with GPS coordinates, health vitals, and a live tracking link.",
    color: "#EF4444",
    bg: "rgba(239,68,68,0.08)",
    border: "rgba(239,68,68,0.2)",
    badge: "Critical",
  },
  {
    icon: "M12 2L2 7l10 5 10-5-10-5z M2 17l10 5 10-5 M2 12l10 5 10-5",
    title: "Smart Safe Zones",
    desc: "Define custom geofence zones — school, home, playground. Receive instant alerts the moment your child enters or exits any defined zone.",
    color: "#60A5FA",
    bg: "rgba(96,165,250,0.08)",
    border: "rgba(96,165,250,0.2)",
    badge: "Smart",
  },
  {
    icon: "M5 12.55a11 11 0 0114.08 0 M1.42 9a16 16 0 0121.16 0 M8.53 16.11a6 6 0 016.95 0 M12 20h.01",
    title: "Multi-Network Connectivity",
    desc: "Operates seamlessly over Wi-Fi, 4G LTE, and Bluetooth. The device automatically switches networks to ensure uninterrupted communication at all times.",
    color: "#A78BFA",
    bg: "rgba(167,139,250,0.08)",
    border: "rgba(167,139,250,0.2)",
    badge: "Network",
  },
  {
    icon: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M9 11a4 4 0 100-8 4 4 0 000 8z M23 21v-2a4 4 0 00-3-3.87 M16 3.13a4 4 0 010 7.75",
    title: "Multi-Contact SOS Network",
    desc: "Register up to 5 trusted emergency contacts. When an alert is triggered, all contacts are notified simultaneously with full situational awareness.",
    color: "#FBBF24",
    bg: "rgba(251,191,36,0.08)",
    border: "rgba(251,191,36,0.2)",
    badge: "Family",
  },
  {
    icon: "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8",
    title: "Activity & Safety Reports",
    desc: "Automated daily and weekly reports covering location history, health trends, alert logs, and device status. Exportable as PDF for record-keeping.",
    color: "#34D399",
    bg: "rgba(52,211,153,0.08)",
    border: "rgba(52,211,153,0.2)",
    badge: "Reports",
  },
  {
    icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
    title: "Anti-Kidnapping Detection",
    desc: "AI-powered movement analysis detects abnormal patterns — sudden speed changes, unusual routes, or forced device removal — triggering an automatic SOS.",
    color: "#F97316",
    bg: "rgba(249,115,22,0.08)",
    border: "rgba(249,115,22,0.2)",
    badge: "AI",
  },
];

const stats = [
  { value: "< 10s", label: "GPS Update Interval" },
  { value: "5+", label: "Emergency Contacts" },
  { value: "99.9%", label: "Network Uptime" },
  { value: "72h", label: "Battery Life" },
];

export default function FeaturesPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0a0a12",
        color: "#E2E8F0",
        fontFamily: "'DM Sans', system-ui, sans-serif",
        overflowX: "hidden",
      }}
    >
      {/* Background decoration */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          opacity: 0.15,
          background:
            "radial-gradient(circle at 20% 20%, #6D28D9 0%, transparent 50%), radial-gradient(circle at 80% 80%, #2563EB 0%, transparent 50%)",
          zIndex: 0,
        }}
      />

      <div style={{ position: "relative", zIndex: 1 }}>
        {/* ── HERO ── */}
        <section style={{ textAlign: "center", padding: "80px 24px 60px" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 16px",
              borderRadius: 20,
              background: "rgba(109,40,217,0.12)",
              border: "1px solid rgba(109,40,217,0.3)",
              fontSize: 11,
              fontWeight: 800,
              color: "#A78BFA",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              marginBottom: 28,
            }}
          >
            <Icon
              d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
              size={12}
              color="#A78BFA"
            />
            Platform Features
          </div>

          <h1
            style={{
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              fontWeight: 900,
              lineHeight: 1.1,
              letterSpacing: "-0.03em",
              margin: "0 0 20px",
              background:
                "linear-gradient(135deg, #ffffff 0%, #A78BFA 50%, #60A5FA 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Everything you need to keep
            <br />
            your child safe
          </h1>

          <p
            style={{
              fontSize: "clamp(0.95rem, 2vw, 1.1rem)",
              color: "#6B7280",
              maxWidth: 560,
              margin: "0 auto 40px",
              lineHeight: 1.7,
            }}
          >
            SafeGuard combines IoT wearables, real-time GPS, health monitoring,
            and AI-powered detection into a single, unified platform designed
            for modern families.
          </p>

          {/* Stats row */}
          <div
            style={{
              display: "flex",
              gap: 12,
              justifyContent: "center",
              flexWrap: "wrap",
              marginBottom: 20,
            }}
          >
            {stats.map((s) => (
              <div
                key={s.label}
                style={{
                  padding: "16px 28px",
                  borderRadius: 16,
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  textAlign: "center",
                  minWidth: 120,
                }}
              >
                <div
                  style={{
                    fontSize: 26,
                    fontWeight: 900,
                    color: "#A78BFA",
                    letterSpacing: "-0.04em",
                  }}
                >
                  {s.value}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: "#6B7280",
                    fontWeight: 600,
                    marginTop: 4,
                  }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── FEATURES GRID ── */}
        <section
          style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px 100px" }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: 20,
            }}
          >
            {features.map((f) => (
              <div
                key={f.title}
                style={{
                  background: "rgba(255,255,255,0.025)",
                  border: `1px solid ${f.border}`,
                  borderRadius: 20,
                  padding: "28px 28px 32px",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  cursor: "default",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = `0 20px 40px ${f.color}18`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    marginBottom: 18,
                  }}
                >
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 14,
                      background: f.bg,
                      border: `1px solid ${f.border}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Icon d={f.icon} size={22} color={f.color} />
                  </div>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 800,
                      letterSpacing: "0.1em",
                      color: f.color,
                      background: f.bg,
                      border: `1px solid ${f.border}`,
                      borderRadius: 8,
                      padding: "3px 10px",
                    }}
                  >
                    {f.badge}
                  </span>
                </div>

                <h3
                  style={{
                    fontSize: 17,
                    fontWeight: 800,
                    color: "#E2E8F0",
                    margin: "0 0 10px",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {f.title}
                </h3>
                <p
                  style={{
                    fontSize: 13.5,
                    color: "#6B7280",
                    lineHeight: 1.65,
                    margin: 0,
                  }}
                >
                  {f.desc}
                </p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div style={{ textAlign: "center", marginTop: 64 }}>
            <p style={{ fontSize: 14, color: "#6B7280", marginBottom: 20 }}>
              Ready to protect what matters most?
            </p>
            <div
              style={{
                display: "flex",
                gap: 12,
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <Link
                href="/auth/register"
                style={{
                  padding: "13px 32px",
                  borderRadius: 12,
                  fontSize: 14,
                  fontWeight: 700,
                  color: "white",
                  textDecoration: "none",
                  background: "linear-gradient(135deg, #6D28D9, #2563EB)",
                  boxShadow: "0 0 24px rgba(109,40,217,0.35)",
                }}
              >
                Get Started Free
              </Link>
              <Link
                href="/contact"
                style={{
                  padding: "13px 32px",
                  borderRadius: 12,
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#A78BFA",
                  textDecoration: "none",
                  background: "rgba(109,40,217,0.1)",
                  border: "1px solid rgba(109,40,217,0.3)",
                }}
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
