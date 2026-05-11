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
const team = [
  {
    name: "Md. Toufiqul Islam",
    role: "Team Leader & Lead Engineer",
    emoji: "👨‍💻",
    desc: "Full-stack engineer and project head specializing in IoT systems and real-time data pipelines. Leads hardware-software integration for the SafeGuard wearable.",
  },
  {
    name: "Ariful Islam",
    role: "IoT Hardware Engineer",
    emoji: "🔧",
    desc: "Expert in embedded systems and sensor design. Responsible for the GPS, heart-rate, and temperature modules integrated into the SafeGuard device.",
  },
  {
    name: "Mahmudul Hasan",
    role: "Backend & API Developer",
    emoji: "🖥️",
    desc: "Designs the scalable cloud backend powering real-time alerts, geofencing logic, and the multi-contact SOS notification system.",
  },
  {
    name: "Jobaydul Alam Riyan",
    role: "Frontend & UX Developer",
    emoji: "🎨",
    desc: "Creates the parent dashboard and mobile-responsive UI. Focused on clarity, speed, and accessibility in every interaction.",
  },
  {
    name: "Md. Junayet Al Habib",
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
    color: "text-green-400",
    bg: "bg-green-400/10 border-green-400/20",
  },
  {
    icon: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 9a3 3 0 100 6 3 3 0 000-6z",
    title: "Radical Transparency",
    desc: "We tell parents exactly what data we collect, how it's used, and who can access it.",
    color: "text-blue-400",
    bg: "bg-blue-400/10 border-blue-400/20",
  },
  {
    icon: "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z M12 8v4l3 3",
    title: "Always On",
    desc: "Our infrastructure is built for 99.9% uptime. When a child needs help, milliseconds matter.",
    color: "text-violet-400",
    bg: "bg-violet-400/10 border-violet-400/20",
  },
  {
    icon: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M9 11a4 4 0 100-8 4 4 0 000 8z",
    title: "Family-Centered Design",
    desc: "SafeGuard is built with and for families. Real parents shaped every feature on this platform.",
    color: "text-amber-400",
    bg: "bg-amber-400/10 border-amber-400/20",
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

// ─── PAGE ─────────────────────────────────────────────────────────────────────
export default function AboutPage() {
  return (
    <main className="relative min-h-screen bg-[#0a0a12] text-slate-200 font-sans overflow-x-hidden">
      {/* Background radial glow */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.12] z-0"
        style={{
          background:
            "radial-gradient(circle at 70% 10%, #6D28D9 0%, transparent 50%), radial-gradient(circle at 10% 90%, #0ea5e9 0%, transparent 50%)",
        }}
      />

      <div className="relative z-10">
        {/* ── HERO ── */}
        <section className="text-center px-5 sm:px-8 pt-16 sm:pt-20 pb-14 max-w-[760px] mx-auto">
          {/* Institute badge */}
          <div className="inline-flex flex-wrap justify-center items-center gap-1.5 px-4 py-2 rounded-2xl bg-violet-700/10 border border-violet-600/30 text-[11px] font-extrabold text-violet-400 uppercase tracking-[0.1em] mb-3">
            <Icon
              d="M12 2L2 7l10 5 10-5-10-5z M2 17l10 5 10-5 M2 12l10 5 10-5"
              size={11}
            />
            Brahmanbaria Polytechnic Institute · CST Department
          </div>

          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-700/10 border border-violet-600/30 text-[11px] font-extrabold text-violet-400 uppercase tracking-[0.12em] mb-7 mt-2">
            <Icon
              d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M9 11a4 4 0 100-8 4 4 0 000 8z M23 21v-2a4 4 0 00-3-3.87 M16 3.13a4 4 0 010 7.75"
              size={12}
            />
            About SafeGuard
          </div>

          {/* Headline */}
          <h1
            className="text-[clamp(2rem,5vw,3.5rem)] font-black leading-[1.1] tracking-tight mb-5"
            style={{
              background:
                "linear-gradient(135deg, #ffffff 0%, #A78BFA 60%, #60A5FA 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Built by engineers who
            <br className="hidden sm:block" /> believe every child deserves
            safety
          </h1>

          <p className="text-[clamp(0.95rem,2vw,1.1rem)] text-gray-500 leading-[1.75]">
            SafeGuard is a student-led IoT child-safety project from Bangladesh,
            combining wearable hardware, cloud infrastructure, and AI to give
            parents real-time peace of mind. What started as a university
            capstone has grown into a full-featured platform protecting families
            every day.
          </p>
        </section>

        {/* ── MISSION ── */}
        <section className="max-w-[1100px] mx-auto px-5 sm:px-8 mb-16 sm:mb-20">
          <div
            className="rounded-3xl border border-violet-600/25 p-8 sm:p-12 text-center"
            style={{
              background:
                "linear-gradient(135deg, rgba(109,40,217,0.12), rgba(37,99,235,0.08))",
            }}
          >
            <div className="text-4xl mb-4">🛡️</div>
            <h2 className="text-2xl sm:text-[26px] font-black text-slate-200 tracking-tight mb-4">
              Our Mission
            </h2>
            <p className="text-[15px] sm:text-base text-gray-400 leading-[1.75] max-w-[620px] mx-auto">
              To make advanced child-safety technology accessible to every
              family in Bangladesh and beyond — regardless of income or
              technical background — through affordable hardware and an
              intuitive platform that anyone can use.
            </p>
          </div>
        </section>

        {/* ── VALUES ── */}
        <section className="max-w-[1100px] mx-auto px-5 sm:px-8 mb-16 sm:mb-20">
          <h2 className="text-center text-2xl sm:text-[26px] font-black text-slate-200 tracking-tight mb-10">
            Our Core Values
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {values.map((v) => (
              <div
                key={v.title}
                className="bg-white/[0.025] border border-white/[0.07] rounded-[18px] p-6 sm:p-7 text-center"
              >
                <div
                  className={`w-13 h-13 rounded-2xl border flex items-center justify-center mx-auto mb-4 ${v.bg}`}
                >
                  <Icon
                    d={v.icon}
                    size={22}
                    color="currentColor"
                    className={v.color}
                  />
                </div>
                <h3 className="text-[15px] font-extrabold text-slate-200 mb-2">
                  {v.title}
                </h3>
                <p className="text-[13px] text-gray-500 leading-relaxed">
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── TIMELINE ── */}
        <section className="max-w-[800px] mx-auto px-5 sm:px-8 mb-16 sm:mb-20">
          <h2 className="text-center text-2xl sm:text-[26px] font-black text-slate-200 tracking-tight mb-12">
            Our Journey
          </h2>

          <div className="relative">
            {/* Vertical line — hidden on very small screens, shown sm+ */}
            <div
              className="hidden sm:block absolute left-6 top-0 bottom-0 w-0.5 rounded-full opacity-30"
              style={{
                background: "linear-gradient(to bottom, #6D28D9, #2563EB)",
              }}
            />

            <div className="flex flex-col gap-8">
              {timeline.map((t, i) => (
                <div key={t.year} className="flex gap-5 sm:gap-6 items-start">
                  {/* Step bubble */}
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-[10px] font-extrabold text-white shrink-0 z-10 shadow-[0_0_16px_rgba(109,40,217,0.4)]"
                    style={{
                      background: "linear-gradient(135deg, #6D28D9, #2563EB)",
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </div>

                  {/* Content */}
                  <div className="pt-2.5">
                    <p className="text-[11px] font-extrabold text-violet-400 tracking-[0.08em] mb-1">
                      {t.year}
                    </p>
                    <h3 className="text-base font-extrabold text-slate-200 mb-1.5">
                      {t.title}
                    </h3>
                    <p className="text-[13.5px] text-gray-500 leading-relaxed">
                      {t.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── TEAM ── */}
        <section className="max-w-[1100px] mx-auto px-5 sm:px-8 mb-16 sm:mb-20">
          <h2 className="text-center text-2xl sm:text-[26px] font-black text-slate-200 tracking-tight mb-2">
            Meet the Team
          </h2>
          <p className="text-center text-sm text-gray-500 mb-10">
            A multidisciplinary team of engineers, designers, and researchers
            from Brahmanbaria Polytechnic Institute, Computer Science &amp;
            Technology.
          </p>

          {/* 5 cards: 1 col → 2 col → first row 3, last row 2 centred */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {team.map((m, i) => (
              <div
                key={m.name}
                className={`
                  bg-white/[0.025] border border-white/[0.07] rounded-[18px] p-5 sm:p-6
                  ${/* Centre the last 2 cards on lg grid */ ""}
                  ${i >= 3 ? "lg:col-start-auto" : ""}
                `}
              >
                <div className="flex items-center gap-3.5 mb-3.5">
                  {/* Avatar */}
                  <div
                    className="w-[52px] h-[52px] rounded-2xl border border-violet-600/30 flex items-center justify-center text-[22px] shrink-0"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(109,40,217,0.25), rgba(37,99,235,0.25))",
                    }}
                  >
                    {m.emoji}
                  </div>
                  <div>
                    <p className="text-[15px] font-extrabold text-slate-200 leading-snug">
                      {m.name}
                    </p>
                    <p className="text-[11px] text-violet-400 font-semibold mt-0.5">
                      {m.role}
                    </p>
                  </div>
                </div>
                <p className="text-[13px] text-gray-500 leading-relaxed">
                  {m.desc}
                </p>
              </div>
            ))}

            {/* Invisible spacer to push last 2 cards to centre on lg */}
            <div className="hidden lg:block" aria-hidden="true" />
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="px-5 sm:px-8 pb-24">
          <div className="bg-white/[0.025] border border-white/[0.07] rounded-3xl p-8 sm:p-12 max-w-[560px] mx-auto text-center">
            <h2 className="text-xl sm:text-[22px] font-black text-slate-200 tracking-tight mb-3">
              Want to collaborate?
            </h2>
            <p className="text-sm text-gray-500 leading-[1.7] mb-7">
              Whether you're a parent, researcher, investor, or fellow engineer
              — we'd love to connect.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href="/contact"
                className="px-7 py-3 rounded-xl text-sm font-bold text-white no-underline shadow-[0_0_20px_rgba(109,40,217,0.3)] hover:shadow-[0_0_28px_rgba(109,40,217,0.45)] hover:brightness-110 transition-all duration-150"
                style={{
                  background: "linear-gradient(135deg, #6D28D9, #2563EB)",
                }}
              >
                Get in Touch
              </Link>
              <Link
                href="/features"
                className="px-7 py-3 rounded-xl text-sm font-bold text-violet-400 no-underline bg-violet-700/10 border border-violet-600/30 hover:bg-violet-700/20 hover:border-violet-500/40 transition-all duration-150"
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
