"use client";

import { useState, useEffect, useRef } from "react";

// ─── SVG ICON ─────────────────────────────────────────────────────────────────
const Icon = ({ d, size = 20, color = "currentColor", className = "" }) => (
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
    className={className}
  >
    <path d={d} />
  </svg>
);

const I = {
  shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  gps: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z M12 7a3 3 0 100 6 3 3 0 000-6z",
  heart:
    "M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z",
  bell: "M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 01-3.46 0",
  zone: "M12 2L2 7l10 5 10-5-10-5z M2 17l10 5 10-5 M2 12l10 5 10-5",
  wifi: "M5 12.55a11 11 0 0114.08 0 M1.42 9a16 16 0 0121.16 0 M8.53 16.11a6 6 0 016.95 0 M12 20h.01",
  zap: "M13 2L3 14h9l-1 8 10-12h-9l1-8z",
  check: "M20 6L9 17l-5-5",
  arrowR: "M5 12h14 M12 5l7 7-7 7",
  star: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  chip: "M9 3H5a2 2 0 00-2 2v4 M9 3h6 M15 3h4a2 2 0 012 2v4 M21 9v6 M21 15v4a2 2 0 01-2 2h-4 M15 21H9 M9 21H5a2 2 0 01-2-2v-4 M3 15V9",
};

// ─── PULSE DOT ────────────────────────────────────────────────────────────────
function PulseDot({ color = "#22C55E", size = 8 }) {
  return (
    <span
      className="relative inline-flex flex-shrink-0"
      style={{ width: size, height: size }}
    >
      <span
        className="absolute inset-0 rounded-full animate-ping"
        style={{ background: color, opacity: 0.4, animationDuration: "1.6s" }}
      />
      <span
        className="relative rounded-full"
        style={{ width: size, height: size, background: color }}
      />
    </span>
  );
}

// ─── ANIMATED COUNTER ─────────────────────────────────────────────────────────
function Counter({ target, suffix = "", duration = 1800 }) {
  const [val, setVal] = useState(0);
  const ref = useRef();
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        obs.disconnect();
        let start = null;
        const step = (ts) => {
          if (!start) start = ts;
          const p = Math.min((ts - start) / duration, 1);
          setVal(Math.floor(p * p * target));
          if (p < 1) requestAnimationFrame(step);
          else setVal(target);
        };
        requestAnimationFrame(step);
      },
      { threshold: 0.5 },
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target, duration]);
  return (
    <span ref={ref}>
      {val}
      {suffix}
    </span>
  );
}

// ─── USE REVEAL ───────────────────────────────────────────────────────────────
function useReveal() {
  const ref = useRef();
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVis(true);
          obs.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, vis];
}

