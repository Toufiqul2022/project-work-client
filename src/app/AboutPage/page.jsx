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

const team = [
  {
    name: "Rahim Uddin",
    role: "Lead Engineer & Project Head",
    emoji: "👨‍💻",
    desc: "Full-stack engineer specializing in IoT systems and real-time data pipelines. Leads the hardware-software integration for the SafeGuard wearable.",
  },
  {
    name: "Fatema Begum",
    role: "IoT Hardware Engineer",
    emoji: "🔧",
    desc: "Expert in embedded systems and sensor design. Responsible for the GPS, heart-rate, and temperature modules integrated into the SafeGuard device.",
  },
  {
    name: "Karim Hossain",
    role: "Backend & API Developer",
    emoji: "🖥️",
    desc: "Designs the scalable cloud backend powering real-time alerts, geofencing logic, and the multi-contact SOS notification system.",
  },
  {
    name: "Nadia Islam",
    role: "Frontend & UX Developer",
    emoji: "🎨",
    desc: "Creates the parent dashboard and mobile-responsive UI. Focused on clarity, speed, and accessibility in every interaction.",
  },
  {
    name: "Sabbir Ahmed",
    role: "AI & Data Analyst",
    emoji: "🤖",
    desc: "Builds the anomaly-detection models that power the anti-kidnapping feature, analyzing movement patterns and triggering smart alerts.",
  },
];

const values = [
  {
    icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
    title: "Child Safety First",
    desc: "Every decision we make is filtered through one question: does this keep children safer?",
    color: "#22C55E",
  },
  {
    icon: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 9a3 3 0 100 6 3 3 0 000-6z",
    title: "Radical Transparency",
    desc: "We tell parents exactly what data we collect, how it's used, and who can access it.",
    color: "#60A5FA",
  },
  {
    icon: "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z M12 8v4l3 3",
    title: "Always On",
    desc: "Our infrastructure is built for 99.9% uptime. When a child needs help, milliseconds matter.",
    color: "#A78BFA",
  },
  {
    icon: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M9 11a4 4 0 100-8 4 4 0 000 8z",
    title: "Family-Centered Design",
    desc: "SafeGuard is built with and for families. Real parents shaped every feature on this platform.",
    color: "#FBBF24",
  },
];

const timeline = [
  {
    year: "2023",
    title: "Research & Ideation",
    desc: "The project began as a university capstone, identifying the gap in affordable IoT child-safety solutions in Bangladesh.",
  },
  {
    year: "2024 Q1",
    title: "Prototype Development",
    desc: "First wearable prototype built using ESP32 + GPS module. Basic location tracking and SOS alerting tested successfully.",
  },
  {
    year: "2024 Q2",
    title: "Health Sensors Added",
    desc: "Integrated MAX30102 heart-rate sensor and DS18B20 temperature probe into the device. Cloud sync established.",
  },
  {
    year: "2024 Q3",
    title: "Dashboard & App Launch",
    desc: "Parent dashboard launched in beta. Geofencing, health monitoring, and multi-contact alerts went live.",
  },
  {
    year: "2025",
    title: "AI Anomaly Detection",
    desc: "Machine-learning movement analysis deployed for anti-kidnapping detection. Full public launch achieved.",
  },
];