// ─── REVEAL WRAPPER ───────────────────────────────────────────────────────────
function Reveal({ delay = 0, children, className = "" }) {
  const [ref, vis] = useReveal();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: vis ? 1 : 0,
        transform: vis ? "translateY(0)" : "translateY(32px)",
        transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

// ─── HERO ITEM ────────────────────────────────────────────────────────────────
function HeroItem({ delay, children, className = "" }) {
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVis(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  return (
    <div
      className={className}
      style={{
        opacity: vis ? 1 : 0,
        transform: vis ? "translateY(0)" : "translateY(28px)",
        transition: "opacity 0.7s ease, transform 0.7s ease",
      }}
    >
      {children}
    </div>
  );
}

// ─── LIVE MAP ─────────────────────────────────────────────────────────────────
function LiveMap() {
  const [ping, setPing] = useState(false);
  useEffect(() => {
    const t = setInterval(() => setPing((p) => !p), 2000);
    return () => clearInterval(t);
  }, []);
  return (
    <div
      className="relative rounded-2xl overflow-hidden h-48 sm:h-52"
      style={{
        background: "#050D1A",
        border: "1px solid rgba(96,165,250,0.15)",
      }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 420 200"
        preserveAspectRatio="xMidYMid slice"
      >
        {[...Array(15)].map((_, i) => (
          <line
            key={`v${i}`}
            x1={i * 30}
            y1="0"
            x2={i * 30}
            y2="200"
            stroke="#0c1f38"
            strokeWidth="0.8"
          />
        ))}
        {[...Array(8)].map((_, i) => (
          <line
            key={`h${i}`}
            x1="0"
            y1={i * 28}
            x2="420"
            y2={i * 28}
            stroke="#0c1f38"
            strokeWidth="0.8"
          />
        ))}
        <path
          d="M0,105 Q105,90 210,108 T420,104"
          stroke="#1a3a6e"
          strokeWidth="5"
          fill="none"
          opacity="0.6"
        />
        <path
          d="M210,0 Q215,100 210,200"
          stroke="#1a3a6e"
          strokeWidth="4"
          fill="none"
          opacity="0.5"
        />
        <circle cx="210" cy="108" r="58" fill="#22C55E" opacity="0.04" />
        <circle
          cx="210"
          cy="108"
          r="58"
          fill="none"
          stroke="#22C55E"
          strokeWidth="1"
          strokeDasharray="5 4"
          opacity="0.35"
        />
        <circle
          cx="210"
          cy="108"
          r={ping ? 30 : 18}
          fill="#22C55E"
          opacity={ping ? 0.07 : 0.15}
          style={{ transition: "r 0.9s ease, opacity 0.9s ease" }}
        />
        <circle cx="210" cy="108" r="8" fill="#22C55E" opacity="0.25" />
        <circle cx="210" cy="108" r="4.5" fill="#22C55E" opacity="0.9" />
        <circle cx="210" cy="108" r="2" fill="white" />
        <text
          x="222"
          y="100"
          fill="#22C55E"
          fontSize="9"
          fontWeight="700"
          fontFamily="system-ui"
        >
          Mirpur 10
        </text>
        <circle cx="130" cy="80" r="4" fill="#60A5FA" opacity="0.6" />
        <text
          x="138"
          y="83"
          fill="#60A5FA"
          fontSize="8"
          fontFamily="system-ui"
          opacity="0.8"
        >
          School
        </text>
        <circle cx="300" cy="128" r="4" fill="#A78BFA" opacity="0.6" />
        <text
          x="308"
          y="131"
          fill="#A78BFA"
          fontSize="8"
          fontFamily="system-ui"
          opacity="0.8"
        >
          Home
        </text>
      </svg>
      <div
        className="absolute top-2.5 left-3 flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold"
        style={{
          background: "rgba(0,0,0,0.72)",
          backdropFilter: "blur(8px)",
          border: "1px solid rgba(34,197,94,0.3)",
          color: "#22C55E",
        }}
      >
        <PulseDot color="#22C55E" size={6} /> LIVE
      </div>
      <div
        className="absolute bottom-2.5 left-3 right-3 rounded-xl px-3 py-1.5 flex justify-between items-center"
        style={{ background: "rgba(0,0,0,0.72)", backdropFilter: "blur(8px)" }}
      >
        <span className="text-xs font-semibold" style={{ color: "#E2E8F0" }}>
          📍 Mirpur 10, Dhaka
        </span>
        <span className="text-xs" style={{ color: "#4B5563" }}>
          2s ago
        </span>
      </div>
    </div>
  );
}

// ─── HEART RATE ───────────────────────────────────────────────────────────────
function HeartRate() {
  const [bpm, setBpm] = useState(72);
  const [hist, setHist] = useState([68, 70, 72, 71, 74, 72, 71, 73, 72, 70]);
  useEffect(() => {
    const t = setInterval(() => {
      setBpm((prev) => {
        const next = Math.max(
          62,
          Math.min(86, prev + (Math.random() > 0.5 ? 1 : -1)),
        );
        setHist((h) => [...h.slice(-11), next]);
        return next;
      });
    }, 1800);
    return () => clearInterval(t);
  }, []);
  const max = Math.max(...hist),
    min = Math.min(...hist);
  const pts = hist
    .map((v, i) => {
      const x = (i / (hist.length - 1)) * 260;
      const y = 48 - ((v - min) / (max - min || 1)) * 38;
      return `${x},${y}`;
    })
    .join(" ");
  return (
    <div
      className="rounded-2xl p-4 sm:p-5"
      style={{
        background: "rgba(239,68,68,0.07)",
        border: "1px solid rgba(239,68,68,0.2)",
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <span
          className="text-xs font-bold uppercase tracking-widest"
          style={{ color: "#6B7280" }}
        >
          Heart Rate
        </span>
        <span
          className="text-xs font-bold rounded-full px-2 py-0.5"
          style={{
            color: "#22C55E",
            background: "rgba(34,197,94,0.1)",
            border: "1px solid rgba(34,197,94,0.25)",
          }}
        >
          ● Normal
        </span>
      </div>
      <div className="flex items-baseline gap-1.5 mb-3">
        <span
          className="text-4xl font-black leading-none"
          style={{ color: "#EF4444", transition: "all 0.5s" }}
        >
          {bpm}
        </span>
        <span className="text-sm font-semibold" style={{ color: "#6B7280" }}>
          BPM
        </span>
      </div>
      <svg viewBox="0 0 260 52" className="w-full block" style={{ height: 52 }}>
        <defs>
          <linearGradient id="hg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#EF4444" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#EF4444" stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon points={`0,52 ${pts} 260,52`} fill="url(#hg)" />
        <polyline
          points={pts}
          fill="none"
          stroke="#EF4444"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle
          cx={260}
          cy={48 - ((bpm - min) / (max - min || 1)) * 38}
          r="3.5"
          fill="#EF4444"
        />
      </svg>
    </div>
  );
}

// ─── DATA ─────────────────────────────────────────────────────────────────────
const FEATURES = [
  {
    icon: I.gps,
    title: "Real-Time GPS Tracking",
    desc: "NEO-6M GPS + SIM800L GSM updates every 10 seconds. Live map, route playback, speed monitoring, and location history.",
    color: "#22C55E",
    badge: "IoT Hardware",
  },
  {
    icon: I.heart,
    title: "Biometric Health Monitor",
    desc: "Continuous heart-rate via MAX30102 sensor. Instant parent alerts when vitals exit the safe range. Stress analytics included.",
    color: "#EF4444",
    badge: "Biometric",
  },
  {
    icon: I.bell,
    title: "One-Press SOS Alerts",
    desc: "Physical SOS button notifies all 5 emergency contacts within seconds — GPS coordinates + live tracking link attached.",
    color: "#F59E0B",
    badge: "Critical",
  },
  {
    icon: I.zone,
    title: "Smart Geofencing",
    desc: "Draw custom safe zones around school, home, or any landmark. Instant alert when your child enters or exits the boundary.",
    color: "#60A5FA",
    badge: "Smart",
  },
  {
    icon: I.chip,
    title: "AI Anomaly Detection",
    desc: "TensorFlow.js analyses movement in real time. Detects speed spikes, forced removal, or unusual routes and auto-triggers SOS.",
    color: "#A78BFA",
    badge: "AI / ML",
  },
  {
    icon: I.wifi,
    title: "Multi-Network Failover",
    desc: "Seamless switching between Wi-Fi, 4G LTE, and Bluetooth. If one network drops, another takes over — zero dead zones.",
    color: "#34D399",
    badge: "Network",
  },
];

const TECH = [
  { cat: "Frontend", val: "Next.js 14 + Tailwind CSS", emoji: "🌐" },
  { cat: "Backend", val: "Django REST + PostgreSQL", emoji: "⚙️" },
  { cat: "Hardware", val: "ESP32 + NEO-6M + SIM800L", emoji: "📡" },
  { cat: "Algorithm", val: "Haversine + Motion Anomaly", emoji: "🔢" },
  { cat: "AI / ML", val: "TensorFlow.js — Danger Prediction", emoji: "🤖" },
  { cat: "Hosting", val: "Vercel (FE) + Railway (BE)", emoji: "☁️" },
];

const STATS = [
  { value: 10, suffix: "s", label: "GPS Update Rate", color: "#A78BFA" },
  { value: 99, suffix: "%", label: "System Uptime", color: "#22C55E" },
  { value: 5, suffix: "+", label: "Emergency Contacts", color: "#60A5FA" },
  { value: 72, suffix: "h", label: "Battery Life", color: "#F59E0B" },
];

const ALERTS = [
  {
    type: "SOS",
    loc: "Mirpur 10",
    time: "11:42 AM",
    status: "Resolved",
    color: "#EF4444",
    emoji: "🆘",
  },
  {
    type: "Geofence",
    loc: "Dhanmondi",
    time: "09:15 AM",
    status: "Active",
    color: "#F59E0B",
    emoji: "📍",
  },
  {
    type: "Anomaly",
    loc: "Gulshan 1",
    time: "Yesterday",
    status: "Resolved",
    color: "#8B5CF6",
    emoji: "⚠️",
  },
];

const REVIEWS = [
  {
    name: "Fatema Begum",
    role: "Mother, Dhaka",
    avatar: "F",
    text: "I can see my daughter's location in real time. The SOS button gives me absolute peace of mind.",
  },
  {
    name: "Karim Hossain",
    role: "Father, Mirpur",
    avatar: "K",
    text: "The geofence alert told me the second he left school. This product is a game-changer for our family.",
  },
  {
    name: "Nadia Islam",
    role: "Guardian, Chittagong",
    avatar: "N",
    text: "The heart-rate monitoring caught an elevated reading during a panic situation. SafeGuard works.",
  },
];

const STEPS = [
  {
    n: "01",
    title: "Wear the Device",
    desc: "The child wears the lightweight ESP32 wearable. GPS, heart-rate sensor, and SIM activate automatically at startup.",
    color: "#A78BFA",
    emoji: "⌚",
  },
  {
    n: "02",
    title: "Monitor in Real Time",
    desc: "The parent dashboard shows live GPS, health vitals, battery, and signal — refreshed every 10 seconds via the cloud.",
    color: "#60A5FA",
    emoji: "📱",
  },
  {
    n: "03",
    title: "Respond Instantly",
    desc: "SOS, geofence breaches, or AI anomalies trigger simultaneous notifications to all emergency contacts within seconds.",
    color: "#22C55E",
    emoji: "🛡️",
  },
];

// ─── NAV ──────────────────────────────────────────────────────────────────────
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? "rgba(6,12,22,0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "none",
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16 sm:h-18">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
            style={{ background: "linear-gradient(135deg,#6D28D9,#2563EB)" }}
          >
            🛡️
          </div>
          <span
            className="text-sm font-black tracking-tight"
            style={{
              background: "linear-gradient(90deg,#A78BFA,#60A5FA)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            SafeGuard
          </span>
        </div>
        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6">
          {["Features", "How it Works", "Tech Stack", "Reviews"].map((l) => (
            <a
              key={l}
              href="#"
              className="text-sm font-medium transition-colors duration-200 hover:text-white"
              style={{ color: "#6B7280" }}
            >
              {l}
            </a>
          ))}
        </div>
        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href="#"
            className="text-sm font-semibold transition-colors hover:text-white"
            style={{ color: "#9CA3AF" }}
          >
            Sign in
          </a>
          <a
            href="#"
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-white transition-all hover:brightness-110 hover:-translate-y-px"
            style={{ background: "linear-gradient(135deg,#6D28D9,#2563EB)" }}
          >
            Get Started
          </a>
        </div>
        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-1.5"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span
            className={`block w-5 h-0.5 bg-gray-400 transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`}
          />
          <span
            className={`block w-5 h-0.5 bg-gray-400 transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`}
          />
          <span
            className={`block w-5 h-0.5 bg-gray-400 transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`}
          />
        </button>
      </div>
      {/* Mobile menu */}
      <div
        className="md:hidden overflow-hidden transition-all duration-300"
        style={{
          maxHeight: menuOpen ? 300 : 0,
          background: "rgba(6,12,22,0.97)",
          backdropFilter: "blur(20px)",
        }}
      >
        <div
          className="px-4 py-4 flex flex-col gap-3 border-t"
          style={{ borderColor: "rgba(255,255,255,0.06)" }}
        >
          {["Features", "How it Works", "Tech Stack", "Reviews"].map((l) => (
            <a
              key={l}
              href="#"
              className="text-sm font-medium py-2"
              style={{ color: "#9CA3AF" }}
              onClick={() => setMenuOpen(false)}
            >
              {l}
            </a>
          ))}
          <a
            href="#"
            className="mt-2 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold text-white"
            style={{ background: "linear-gradient(135deg,#6D28D9,#2563EB)" }}
          >
            Get Started Free
          </a>
        </div>
      </div>
    </nav>
  );
}

// ─── MAIN LANDING PAGE ────────────────────────────────────────────────────────
export default function LandingPage() {
  const [featRef, featVis] = useReveal();
  const [statsRef, statsVis] = useReveal();
  const [techRef, techVis] = useReveal();
  const [reviewRef, reviewVis] = useReveal();

  return (
    <main
      className="min-h-screen overflow-x-hidden"
      style={{
        background: "#060C16",
        color: "#E2E8F0",
        fontFamily: "'DM Sans',system-ui,sans-serif",
      }}
    >
      <style>{`
        @keyframes sg-shimmer { 0%{background-position:200% center} 100%{background-position:-200% center} }
        @keyframes sg-float   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        @keyframes sg-spin    { to{transform:rotate(360deg)} }
        @keyframes sg-spin-r  { to{transform:rotate(-360deg)} }
        .sg-shimmer { animation: sg-shimmer 4.5s linear infinite; background-size: 300% auto; }
        .sg-float   { animation: sg-float 4s ease-in-out infinite; }
        .sg-spin    { animation: sg-spin 14s linear infinite; }
        .sg-spin-r  { animation: sg-spin-r 22s linear infinite; }
        .sg-card    { transition: transform 0.25s ease, box-shadow 0.25s ease; }
        .sg-card:hover { transform: translateY(-6px); box-shadow: 0 24px 48px rgba(0,0,0,0.4); }
        .sg-btn     { transition: filter 0.2s, transform 0.2s; }
        .sg-btn:hover { filter: brightness(1.08); transform: translateY(-2px); }
        .sg-ghost   { transition: background 0.2s; }
        .sg-ghost:hover { background: rgba(255,255,255,0.09) !important; }
        * { box-sizing: border-box; }
      `}</style>

      {/* Ambient glows */}
      <div
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      >
        <div
          className="absolute rounded-full"
          style={{
            top: "-15%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "min(1000px,150vw)",
            height: "min(1000px,150vw)",
            background:
              "radial-gradient(circle,rgba(109,40,217,0.13) 0%,transparent 65%)",
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            top: "35%",
            left: "-8%",
            width: "min(700px,100vw)",
            height: "min(700px,100vw)",
            background:
              "radial-gradient(circle,rgba(37,99,235,0.09) 0%,transparent 65%)",
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            top: "65%",
            right: "-8%",
            width: "min(600px,90vw)",
            height: "min(600px,90vw)",
            background:
              "radial-gradient(circle,rgba(34,197,94,0.07) 0%,transparent 65%)",
          }}
        />
      </div>

      {/* Grid pattern */}
      <div
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.022) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.022) 1px,transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage:
            "radial-gradient(ellipse at 50% 0%,black 20%,transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at 50% 0%,black 20%,transparent 75%)",
        }}
      />

      <Nav />

      <div className="relative z-10">
        {/* ══════════════════════════════════════════════
            HERO
        ══════════════════════════════════════════════ */}
        <section className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 pt-28 pb-16 sm:pt-32 sm:pb-20 text-center">
          {/* Badge */}
          <HeroItem delay={80} className="mb-6 sm:mb-8">
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-extrabold uppercase tracking-widest"
              style={{
                background: "rgba(34,197,94,0.08)",
                border: "1px solid rgba(34,197,94,0.28)",
                color: "#22C55E",
              }}
            >
              <PulseDot color="#22C55E" size={7} /> IoT Child Safety —
              Bangladesh
            </div>
          </HeroItem>

          {/* H1 */}
          <HeroItem delay={200} className="mb-5 sm:mb-6">
            <h1
              className="font-black leading-none tracking-tighter"
              style={{
                fontSize: "clamp(2.4rem,8vw,5.5rem)",
                letterSpacing: "-0.045em",
              }}
            >
              <span className="block" style={{ color: "#F1F5F9" }}>
                Keep Your Child
              </span>
              <span
                className="block sg-shimmer"
                style={{
                  background:
                    "linear-gradient(90deg,#A78BFA,#60A5FA,#34D399,#A78BFA)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Safe. Always.
              </span>
            </h1>
          </HeroItem>

          {/* Subtitle */}
          <HeroItem delay={360} className="mb-8 sm:mb-10">
            <p
              className="text-base sm:text-lg leading-relaxed max-w-xl mx-auto"
              style={{ color: "#6B7280" }}
            >
              SafeGuard combines an{" "}
              <strong style={{ color: "#9CA3AF" }}>ESP32 IoT wearable</strong>,
              real-time GPS, biometric health monitoring, and TensorFlow.js
              anomaly detection into one parent dashboard.
            </p>
          </HeroItem>

          {/* CTAs */}
          <HeroItem delay={500} className="mb-8 sm:mb-10">
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <a
                href="#"
                className="sg-btn flex items-center gap-2.5 px-7 py-4 rounded-2xl text-sm sm:text-base font-extrabold text-white w-full sm:w-auto justify-center"
                style={{
                  background: "linear-gradient(135deg,#6D28D9,#2563EB)",
                  boxShadow: "0 0 40px rgba(109,40,217,0.45)",
                }}
              >
                <Icon d={I.shield} size={17} color="white" /> Get Started Free
              </a>
              <a
                href="#"
                className="sg-ghost flex items-center gap-2 px-6 py-4 rounded-2xl text-sm sm:text-base font-bold w-full sm:w-auto justify-center"
                style={{
                  color: "#9CA3AF",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                Live Demo <Icon d={I.arrowR} size={16} />
              </a>
            </div>
          </HeroItem>

          {/* Status pills */}
          <HeroItem delay={640} className="mb-12 sm:mb-16">
            <div className="flex flex-wrap gap-2 justify-center">
              {[
                { label: "SAFE", color: "#22C55E", dot: true },
                { label: "🔋 78%", color: "#60A5FA" },
                { label: "📡 4/4", color: "#A78BFA" },
                { label: "♥ 72 BPM", color: "#EF4444" },
              ].map((s) => (
                <div
                  key={s.label}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold"
                  style={{
                    background: s.color + "0d",
                    border: `1px solid ${s.color}28`,
                    color: s.color,
                  }}
                >
                  {s.dot && <PulseDot color={s.color} size={7} />}
                  {s.label}
                </div>
              ))}
            </div>
          </HeroItem>

          {/* Dashboard mockup */}
          <HeroItem delay={820} className="w-full max-w-5xl mx-auto">
            <div
              className="rounded-3xl p-0.5"
              style={{
                background: "rgba(255,255,255,0.025)",
                border: "1px solid rgba(255,255,255,0.09)",
                boxShadow: "0 50px 100px rgba(0,0,0,0.65)",
              }}
            >
              <div
                className="rounded-3xl overflow-hidden"
                style={{ background: "#0D1117" }}
              >
                {/* Browser chrome */}
                <div
                  className="flex items-center gap-2 px-4 py-3"
                  style={{
                    background: "#080E18",
                    borderBottom: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  {["#EF4444", "#F59E0B", "#22C55E"].map((c) => (
                    <div
                      key={c}
                      className="rounded-full opacity-70"
                      style={{ width: 10, height: 10, background: c }}
                    />
                  ))}
                  <div
                    className="ml-2 rounded-md px-3 py-1 text-xs"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.07)",
                      color: "#4B5563",
                    }}
                  >
                    safeguard.vercel.app/dashboard
                  </div>
                </div>
                {/* Dashboard layout */}
                <div className="flex min-h-[320px] sm:min-h-[400px]">
                  {/* Sidebar — hidden on mobile, shown on sm+ */}
                  <div
                    className="hidden sm:block w-44 md:w-52 flex-shrink-0 p-3"
                    style={{
                      background: "#080E18",
                      borderRight: "1px solid rgba(255,255,255,0.05)",
                    }}
                  >
                    <div
                      className="flex items-center gap-2 px-2 pb-3 mb-2"
                      style={{
                        borderBottom: "1px solid rgba(255,255,255,0.05)",
                      }}
                    >
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-sm"
                        style={{
                          background: "linear-gradient(135deg,#6D28D9,#2563EB)",
                        }}
                      >
                        🛡️
                      </div>
                      <span
                        className="text-xs font-black"
                        style={{
                          background: "linear-gradient(90deg,#A78BFA,#60A5FA)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          backgroundClip: "text",
                        }}
                      >
                        SafeGuard
                      </span>
                    </div>
                    {[
                      { label: "Overview", icon: "🛡️", active: true },
                      { label: "Tracking", icon: "🗺️" },
                      { label: "Health", icon: "💓" },
                      { label: "Alerts", icon: "🚨", badge: 1 },
                      { label: "Zones", icon: "📍" },
                      { label: "Contacts", icon: "📞" },
                    ].map((n) => (
                      <div
                        key={n.label}
                        className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg mb-0.5 text-xs font-semibold"
                        style={{
                          background: n.active
                            ? "rgba(109,40,217,0.15)"
                            : "transparent",
                          border: n.active
                            ? "1px solid rgba(109,40,217,0.3)"
                            : "1px solid transparent",
                          color: n.active ? "#A78BFA" : "#4B5563",
                        }}
                      >
                        <span className="text-sm">{n.icon}</span>
                        {n.label}
                        {n.badge && (
                          <span
                            className="ml-auto text-white rounded-lg px-1 py-0.5 text-xs font-black"
                            style={{ background: "#EF4444", fontSize: 8 }}
                          >
                            {n.badge}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                  {/* Content */}
                  <div
                    className="flex-1 p-3 sm:p-4"
                    style={{ background: "#0a1020" }}
                  >
                    {/* Status cards */}
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      {[
                        {
                          label: "Device Status",
                          value: "SAFE",
                          icon: "🟢",
                          color: "#22C55E",
                        },
                        {
                          label: "Battery",
                          value: "78%",
                          icon: "🔋",
                          color: "#60A5FA",
                        },
                        {
                          label: "Signal",
                          value: "Strong",
                          icon: "📡",
                          color: "#A78BFA",
                        },
                      ].map((s) => (
                        <div
                          key={s.label}
                          className="rounded-xl p-2.5 sm:p-3"
                          style={{
                            background: "#0D1117",
                            border: `1px solid ${s.color}18`,
                            borderTop: `2px solid ${s.color}`,
                          }}
                        >
                          <div className="text-base sm:text-lg mb-1">
                            {s.icon}
                          </div>
                          <div
                            className="text-sm sm:text-base font-black"
                            style={{ color: s.color }}
                          >
                            {s.value}
                          </div>
                          <div
                            className="text-xs mt-0.5 hidden sm:block"
                            style={{ color: "#4B5563", fontSize: 9 }}
                          >
                            {s.label}
                          </div>
                        </div>
                      ))}
                    </div>
                    {/* Map + Heart rate */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <LiveMap />
                      <HeartRate />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </HeroItem>
        </section>

        {/* ══════════════════════════════════════════════
            STATS
        ══════════════════════════════════════════════ */}
        <section
          ref={statsRef}
          className="px-4 sm:px-6 py-16 sm:py-20 max-w-6xl mx-auto"
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {STATS.map((s, i) => (
              <div
                key={s.label}
                style={{
                  opacity: statsVis ? 1 : 0,
                  transform: statsVis ? "translateY(0)" : "translateY(28px)",
                  transition: `opacity 0.65s ease ${i * 0.1}s, transform 0.65s ease ${i * 0.1}s`,
                }}
              >
                <div
                  className="sg-card rounded-2xl p-5 sm:p-7 text-center"
                  style={{
                    background: "rgba(255,255,255,0.025)",
                    border: `1px solid ${s.color}20`,
                    borderTop: `2px solid ${s.color}`,
                  }}
                >
                  <div
                    className="text-4xl sm:text-5xl font-black leading-none mb-2 tracking-tighter"
                    style={{ color: s.color }}
                  >
                    {statsVis ? (
                      <Counter target={s.value} suffix={s.suffix} />
                    ) : (
                      `0${s.suffix}`
                    )}
                  </div>
                  <div
                    className="text-xs font-semibold"
                    style={{ color: "#6B7280" }}
                  >
                    {s.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            LIVE ALERTS + DEVICE MOCKUP
        ══════════════════════════════════════════════ */}
        <section className="px-4 sm:px-6 py-12 sm:py-20 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left */}
            <Reveal>
              <div
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-widest mb-5"
                style={{
                  background: "rgba(239,68,68,0.1)",
                  border: "1px solid rgba(239,68,68,0.3)",
                  color: "#EF4444",
                }}
              >
                <PulseDot color="#EF4444" size={7} /> Live Alerts
              </div>
              <h2
                className="font-black leading-tight mb-4 tracking-tighter"
                style={{ fontSize: "clamp(1.75rem,4vw,2.75rem)" }}
              >
                Instant alerts,
                <br />
                <span
                  style={{
                    background: "linear-gradient(90deg,#A78BFA,#60A5FA)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  zero delays
                </span>
              </h2>
              <p
                className="text-sm sm:text-base leading-relaxed mb-6 sm:mb-8"
                style={{ color: "#6B7280" }}
              >
                SOS, geofence exit, or AI anomaly — all 5 emergency contacts get
                notified in seconds with GPS coordinates and a one-tap live
                tracking link.
              </p>
              <div className="flex flex-col gap-2.5">
                {ALERTS.map((a) => (
                  <div
                    key={a.type}
                    className="flex items-center justify-between p-3 sm:p-3.5 rounded-2xl"
                    style={{
                      background: a.color + "0b",
                      border: `1px solid ${a.color}28`,
                      borderLeft: `3px solid ${a.color}`,
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center text-base"
                        style={{ background: a.color + "18" }}
                      >
                        {a.emoji}
                      </div>
                      <div>
                        <div
                          className="text-sm font-bold"
                          style={{ color: "#E2E8F0" }}
                        >
                          {a.type} Alert
                        </div>
                        <div
                          className="text-xs mt-0.5"
                          style={{ color: "#6B7280" }}
                        >
                          {a.loc} · {a.time}
                        </div>
                      </div>
                    </div>
                    <span
                      className="text-xs font-bold rounded-full px-2.5 py-1 whitespace-nowrap flex-shrink-0 ml-2"
                      style={{
                        color: a.status === "Resolved" ? "#22C55E" : "#F59E0B",
                        background:
                          (a.status === "Resolved" ? "#22C55E" : "#F59E0B") +
                          "14",
                        border: `1px solid ${a.status === "Resolved" ? "#22C55E" : "#F59E0B"}28`,
                      }}
                    >
                      {a.status === "Resolved" ? "✓ Resolved" : "● Active"}
                    </span>
                  </div>
                ))}
              </div>
            </Reveal>

            {/* Right — device mockup */}
            <Reveal delay={0.15} className="flex flex-col items-center gap-6">
              <div className="relative sg-float">
                <div
                  className="rounded-full flex flex-col items-center justify-center relative overflow-hidden"
                  style={{
                    width: 200,
                    height: 200,
                    background: "linear-gradient(145deg,#0f1b30,#1c2e50)",
                    border: "3px solid rgba(109,40,217,0.45)",
                    boxShadow:
                      "0 0 70px rgba(109,40,217,0.3),inset 0 0 50px rgba(0,0,0,0.5)",
                  }}
                >
                  <div
                    className="absolute top-3 rounded-sm"
                    style={{
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: 56,
                      height: 2,
                      background: "rgba(109,40,217,0.55)",
                    }}
                  />
                  <div className="text-4xl mb-2">🛡️</div>
                  <div
                    className="text-xs font-black tracking-widest"
                    style={{ color: "#A78BFA" }}
                  >
                    SAFEGUARD
                  </div>
                  <div
                    className="text-xs mt-1"
                    style={{ color: "#4B5563", fontSize: 9 }}
                  >
                    ESP32 · NEO-6M · SIM800L
                  </div>
                  <div className="absolute bottom-6 flex gap-2.5">
                    <PulseDot color="#22C55E" size={8} />
                    <PulseDot color="#60A5FA" size={8} />
                    <PulseDot color="#EF4444" size={8} />
                  </div>
                </div>
                {/* Orbit rings */}
                <div
                  className="absolute rounded-full sg-spin"
                  style={{
                    inset: -22,
                    border: "1px dashed rgba(109,40,217,0.22)",
                  }}
                />
                <div
                  className="absolute rounded-full sg-spin-r"
                  style={{
                    inset: -44,
                    border: "1px dashed rgba(37,99,235,0.14)",
                  }}
                />
              </div>
              {/* Spec table */}
              <div
                className="rounded-2xl p-4 w-full max-w-xs"
                style={{
                  background: "rgba(255,255,255,0.025)",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                {[
                  { k: "MCU", v: "ESP32 Dual-Core 240MHz" },
                  { k: "GPS", v: "NEO-6M · 10s Update" },
                  { k: "GSM", v: "SIM800L · 4G LTE" },
                  { k: "Sensor", v: "MAX30102 · HR + SpO2" },
                  { k: "Battery", v: "3.7V LiPo · 72h Life" },
                ].map((s, i) => (
                  <div
                    key={s.k}
                    className="flex justify-between items-center py-2"
                    style={{
                      borderBottom:
                        i < 4 ? "1px solid rgba(255,255,255,0.045)" : "none",
                    }}
                  >
                    <span
                      className="text-xs font-bold uppercase tracking-wider"
                      style={{ color: "#6B7280" }}
                    >
                      {s.k}
                    </span>
                    <span
                      className="text-xs font-semibold"
                      style={{ color: "#E2E8F0" }}
                    >
                      {s.v}
                    </span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            FEATURES GRID
        ══════════════════════════════════════════════ */}
        <section
          ref={featRef}
          className="px-4 sm:px-6 py-16 sm:py-24 max-w-6xl mx-auto"
        >
          <div className="text-center mb-12 sm:mb-16">
            <Reveal>
              <div
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-widest mb-4"
                style={{
                  background: "rgba(109,40,217,0.1)",
                  border: "1px solid rgba(109,40,217,0.3)",
                  color: "#A78BFA",
                }}
              >
                <Icon d={I.star} size={12} color="#A78BFA" /> Platform Features
              </div>
              <h2
                className="font-black leading-tight tracking-tighter"
                style={{ fontSize: "clamp(1.75rem,4.5vw,3rem)" }}
              >
                Everything your child's safety needs
              </h2>
            </Reveal>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {FEATURES.map((f, i) => (
              <div
                key={f.title}
                style={{
                  opacity: featVis ? 1 : 0,
                  transform: featVis ? "translateY(0)" : "translateY(36px)",
                  transition: `opacity 0.65s ease ${i * 0.09}s, transform 0.65s ease ${i * 0.09}s`,
                }}
              >
                <div
                  className="sg-card rounded-2xl p-6 h-full cursor-default"
                  style={{
                    background: "rgba(255,255,255,0.025)",
                    border: `1px solid ${f.color}22`,
                  }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className="w-11 h-11 rounded-2xl flex items-center justify-center"
                      style={{
                        background: f.color + "12",
                        border: `1px solid ${f.color}28`,
                      }}
                    >
                      <Icon d={f.icon} size={21} color={f.color} />
                    </div>
                    <span
                      className="text-xs font-extrabold rounded-lg px-2 py-1 tracking-wide"
                      style={{
                        color: f.color,
                        background: f.color + "10",
                        border: `1px solid ${f.color}22`,
                        fontSize: 9,
                      }}
                    >
                      {f.badge}
                    </span>
                  </div>
                  <h3
                    className="text-base font-extrabold mb-2 tracking-tight"
                    style={{ color: "#E2E8F0" }}
                  >
                    {f.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed m-0"
                    style={{ color: "#6B7280" }}
                  >
                    {f.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Reveal>
              <a
                href="#"
                className="sg-ghost inline-flex items-center gap-2 px-7 py-3 rounded-2xl text-sm font-bold"
                style={{
                  color: "#A78BFA",
                  background: "rgba(109,40,217,0.09)",
                  border: "1px solid rgba(109,40,217,0.28)",
                }}
              >
                Explore all features{" "}
                <Icon d={I.arrowR} size={15} color="#A78BFA" />
              </a>
            </Reveal>
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            TECH STACK
        ══════════════════════════════════════════════ */}
        <section
          ref={techRef}
          className="py-16 sm:py-24 px-4 sm:px-6"
          style={{
            background: "rgba(255,255,255,0.016)",
            borderTop: "1px solid rgba(255,255,255,0.055)",
            borderBottom: "1px solid rgba(255,255,255,0.055)",
          }}
        >
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-10 sm:mb-14">
              <Reveal>
                <div
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-widest mb-4"
                  style={{
                    background: "rgba(96,165,250,0.1)",
                    border: "1px solid rgba(96,165,250,0.3)",
                    color: "#60A5FA",
                  }}
                >
                  <Icon d={I.chip} size={12} color="#60A5FA" /> Tech Stack
                </div>
                <h2
                  className="font-black leading-tight tracking-tighter"
                  style={{ fontSize: "clamp(1.75rem,4vw,2.9rem)" }}
                >
                  Built on battle-tested tech
                </h2>
              </Reveal>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {TECH.map((t, i) => (
                <div
                  key={t.cat}
                  style={{
                    opacity: techVis ? 1 : 0,
                    transform: techVis ? "translateY(0)" : "translateY(28px)",
                    transition: `opacity 0.6s ease ${i * 0.08}s, transform 0.6s ease ${i * 0.08}s`,
                  }}
                >
                  <div
                    className="sg-card rounded-2xl p-4 sm:p-5 flex items-center gap-4"
                    style={{
                      background: "rgba(255,255,255,0.025)",
                      border: "1px solid rgba(255,255,255,0.06)",
                    }}
                  >
                    <span className="text-2xl sm:text-3xl flex-shrink-0">
                      {t.emoji}
                    </span>
                    <div>
                      <div
                        className="text-xs font-bold uppercase tracking-widest mb-1"
                        style={{ color: "#6B7280" }}
                      >
                        {t.cat}
                      </div>
                      <div
                        className="text-xs sm:text-sm font-semibold"
                        style={{ color: "#E2E8F0" }}
                      >
                        {t.val}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            HOW IT WORKS
        ══════════════════════════════════════════════ */}
        <section className="py-16 sm:py-24 px-4 sm:px-6 max-w-3xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <Reveal>
              <div
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-widest mb-4"
                style={{
                  background: "rgba(52,211,153,0.1)",
                  border: "1px solid rgba(52,211,153,0.3)",
                  color: "#34D399",
                }}
              >
                <Icon d={I.zap} size={12} color="#34D399" /> How it works
              </div>
              <h2
                className="font-black leading-tight tracking-tighter"
                style={{ fontSize: "clamp(1.75rem,4vw,2.9rem)" }}
              >
                Protection in 3 simple steps
              </h2>
            </Reveal>
          </div>
          {STEPS.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.15}>
              <div
                className="flex gap-5 sm:gap-7 relative"
                style={{ paddingBottom: i < 2 ? 36 : 0 }}
              >
                {i < 2 && (
                  <div
                    className="absolute left-6 sm:left-7 rounded-full"
                    style={{
                      top: 56,
                      bottom: 0,
                      width: 2,
                      background: `linear-gradient(to bottom,${s.color}55,transparent)`,
                    }}
                  />
                )}
                <div
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-xl sm:text-2xl flex-shrink-0 z-10"
                  style={{
                    background: `${s.color}18`,
                    border: `2px solid ${s.color}45`,
                  }}
                >
                  {s.emoji}
                </div>
                <div className="pt-2 sm:pt-2.5">
                  <div
                    className="text-xs font-extrabold tracking-widest mb-1.5"
                    style={{ color: s.color }}
                  >
                    STEP {s.n}
                  </div>
                  <h3
                    className="text-lg sm:text-xl font-extrabold mb-2 tracking-tight"
                    style={{ color: "#E2E8F0" }}
                  >
                    {s.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "#6B7280", maxWidth: 480 }}
                  >
                    {s.desc}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </section>

        {/* ══════════════════════════════════════════════
            TESTIMONIALS
        ══════════════════════════════════════════════ */}
        <section
          ref={reviewRef}
          className="py-16 sm:py-24 px-4 sm:px-6"
          style={{
            background: "rgba(109,40,217,0.04)",
            borderTop: "1px solid rgba(109,40,217,0.14)",
            borderBottom: "1px solid rgba(109,40,217,0.14)",
          }}
        >
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-10 sm:mb-14">
              <Reveal>
                <h2
                  className="font-black leading-tight tracking-tighter mb-2"
                  style={{ fontSize: "clamp(1.75rem,4vw,2.9rem)" }}
                >
                  Trusted by families
                </h2>
                <p className="text-sm" style={{ color: "#6B7280" }}>
                  Real parents. Real peace of mind.
                </p>
              </Reveal>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {REVIEWS.map((r, i) => (
                <div
                  key={r.name}
                  style={{
                    opacity: reviewVis ? 1 : 0,
                    transform: reviewVis ? "translateY(0)" : "translateY(32px)",
                    transition: `opacity 0.65s ease ${i * 0.12}s, transform 0.65s ease ${i * 0.12}s`,
                  }}
                >
                  <div
                    className="sg-card rounded-2xl p-6 h-full"
                    style={{
                      background: "rgba(255,255,255,0.028)",
                      border: "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    <div className="flex gap-1 mb-4">
                      {[...Array(5)].map((_, si) => (
                        <Icon key={si} d={I.star} size={14} color="#FBBF24" />
                      ))}
                    </div>
                    <p
                      className="text-sm leading-relaxed mb-5 italic"
                      style={{ color: "#9CA3AF" }}
                    >
                      "{r.text}"
                    </p>
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-black text-white flex-shrink-0"
                        style={{
                          background: "linear-gradient(135deg,#6D28D9,#2563EB)",
                        }}
                      >
                        {r.avatar}
                      </div>
                      <div>
                        <div
                          className="text-sm font-bold"
                          style={{ color: "#E2E8F0" }}
                        >
                          {r.name}
                        </div>
                        <div className="text-xs" style={{ color: "#6B7280" }}>
                          {r.role}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            FINAL CTA
        ══════════════════════════════════════════════ */}
        <section className="py-24 sm:py-32 px-4 sm:px-6 text-center relative overflow-hidden">
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at center,rgba(109,40,217,0.18) 0%,transparent 65%)",
            }}
          />
          <div
            aria-hidden="true"
            className="absolute rounded-full pointer-events-none"
            style={{
              top: "50%",
              left: "50%",
              transform: "translate(-50%,-50%)",
              width: "min(600px,90vw)",
              height: "min(600px,90vw)",
              border: "1px solid rgba(109,40,217,0.1)",
            }}
          />
          <div
            aria-hidden="true"
            className="absolute rounded-full pointer-events-none"
            style={{
              top: "50%",
              left: "50%",
              transform: "translate(-50%,-50%)",
              width: "min(900px,140vw)",
              height: "min(900px,140vw)",
              border: "1px solid rgba(109,40,217,0.06)",
            }}
          />

          <div className="relative z-10 max-w-2xl mx-auto">
            <Reveal>
              <div className="text-5xl sm:text-6xl mb-6 sg-float">🛡️</div>
              <h2
                className="font-black leading-none tracking-tighter mb-5"
                style={{
                  fontSize: "clamp(2rem,6vw,4rem)",
                  background:
                    "linear-gradient(135deg,#ffffff 0%,#A78BFA 50%,#60A5FA 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Start protecting
                <br />
                your child today
              </h2>
              <p
                className="text-base sm:text-lg leading-relaxed mb-10"
                style={{ color: "#6B7280" }}
              >
                Join families across Bangladesh using SafeGuard for real-time
                child safety — GPS, health, and AI in your pocket.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
                <a
                  href="#"
                  className="sg-btn flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl text-base font-extrabold text-white"
                  style={{
                    background: "linear-gradient(135deg,#6D28D9,#2563EB)",
                    boxShadow: "0 0 50px rgba(109,40,217,0.5)",
                  }}
                >
                  <Icon d={I.shield} size={18} color="white" /> Get Started Free
                </a>
                <a
                  href="#"
                  className="sg-ghost flex items-center justify-center gap-2 px-7 py-4 rounded-2xl text-base font-bold"
                  style={{
                    color: "#9CA3AF",
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  Talk to us <Icon d={I.arrowR} size={16} />
                </a>
              </div>
              <div className="flex flex-wrap gap-4 sm:gap-6 justify-center">
                {["No credit card required", "Free setup", "24/7 support"].map(
                  (t) => (
                    <div
                      key={t}
                      className="flex items-center gap-2 text-xs"
                      style={{ color: "#6B7280" }}
                    >
                      <div
                        className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{
                          background: "rgba(34,197,94,0.14)",
                          border: "1px solid rgba(34,197,94,0.32)",
                        }}
                      >
                        <Icon d={I.check} size={9} color="#22C55E" />
                      </div>
                      {t}
                    </div>
                  ),
                )}
              </div>
            </Reveal>
          </div>
        </section>
      </div>
    </main>
  );
}