export default function AboutPage() {
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
      {/* Background */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          opacity: 0.12,
          background:
            "radial-gradient(circle at 70% 10%, #6D28D9 0%, transparent 50%), radial-gradient(circle at 10% 90%, #0ea5e9 0%, transparent 50%)",
          zIndex: 0,
        }}
      />

      <div style={{ position: "relative", zIndex: 1 }}>
        {/* ── HERO ── */}
        <section
          style={{
            textAlign: "center",
            padding: "80px 24px 70px",
            maxWidth: 760,
            margin: "0 auto",
          }}
        >
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
              d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M9 11a4 4 0 100-8 4 4 0 000 8z M23 21v-2a4 4 0 00-3-3.87 M16 3.13a4 4 0 010 7.75"
              size={12}
              color="#A78BFA"
            />
            About SafeGuard
          </div>
          <h1
            style={{
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              fontWeight: 900,
              lineHeight: 1.1,
              letterSpacing: "-0.03em",
              margin: "0 0 20px",
              background:
                "linear-gradient(135deg, #ffffff 0%, #A78BFA 60%, #60A5FA 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Built by engineers who
            <br />
            believe every child deserves safety
          </h1>
          <p
            style={{
              fontSize: "clamp(0.95rem, 2vw, 1.1rem)",
              color: "#6B7280",
              lineHeight: 1.75,
              margin: 0,
            }}
          >
            SafeGuard is a student-led IoT child-safety project from Bangladesh,
            combining wearable hardware, cloud infrastructure, and AI to give
            parents real-time peace of mind. What started as a university
            capstone has grown into a full-featured platform protecting families
            every day.
          </p>
        </section>

        {/* ── MISSION ── */}
        <section
          style={{ maxWidth: 1100, margin: "0 auto 80px", padding: "0 24px" }}
        >
          <div
            style={{
              background:
                "linear-gradient(135deg, rgba(109,40,217,0.12), rgba(37,99,235,0.08))",
              border: "1px solid rgba(109,40,217,0.25)",
              borderRadius: 24,
              padding: "48px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 40, marginBottom: 16 }}>🛡️</div>
            <h2
              style={{
                fontSize: 26,
                fontWeight: 900,
                color: "#E2E8F0",
                margin: "0 0 16px",
                letterSpacing: "-0.02em",
              }}
            >
              Our Mission
            </h2>
            <p
              style={{
                fontSize: 16,
                color: "#9CA3AF",
                lineHeight: 1.75,
                maxWidth: 620,
                margin: "0 auto",
              }}
            >
              To make advanced child-safety technology accessible to every
              family in Bangladesh and beyond — regardless of income or
              technical background — through affordable hardware and an
              intuitive platform that anyone can use.
            </p>
          </div>
        </section>

        {/* ── VALUES ── */}
        <section
          style={{ maxWidth: 1100, margin: "0 auto 80px", padding: "0 24px" }}
        >
          <h2
            style={{
              textAlign: "center",
              fontSize: 26,
              fontWeight: 900,
              color: "#E2E8F0",
              marginBottom: 40,
              letterSpacing: "-0.02em",
            }}
          >
            Our Core Values
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
              gap: 16,
            }}
          >
            {values.map((v) => (
              <div
                key={v.title}
                style={{
                  background: "rgba(255,255,255,0.025)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: 18,
                  padding: "28px 24px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 16,
                    background: v.color + "15",
                    border: `1px solid ${v.color}30`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 16px",
                  }}
                >
                  <Icon d={v.icon} size={22} color={v.color} />
                </div>
                <h3
                  style={{
                    fontSize: 15,
                    fontWeight: 800,
                    color: "#E2E8F0",
                    margin: "0 0 8px",
                  }}
                >
                  {v.title}
                </h3>
                <p
                  style={{
                    fontSize: 13,
                    color: "#6B7280",
                    lineHeight: 1.65,
                    margin: 0,
                  }}
                >
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── TIMELINE ── */}
        <section
          style={{ maxWidth: 800, margin: "0 auto 80px", padding: "0 24px" }}
        >
          <h2
            style={{
              textAlign: "center",
              fontSize: 26,
              fontWeight: 900,
              color: "#E2E8F0",
              marginBottom: 48,
              letterSpacing: "-0.02em",
            }}
          >
            Our Journey
          </h2>
          <div style={{ position: "relative" }}>
            {/* vertical line */}
            <div
              style={{
                position: "absolute",
                left: 23,
                top: 0,
                bottom: 0,
                width: 2,
                background: "linear-gradient(to bottom, #6D28D9, #2563EB)",
                opacity: 0.3,
                borderRadius: 2,
              }}
            />

            <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
              {timeline.map((t, i) => (
                <div
                  key={t.year}
                  style={{ display: "flex", gap: 24, alignItems: "flex-start" }}
                >
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #6D28D9, #2563EB)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 10,
                      fontWeight: 800,
                      color: "white",
                      flexShrink: 0,
                      boxShadow: "0 0 16px rgba(109,40,217,0.4)",
                      zIndex: 1,
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div style={{ paddingTop: 10 }}>
                    <div
                      style={{
                        fontSize: 11,
                        fontWeight: 800,
                        color: "#A78BFA",
                        letterSpacing: "0.08em",
                        marginBottom: 4,
                      }}
                    >
                      {t.year}
                    </div>
                    <h3
                      style={{
                        fontSize: 16,
                        fontWeight: 800,
                        color: "#E2E8F0",
                        margin: "0 0 6px",
                      }}
                    >
                      {t.title}
                    </h3>
                    <p
                      style={{
                        fontSize: 13.5,
                        color: "#6B7280",
                        lineHeight: 1.65,
                        margin: 0,
                      }}
                    >
                      {t.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── TEAM ── */}
        <section
          style={{ maxWidth: 1100, margin: "0 auto 80px", padding: "0 24px" }}
        >
          <h2
            style={{
              textAlign: "center",
              fontSize: 26,
              fontWeight: 900,
              color: "#E2E8F0",
              marginBottom: 12,
              letterSpacing: "-0.02em",
            }}
          >
            Meet the Team
          </h2>
          <p
            style={{
              textAlign: "center",
              fontSize: 14,
              color: "#6B7280",
              marginBottom: 40,
            }}
          >
            A multidisciplinary team of engineers, designers, and researchers
            from Bangladesh.
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: 16,
            }}
          >
            {team.map((m) => (
              <div
                key={m.name}
                style={{
                  background: "rgba(255,255,255,0.025)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: 18,
                  padding: "24px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    marginBottom: 14,
                  }}
                >
                  <div
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: 16,
                      background:
                        "linear-gradient(135deg, rgba(109,40,217,0.25), rgba(37,99,235,0.25))",
                      border: "1px solid rgba(109,40,217,0.3)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 22,
                      flexShrink: 0,
                    }}
                  >
                    {m.emoji}
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: 15,
                        fontWeight: 800,
                        color: "#E2E8F0",
                      }}
                    >
                      {m.name}
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        color: "#A78BFA",
                        fontWeight: 600,
                        marginTop: 2,
                      }}
                    >
                      {m.role}
                    </div>
                  </div>
                </div>
                <p
                  style={{
                    fontSize: 13,
                    color: "#6B7280",
                    lineHeight: 1.65,
                    margin: 0,
                  }}
                >
                  {m.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA ── */}
        <section style={{ textAlign: "center", padding: "0 24px 100px" }}>
          <div
            style={{
              background: "rgba(255,255,255,0.025)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 24,
              padding: "48px 24px",
              maxWidth: 560,
              margin: "0 auto",
            }}
          >
            <h2
              style={{
                fontSize: 22,
                fontWeight: 900,
                color: "#E2E8F0",
                margin: "0 0 12px",
              }}
            >
              Want to collaborate?
            </h2>
            <p
              style={{
                fontSize: 14,
                color: "#6B7280",
                margin: "0 0 28px",
                lineHeight: 1.7,
              }}
            >
              Whether you're a parent, researcher, investor, or fellow engineer
              — we'd love to connect.
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
                href="/contact"
                style={{
                  padding: "12px 28px",
                  borderRadius: 12,
                  fontSize: 14,
                  fontWeight: 700,
                  color: "white",
                  textDecoration: "none",
                  background: "linear-gradient(135deg, #6D28D9, #2563EB)",
                  boxShadow: "0 0 20px rgba(109,40,217,0.3)",
                }}
              >
                Get in Touch
              </Link>
              <Link
                href="/features"
                style={{
                  padding: "12px 28px",
                  borderRadius: 12,
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#A78BFA",
                  textDecoration: "none",
                  background: "rgba(109,40,217,0.1)",
                  border: "1px solid rgba(109,40,217,0.3)",
                }}
              >
                Explore Features
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
