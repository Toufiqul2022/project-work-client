"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

// ─── SVG ICON ────────────────────────────────────────────────────────────────
const Icon = ({ d, size = 20, color = "currentColor" }) => (
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
const I = {
  shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  gps: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z M12 7a3 3 0 100 6 3 3 0 000-6z",
  heart:
    "M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z",
  bell: "M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 01-3.46 0",
  zone: "M12 2L2 7l10 5 10-5-10-5z M2 17l10 5 10-5 M2 12l10 5 10-5",
  wifi: "M5 12.55a11 11 0 0114.08 0 M1.42 9a16 16 0 0121.16 0 M8.53 16.11a6 6 0 016.95 0 M12 20h.01",
  battery: "M23 7h-2a2 2 0 00-2 2v6a2 2 0 002 2h2V7z M1 7h16v10H1z",
  zap: "M13 2L3 14h9l-1 8 10-12h-9l1-8z",
  check: "M20 6L9 17l-5-5",
  arrowR: "M5 12h14 M12 5l7 7-7 7",
  star: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  chip: "M9 3H5a2 2 0 00-2 2v4 M9 3h6 M15 3h4a2 2 0 012 2v4 M21 9v6 M21 15v4a2 2 0 01-2 2h-4 M15 21H9 M9 21H5a2 2 0 01-2-2v-4 M3 15V9",
};

// ─── PULSE DOT ───────────────────────────────────────────────────────────────
function PulseDot({ color = "#22C55E", size = 8 }) {
  return (
    <span
      style={{
        position: "relative",
        display: "inline-flex",
        width: size,
        height: size,
        flexShrink: 0,
      }}
    >
      <span
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          background: color,
          opacity: 0.4,
          animation: "lp-ping 1.6s ease-in-out infinite",
        }}
      />
      <span
        style={{
          position: "relative",
          width: size,
          height: size,
          borderRadius: "50%",
          background: color,
        }}
      />
    </span>
  );
}

// ─── ANIMATED COUNTER ────────────────────────────────────────────────────────
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

// ─── USE REVEAL ──────────────────────────────────────────────────────────────
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
      { threshold: 0.12 },
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, vis];
}

// ─── LIVE MAP ────────────────────────────────────────────────────────────────
function LiveMap() {
  const [ping, setPing] = useState(false);
  useEffect(() => {
    const t = setInterval(() => setPing((p) => !p), 2000);
    return () => clearInterval(t);
  }, []);
  return (
    <div
      style={{
        position: "relative",
        borderRadius: 18,
        overflow: "hidden",
        background: "#050D1A",
        border: "1px solid rgba(96,165,250,0.15)",
        height: 200,
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
        <path
          d="M70,75 Q105,95 130,80 Q160,65 180,108"
          stroke="#2563EB"
          strokeWidth="1.5"
          fill="none"
          strokeDasharray="5 3"
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
          style={{ transition: "r 0.9s ease,opacity 0.9s ease" }}
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
        style={{
          position: "absolute",
          top: 10,
          left: 12,
          display: "flex",
          alignItems: "center",
          gap: 6,
          background: "rgba(0,0,0,0.72)",
          backdropFilter: "blur(8px)",
          border: "1px solid rgba(34,197,94,0.3)",
          borderRadius: 8,
          padding: "4px 10px",
          fontSize: 10,
          fontWeight: 700,
          color: "#22C55E",
        }}
      >
        <PulseDot color="#22C55E" size={6} /> LIVE
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 10,
          left: 12,
          right: 12,
          background: "rgba(0,0,0,0.72)",
          backdropFilter: "blur(8px)",
          borderRadius: 9,
          padding: "7px 12px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span style={{ fontSize: 11, color: "#E2E8F0", fontWeight: 600 }}>
          📍 Mirpur 10, Dhaka
        </span>
        <span style={{ fontSize: 9, color: "#4B5563" }}>2s ago</span>
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
      style={{
        background: "rgba(239,68,68,0.07)",
        border: "1px solid rgba(239,68,68,0.2)",
        borderRadius: 18,
        padding: "18px 20px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 14,
        }}
      >
        <span
          style={{
            fontSize: 10,
            fontWeight: 700,
            color: "#6B7280",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
          }}
        >
          Heart Rate
        </span>
        <span
          style={{
            fontSize: 9,
            fontWeight: 700,
            color: "#22C55E",
            background: "rgba(34,197,94,0.1)",
            border: "1px solid rgba(34,197,94,0.25)",
            borderRadius: 20,
            padding: "2px 8px",
          }}
        >
          ● Normal
        </span>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: 6,
          marginBottom: 12,
        }}
      >
        <span
          style={{
            fontSize: 42,
            fontWeight: 900,
            color: "#EF4444",
            lineHeight: 1,
            transition: "all 0.5s",
          }}
        >
          {bpm}
        </span>
        <span style={{ fontSize: 13, color: "#6B7280", fontWeight: 600 }}>
          BPM
        </span>
      </div>
      <svg
        viewBox="0 0 260 52"
        style={{ width: "100%", height: 52, display: "block" }}
      >
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

// ─── DATA ────────────────────────────────────────────────────────────────────
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

// ─── HERO ANIMATED ITEM WRAPPER ──────────────────────────────────────────────
// ✅ FIX: uses CSS class with animationDelay only — no mixing with shorthand `animation`
function HeroItem({ delay, children }) {
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVis(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  return (
    <div
      style={{
        opacity: vis ? 1 : 0,
        transform: vis ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.7s ease, transform 0.7s ease`,
      }}
    >
      {children}
    </div>
  );
}

// ─── SECTION REVEAL WRAPPER ──────────────────────────────────────────────────
function Reveal({ delay = 0, children, style = {} }) {
  const [ref, vis] = useReveal();
  return (
    <div
      ref={ref}
      style={{
        opacity: vis ? 1 : 0,
        transform: vis ? "translateY(0)" : "translateY(32px)",
        transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ─── LANDING PAGE ─────────────────────────────────────────────────────────────
export default function LandingPage() {
  const [featRef, featVis] = useReveal();
  const [statsRef, statsVis] = useReveal();
  const [techRef, techVis] = useReveal();
  const [reviewRef, reviewVis] = useReveal();

  return (
    <main
      style={{
        background: "#060C16",
        color: "#E2E8F0",
        fontFamily: "'DM Sans',system-ui,sans-serif",
        overflowX: "hidden",
      }}
    >
      {/* ── GLOBAL KEYFRAMES ── */}
      <style>{`
        @keyframes lp-ping   { 0%,100%{transform:scale(1);opacity:0.4} 50%{transform:scale(2.4);opacity:0} }
        @keyframes lp-float  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        @keyframes lp-spin   { to{transform:rotate(360deg)} }
        @keyframes lp-spin-r { to{transform:rotate(-360deg)} }
        @keyframes lp-shimmer{ 0%{background-position:200% center} 100%{background-position:-200% center} }
        @keyframes lp-blink  { 0%,100%{opacity:1} 50%{opacity:0.25} }
        @keyframes lp-slide  { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        .lp-hover-lift { transition:transform 0.25s ease,box-shadow 0.25s ease; }
        .lp-hover-lift:hover { transform:translateY(-6px); box-shadow:0 24px 48px rgba(0,0,0,0.4); }
        .lp-btn:hover { filter:brightness(1.08); transform:translateY(-2px); }
        .lp-btn { transition:filter 0.2s,transform 0.2s; }
        .lp-ghost:hover { background:rgba(255,255,255,0.09) !important; }
        .lp-ghost { transition:background 0.2s; }
        * { box-sizing:border-box; }
      `}</style>

      {/* ── AMBIENT GLOWS ── */}
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-15%",
            left: "50%",
            transform: "translateX(-50%)",
            width: 1000,
            height: 1000,
            borderRadius: "50%",
            background:
              "radial-gradient(circle,rgba(109,40,217,0.13) 0%,transparent 65%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "35%",
            left: "-8%",
            width: 700,
            height: 700,
            borderRadius: "50%",
            background:
              "radial-gradient(circle,rgba(37,99,235,0.09) 0%,transparent 65%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "65%",
            right: "-8%",
            width: 600,
            height: 600,
            borderRadius: "50%",
            background:
              "radial-gradient(circle,rgba(34,197,94,0.07) 0%,transparent 65%)",
          }}
        />
      </div>

      {/* ── GRID PATTERN ── */}
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.022) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.022) 1px,transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage:
            "radial-gradient(ellipse at 50% 0%, black 20%,transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at 50% 0%, black 20%,transparent 75%)",
        }}
      />

      <div style={{ position: "relative", zIndex: 1 }}>
        {/* ╔══════════════════════════════════════════════════════╗
            ║                   HERO SECTION                      ║
            ╚══════════════════════════════════════════════════════╝ */}
        <section
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "130px 24px 80px",
            textAlign: "center",
          }}
        >
          {/* Badge */}
          <HeroItem delay={80}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "7px 18px",
                borderRadius: 24,
                background: "rgba(34,197,94,0.08)",
                border: "1px solid rgba(34,197,94,0.28)",
                fontSize: 11,
                fontWeight: 800,
                color: "#22C55E",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginBottom: 30,
              }}
            >
              <PulseDot color="#22C55E" size={7} /> IoT Child Safety —
              Bangladesh
            </div>
          </HeroItem>

          {/* H1 */}
          <HeroItem delay={200}>
            <h1
              style={{
                fontSize: "clamp(2.8rem,7.5vw,5.5rem)",
                fontWeight: 900,
                lineHeight: 1.04,
                letterSpacing: "-0.045em",
                margin: "0 0 26px",
                maxWidth: 860,
              }}
            >
              <span style={{ display: "block", color: "#F1F5F9" }}>
                Keep Your Child
              </span>
              <span
                style={{
                  display: "block",
                  background:
                    "linear-gradient(90deg,#A78BFA,#60A5FA,#34D399,#A78BFA)",
                  backgroundSize: "300% auto",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  animation: "lp-shimmer 4.5s linear infinite",
                }}
              >
                Safe. Always.
              </span>
            </h1>
          </HeroItem>

          {/* Subtitle */}
          <HeroItem delay={360}>
            <p
              style={{
                fontSize: "clamp(1rem,2.3vw,1.18rem)",
                color: "#6B7280",
                maxWidth: 560,
                lineHeight: 1.8,
                margin: "0 0 44px",
              }}
            >
              SafeGuard combines an{" "}
              <strong style={{ color: "#9CA3AF", fontWeight: 700 }}>
                ESP32 IoT wearable
              </strong>
              , real-time GPS, biometric health monitoring, and TensorFlow.js
              anomaly detection into one parent dashboard.
            </p>
          </HeroItem>

          {/* CTAs */}
          <HeroItem delay={500}>
            <div
              style={{
                display: "flex",
                gap: 14,
                justifyContent: "center",
                flexWrap: "wrap",
                marginBottom: 48,
              }}
            >
              <Link
                href="/auth/register"
                className="lp-btn"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "15px 34px",
                  borderRadius: 14,
                  fontSize: 15,
                  fontWeight: 800,
                  color: "white",
                  textDecoration: "none",
                  background: "linear-gradient(135deg,#6D28D9,#2563EB)",
                  boxShadow: "0 0 40px rgba(109,40,217,0.45)",
                }}
              >
                <Icon d={I.shield} size={17} color="white" /> Get Started Free
              </Link>
              <Link
                href="/dashboard"
                className="lp-ghost"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "15px 28px",
                  borderRadius: 14,
                  fontSize: 15,
                  fontWeight: 700,
                  color: "#9CA3AF",
                  textDecoration: "none",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                Live Demo <Icon d={I.arrowR} size={16} />
              </Link>
            </div>
          </HeroItem>

          {/* Status pills */}
          <HeroItem delay={640}>
            <div
              style={{
                display: "flex",
                gap: 10,
                justifyContent: "center",
                flexWrap: "wrap",
                marginBottom: 70,
              }}
            >
              {[
                { label: "SAFE", color: "#22C55E", dot: true },
                { label: "🔋 78%", color: "#60A5FA" },
                { label: "📡 4/4", color: "#A78BFA" },
                { label: "♥ 72 BPM", color: "#EF4444" },
              ].map((s) => (
                <div
                  key={s.label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "6px 16px",
                    borderRadius: 24,
                    background: s.color + "0d",
                    border: `1px solid ${s.color}28`,
                    fontSize: 11,
                    fontWeight: 700,
                    color: s.color,
                  }}
                >
                  {s.dot && <PulseDot color={s.color} size={7} />}
                  {s.label}
                </div>
              ))}
            </div>
          </HeroItem>

          {/* ── DASHBOARD MOCKUP ──
              ✅ FIX: No `animation` shorthand mixed with `animationDelay`.
              Uses a single `transition` on the wrapper instead. */}
          <HeroItem delay={820}>
            <div style={{ width: "100%", maxWidth: 1020 }}>
              <div
                style={{
                  background: "rgba(255,255,255,0.025)",
                  border: "1px solid rgba(255,255,255,0.09)",
                  borderRadius: 24,
                  padding: 3,
                  boxShadow: "0 50px 100px rgba(0,0,0,0.65)",
                }}
              >
                <div
                  style={{
                    background: "#0D1117",
                    borderRadius: 22,
                    overflow: "hidden",
                  }}
                >
                  {/* Browser chrome */}
                  <div
                    style={{
                      background: "#080E18",
                      borderBottom: "1px solid rgba(255,255,255,0.06)",
                      padding: "11px 18px",
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    {["#EF4444", "#F59E0B", "#22C55E"].map((c) => (
                      <div
                        key={c}
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: "50%",
                          background: c,
                          opacity: 0.7,
                        }}
                      />
                    ))}
                    <div
                      style={{
                        marginLeft: 8,
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.07)",
                        borderRadius: 6,
                        padding: "3px 14px",
                        fontSize: 10,
                        color: "#4B5563",
                      }}
                    >
                      safeguard.vercel.app/dashboard
                    </div>
                  </div>
                  {/* Layout */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "196px 1fr",
                      minHeight: 400,
                    }}
                  >
                    {/* Sidebar */}
                    <div
                      style={{
                        background: "#080E18",
                        borderRight: "1px solid rgba(255,255,255,0.05)",
                        padding: "16px 10px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          padding: "0 8px 14px",
                          borderBottom: "1px solid rgba(255,255,255,0.05)",
                          marginBottom: 10,
                        }}
                      >
                        <div
                          style={{
                            width: 28,
                            height: 28,
                            borderRadius: 8,
                            background:
                              "linear-gradient(135deg,#6D28D9,#2563EB)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 13,
                          }}
                        >
                          🛡️
                        </div>
                        <span
                          style={{
                            fontSize: 12,
                            fontWeight: 900,
                            background:
                              "linear-gradient(90deg,#A78BFA,#60A5FA)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                          }}
                        >
                          SafeGuard
                        </span>
                      </div>
                      {[
                        { label: "Overview", icon: "🛡️", active: true },
                        { label: "Tracking", icon: "🗺️", active: false },
                        { label: "Health", icon: "💓", active: false },
                        { label: "Alerts", icon: "🚨", badge: 1 },
                        { label: "Zones", icon: "📍", active: false },
                        { label: "Contacts", icon: "📞", active: false },
                      ].map((n) => (
                        <div
                          key={n.label}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            padding: "7px 10px",
                            borderRadius: 9,
                            background: n.active
                              ? "rgba(109,40,217,0.15)"
                              : "transparent",
                            border: n.active
                              ? "1px solid rgba(109,40,217,0.3)"
                              : "1px solid transparent",
                            marginBottom: 2,
                            fontSize: 11,
                            fontWeight: 600,
                            color: n.active ? "#A78BFA" : "#4B5563",
                          }}
                        >
                          <span style={{ fontSize: 12 }}>{n.icon}</span>
                          {n.label}
                          {n.badge && (
                            <span
                              style={{
                                marginLeft: "auto",
                                background: "#EF4444",
                                color: "white",
                                borderRadius: 8,
                                fontSize: 8,
                                padding: "1px 5px",
                                fontWeight: 800,
                              }}
                            >
                              {n.badge}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                    {/* Content */}
                    <div
                      style={{ padding: "16px 18px", background: "#0a1020" }}
                    >
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr 1fr",
                          gap: 10,
                          marginBottom: 12,
                        }}
                      >
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
                            style={{
                              background: "#0D1117",
                              border: `1px solid ${s.color}18`,
                              borderTop: `2px solid ${s.color}`,
                              borderRadius: 12,
                              padding: "11px 13px",
                            }}
                          >
                            <div style={{ fontSize: 16, marginBottom: 4 }}>
                              {s.icon}
                            </div>
                            <div
                              style={{
                                fontSize: 16,
                                fontWeight: 800,
                                color: s.color,
                              }}
                            >
                              {s.value}
                            </div>
                            <div
                              style={{
                                fontSize: 9,
                                color: "#4B5563",
                                marginTop: 2,
                              }}
                            >
                              {s.label}
                            </div>
                          </div>
                        ))}
                      </div>
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: 12,
                        }}
                      >
                        <LiveMap />
                        <HeartRate />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </HeroItem>
        </section>

        {/* ╔══════════════════════════════════════════════════════╗
            ║                   STATS STRIP                       ║
            ╚══════════════════════════════════════════════════════╝ */}
        <section
          ref={statsRef}
          style={{ padding: "72px 24px", maxWidth: 1100, margin: "0 auto" }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4,1fr)",
              gap: 16,
            }}
          >
            {STATS.map((s, i) => (
              <div
                key={s.label}
                style={{
                  opacity: statsVis ? 1 : 0,
                  transform: statsVis ? "translateY(0)" : "translateY(28px)",
                  transition: `opacity 0.65s ease ${i * 0.1}s,transform 0.65s ease ${i * 0.1}s`,
                }}
              >
                <div
                  className="lp-hover-lift"
                  style={{
                    background: "rgba(255,255,255,0.025)",
                    border: `1px solid ${s.color}20`,
                    borderTop: `2px solid ${s.color}`,
                    borderRadius: 20,
                    padding: "28px 20px",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      fontSize: 44,
                      fontWeight: 900,
                      color: s.color,
                      letterSpacing: "-0.04em",
                      lineHeight: 1,
                    }}
                  >
                    {statsVis ? (
                      <Counter target={s.value} suffix={s.suffix} />
                    ) : (
                      `0${s.suffix}`
                    )}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: "#6B7280",
                      fontWeight: 600,
                      marginTop: 8,
                    }}
                  >
                    {s.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ╔══════════════════════════════════════════════════════╗
            ║            LIVE ALERTS + DEVICE MOCKUP              ║
            ╚══════════════════════════════════════════════════════╝ */}
        <section
          style={{
            padding: "60px 24px 100px",
            maxWidth: 1100,
            margin: "0 auto",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 56,
              alignItems: "center",
            }}
          >
            {/* Left */}
            <Reveal>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "5px 14px",
                  borderRadius: 20,
                  background: "rgba(239,68,68,0.1)",
                  border: "1px solid rgba(239,68,68,0.3)",
                  fontSize: 11,
                  fontWeight: 800,
                  color: "#EF4444",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  marginBottom: 20,
                }}
              >
                <PulseDot color="#EF4444" size={7} /> Live Alerts
              </div>
              <h2
                style={{
                  fontSize: "clamp(1.9rem,3.5vw,2.9rem)",
                  fontWeight: 900,
                  lineHeight: 1.08,
                  letterSpacing: "-0.035em",
                  margin: "0 0 18px",
                }}
              >
                Instant alerts,
                <br />
                <span
                  style={{
                    background: "linear-gradient(90deg,#A78BFA,#60A5FA)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  zero delays
                </span>
              </h2>
              <p
                style={{
                  fontSize: 14.5,
                  color: "#6B7280",
                  lineHeight: 1.78,
                  marginBottom: 28,
                }}
              >
                SOS, geofence exit, or AI anomaly — all 5 emergency contacts get
                notified in seconds with GPS coordinates and a one-tap live
                tracking link.
              </p>
              <div
                style={{ display: "flex", flexDirection: "column", gap: 10 }}
              >
                {ALERTS.map((a) => (
                  <div
                    key={a.type}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "12px 16px",
                      borderRadius: 14,
                      background: a.color + "0b",
                      border: `1px solid ${a.color}28`,
                      borderLeft: `3px solid ${a.color}`,
                    }}
                  >
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 12 }}
                    >
                      <div
                        style={{
                          width: 34,
                          height: 34,
                          borderRadius: 10,
                          background: a.color + "18",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 15,
                        }}
                      >
                        {a.emoji}
                      </div>
                      <div>
                        <div
                          style={{
                            fontSize: 13,
                            fontWeight: 700,
                            color: "#E2E8F0",
                          }}
                        >
                          {a.type} Alert
                        </div>
                        <div
                          style={{
                            fontSize: 10,
                            color: "#6B7280",
                            marginTop: 1,
                          }}
                        >
                          {a.loc} · {a.time}
                        </div>
                      </div>
                    </div>
                    <span
                      style={{
                        fontSize: 9,
                        fontWeight: 700,
                        color: a.status === "Resolved" ? "#22C55E" : "#F59E0B",
                        background:
                          (a.status === "Resolved" ? "#22C55E" : "#F59E0B") +
                          "14",
                        border: `1px solid ${a.status === "Resolved" ? "#22C55E" : "#F59E0B"}28`,
                        borderRadius: 20,
                        padding: "3px 9px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {a.status === "Resolved" ? "✓ Resolved" : "● Active"}
                    </span>
                  </div>
                ))}
              </div>
            </Reveal>
            {/* Right — device */}
            <Reveal delay={0.15}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 22,
                }}
              >
                {/* Wearable circle */}
                <div
                  style={{
                    position: "relative",
                    animation: "lp-float 4s ease-in-out infinite",
                  }}
                >
                  <div
                    style={{
                      width: 210,
                      height: 210,
                      borderRadius: "50%",
                      background: "linear-gradient(145deg,#0f1b30,#1c2e50)",
                      border: "3px solid rgba(109,40,217,0.45)",
                      boxShadow:
                        "0 0 70px rgba(109,40,217,0.3),inset 0 0 50px rgba(0,0,0,0.5)",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        top: 12,
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: 60,
                        height: 2,
                        background: "rgba(109,40,217,0.55)",
                        borderRadius: 2,
                      }}
                    />
                    <div style={{ fontSize: 40, marginBottom: 8 }}>🛡️</div>
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 900,
                        color: "#A78BFA",
                        letterSpacing: "0.1em",
                      }}
                    >
                      SAFEGUARD
                    </div>
                    <div
                      style={{ fontSize: 9, color: "#4B5563", marginTop: 5 }}
                    >
                      ESP32 · NEO-6M · SIM800L
                    </div>
                    <div
                      style={{
                        position: "absolute",
                        bottom: 24,
                        display: "flex",
                        gap: 10,
                      }}
                    >
                      <PulseDot color="#22C55E" size={8} />
                      <PulseDot color="#60A5FA" size={8} />
                      <PulseDot color="#EF4444" size={8} />
                    </div>
                  </div>
                  {/* Orbit rings — use CSS animation property directly, no delay conflict */}
                  <div
                    style={{
                      position: "absolute",
                      inset: -22,
                      borderRadius: "50%",
                      border: "1px dashed rgba(109,40,217,0.22)",
                      animation: "lp-spin 14s linear infinite",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      inset: -44,
                      borderRadius: "50%",
                      border: "1px dashed rgba(37,99,235,0.14)",
                      animation: "lp-spin-r 22s linear infinite",
                    }}
                  />
                </div>
                {/* Spec table */}
                <div
                  style={{
                    background: "rgba(255,255,255,0.025)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    borderRadius: 16,
                    padding: "14px 20px",
                    width: "100%",
                    maxWidth: 310,
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
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "7px 0",
                        borderBottom:
                          i < 4 ? "1px solid rgba(255,255,255,0.045)" : "none",
                      }}
                    >
                      <span
                        style={{
                          fontSize: 10,
                          color: "#6B7280",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "0.07em",
                        }}
                      >
                        {s.k}
                      </span>
                      <span
                        style={{
                          fontSize: 11,
                          color: "#E2E8F0",
                          fontWeight: 600,
                        }}
                      >
                        {s.v}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ╔══════════════════════════════════════════════════════╗
            ║                  FEATURES GRID                      ║
            ╚══════════════════════════════════════════════════════╝ */}
        <section
          ref={featRef}
          style={{
            padding: "80px 24px 100px",
            maxWidth: 1100,
            margin: "0 auto",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <Reveal>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "5px 14px",
                  borderRadius: 20,
                  background: "rgba(109,40,217,0.1)",
                  border: "1px solid rgba(109,40,217,0.3)",
                  fontSize: 11,
                  fontWeight: 800,
                  color: "#A78BFA",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  marginBottom: 18,
                }}
              >
                <Icon d={I.star} size={12} color="#A78BFA" /> Platform Features
              </div>
              <h2
                style={{
                  fontSize: "clamp(1.9rem,4vw,3rem)",
                  fontWeight: 900,
                  lineHeight: 1.1,
                  letterSpacing: "-0.035em",
                  margin: 0,
                }}
              >
                Everything your child's safety needs
              </h2>
            </Reveal>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3,1fr)",
              gap: 18,
            }}
          >
            {FEATURES.map((f, i) => (
              <div
                key={f.title}
                style={{
                  opacity: featVis ? 1 : 0,
                  transform: featVis ? "translateY(0)" : "translateY(36px)",
                  transition: `opacity 0.65s ease ${i * 0.09}s,transform 0.65s ease ${i * 0.09}s`,
                }}
              >
                <div
                  className="lp-hover-lift"
                  style={{
                    background: "rgba(255,255,255,0.025)",
                    border: `1px solid ${f.color}22`,
                    borderRadius: 20,
                    padding: "26px 24px 28px",
                    height: "100%",
                    cursor: "default",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      marginBottom: 16,
                    }}
                  >
                    <div
                      style={{
                        width: 46,
                        height: 46,
                        borderRadius: 14,
                        background: f.color + "12",
                        border: `1px solid ${f.color}28`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Icon d={f.icon} size={21} color={f.color} />
                    </div>
                    <span
                      style={{
                        fontSize: 9,
                        fontWeight: 800,
                        color: f.color,
                        background: f.color + "10",
                        border: `1px solid ${f.color}22`,
                        borderRadius: 8,
                        padding: "3px 9px",
                        letterSpacing: "0.07em",
                      }}
                    >
                      {f.badge}
                    </span>
                  </div>
                  <h3
                    style={{
                      fontSize: 16,
                      fontWeight: 800,
                      color: "#E2E8F0",
                      margin: "0 0 9px",
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {f.title}
                  </h3>
                  <p
                    style={{
                      fontSize: 13,
                      color: "#6B7280",
                      lineHeight: 1.7,
                      margin: 0,
                    }}
                  >
                    {f.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 44 }}>
            <Reveal>
              <Link
                href="/features"
                className="lp-ghost"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "12px 28px",
                  borderRadius: 12,
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#A78BFA",
                  textDecoration: "none",
                  background: "rgba(109,40,217,0.09)",
                  border: "1px solid rgba(109,40,217,0.28)",
                }}
              >
                Explore all features{" "}
                <Icon d={I.arrowR} size={15} color="#A78BFA" />
              </Link>
            </Reveal>
          </div>
        </section>

        {/* ╔══════════════════════════════════════════════════════╗
            ║                 TECH STACK BAND                     ║
            ╚══════════════════════════════════════════════════════╝ */}
        <section
          ref={techRef}
          style={{
            padding: "80px 24px 100px",
            background: "rgba(255,255,255,0.016)",
            borderTop: "1px solid rgba(255,255,255,0.055)",
            borderBottom: "1px solid rgba(255,255,255,0.055)",
          }}
        >
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 50 }}>
              <Reveal>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "5px 14px",
                    borderRadius: 20,
                    background: "rgba(96,165,250,0.1)",
                    border: "1px solid rgba(96,165,250,0.3)",
                    fontSize: 11,
                    fontWeight: 800,
                    color: "#60A5FA",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    marginBottom: 18,
                  }}
                >
                  <Icon d={I.chip} size={12} color="#60A5FA" /> Tech Stack
                </div>
                <h2
                  style={{
                    fontSize: "clamp(1.9rem,4vw,2.9rem)",
                    fontWeight: 900,
                    letterSpacing: "-0.035em",
                    margin: 0,
                  }}
                >
                  Built on battle-tested tech
                </h2>
              </Reveal>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3,1fr)",
                gap: 14,
              }}
            >
              {TECH.map((t, i) => (
                <div
                  key={t.cat}
                  style={{
                    opacity: techVis ? 1 : 0,
                    transform: techVis ? "translateY(0)" : "translateY(28px)",
                    transition: `opacity 0.6s ease ${i * 0.08}s,transform 0.6s ease ${i * 0.08}s`,
                  }}
                >
                  <div
                    className="lp-hover-lift"
                    style={{
                      background: "rgba(255,255,255,0.025)",
                      border: "1px solid rgba(255,255,255,0.06)",
                      borderRadius: 16,
                      padding: "18px 20px",
                      display: "flex",
                      alignItems: "center",
                      gap: 16,
                    }}
                  >
                    <span style={{ fontSize: 26, flexShrink: 0 }}>
                      {t.emoji}
                    </span>
                    <div>
                      <div
                        style={{
                          fontSize: 10,
                          color: "#6B7280",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "0.1em",
                          marginBottom: 4,
                        }}
                      >
                        {t.cat}
                      </div>
                      <div
                        style={{
                          fontSize: 12,
                          color: "#E2E8F0",
                          fontWeight: 600,
                        }}
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

        {/* ╔══════════════════════════════════════════════════════╗
            ║                HOW IT WORKS                         ║
            ╚══════════════════════════════════════════════════════╝ */}
        <section
          style={{ padding: "100px 24px", maxWidth: 860, margin: "0 auto" }}
        >
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <Reveal>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "5px 14px",
                  borderRadius: 20,
                  background: "rgba(52,211,153,0.1)",
                  border: "1px solid rgba(52,211,153,0.3)",
                  fontSize: 11,
                  fontWeight: 800,
                  color: "#34D399",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  marginBottom: 18,
                }}
              >
                <Icon d={I.zap} size={12} color="#34D399" /> How it works
              </div>
              <h2
                style={{
                  fontSize: "clamp(1.9rem,4vw,2.9rem)",
                  fontWeight: 900,
                  letterSpacing: "-0.035em",
                  margin: 0,
                }}
              >
                Protection in 3 simple steps
              </h2>
            </Reveal>
          </div>
          {[
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
          ].map((s, i) => (
            <Reveal key={s.n} delay={i * 0.15}>
              <div
                style={{
                  display: "flex",
                  gap: 28,
                  paddingBottom: i < 2 ? 44 : 0,
                  position: "relative",
                }}
              >
                {i < 2 && (
                  <div
                    style={{
                      position: "absolute",
                      left: 27,
                      top: 58,
                      bottom: 0,
                      width: 2,
                      background: `linear-gradient(to bottom,${s.color}55,transparent)`,
                    }}
                  />
                )}
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: "50%",
                    background: `${s.color}18`,
                    border: `2px solid ${s.color}45`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 22,
                    flexShrink: 0,
                    zIndex: 1,
                  }}
                >
                  {s.emoji}
                </div>
                <div style={{ paddingTop: 10 }}>
                  <div
                    style={{
                      fontSize: 10,
                      fontWeight: 800,
                      color: s.color,
                      letterSpacing: "0.12em",
                      marginBottom: 6,
                    }}
                  >
                    STEP {s.n}
                  </div>
                  <h3
                    style={{
                      fontSize: 21,
                      fontWeight: 800,
                      color: "#E2E8F0",
                      margin: "0 0 9px",
                      letterSpacing: "-0.025em",
                    }}
                  >
                    {s.title}
                  </h3>
                  <p
                    style={{
                      fontSize: 14,
                      color: "#6B7280",
                      lineHeight: 1.75,
                      margin: 0,
                      maxWidth: 520,
                    }}
                  >
                    {s.desc}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </section>

        {/* ╔══════════════════════════════════════════════════════╗
            ║                TESTIMONIALS                         ║
            ╚══════════════════════════════════════════════════════╝ */}
        <section
          ref={reviewRef}
          style={{
            padding: "80px 24px 100px",
            background: "rgba(109,40,217,0.04)",
            borderTop: "1px solid rgba(109,40,217,0.14)",
            borderBottom: "1px solid rgba(109,40,217,0.14)",
          }}
        >
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 50 }}>
              <Reveal>
                <h2
                  style={{
                    fontSize: "clamp(1.9rem,4vw,2.9rem)",
                    fontWeight: 900,
                    letterSpacing: "-0.035em",
                    margin: "0 0 10px",
                  }}
                >
                  Trusted by families
                </h2>
                <p style={{ fontSize: 14, color: "#6B7280", margin: 0 }}>
                  Real parents. Real peace of mind.
                </p>
              </Reveal>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3,1fr)",
                gap: 18,
              }}
            >
              {REVIEWS.map((r, i) => (
                <div
                  key={r.name}
                  style={{
                    opacity: reviewVis ? 1 : 0,
                    transform: reviewVis ? "translateY(0)" : "translateY(32px)",
                    transition: `opacity 0.65s ease ${i * 0.12}s,transform 0.65s ease ${i * 0.12}s`,
                  }}
                >
                  <div
                    className="lp-hover-lift"
                    style={{
                      background: "rgba(255,255,255,0.028)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: 20,
                      padding: "26px 24px",
                      height: "100%",
                    }}
                  >
                    <div style={{ display: "flex", gap: 3, marginBottom: 14 }}>
                      {[...Array(5)].map((_, si) => (
                        <Icon key={si} d={I.star} size={14} color="#FBBF24" />
                      ))}
                    </div>
                    <p
                      style={{
                        fontSize: 14,
                        color: "#9CA3AF",
                        lineHeight: 1.75,
                        margin: "0 0 20px",
                        fontStyle: "italic",
                      }}
                    >
                      "{r.text}"
                    </p>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 12 }}
                    >
                      <div
                        style={{
                          width: 38,
                          height: 38,
                          borderRadius: "50%",
                          background: "linear-gradient(135deg,#6D28D9,#2563EB)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 14,
                          fontWeight: 800,
                          color: "white",
                        }}
                      >
                        {r.avatar}
                      </div>
                      <div>
                        <div
                          style={{
                            fontSize: 13,
                            fontWeight: 700,
                            color: "#E2E8F0",
                          }}
                        >
                          {r.name}
                        </div>
                        <div style={{ fontSize: 11, color: "#6B7280" }}>
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

        {/* ╔══════════════════════════════════════════════════════╗
            ║                   FINAL CTA                         ║
            ╚══════════════════════════════════════════════════════╝ */}
        <section
          style={{
            padding: "130px 24px 160px",
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(ellipse at center,rgba(109,40,217,0.18) 0%,transparent 65%)",
              pointerEvents: "none",
            }}
          />
          {/* Decorative rings */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%,-50%)",
              width: 600,
              height: 600,
              borderRadius: "50%",
              border: "1px solid rgba(109,40,217,0.1)",
              pointerEvents: "none",
            }}
          />
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%,-50%)",
              width: 900,
              height: 900,
              borderRadius: "50%",
              border: "1px solid rgba(109,40,217,0.06)",
              pointerEvents: "none",
            }}
          />

          <div style={{ position: "relative", zIndex: 1 }}>
            <Reveal>
              <div
                style={{
                  fontSize: 56,
                  marginBottom: 24,
                  animation: "lp-float 3.5s ease-in-out infinite",
                }}
              >
                🛡️
              </div>
              <h2
                style={{
                  fontSize: "clamp(2.2rem,5.5vw,4rem)",
                  fontWeight: 900,
                  lineHeight: 1.08,
                  letterSpacing: "-0.045em",
                  margin: "0 0 20px",
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
                style={{
                  fontSize: 16,
                  color: "#6B7280",
                  maxWidth: 460,
                  margin: "0 auto 44px",
                  lineHeight: 1.8,
                }}
              >
                Join families across Bangladesh using SafeGuard for real-time
                child safety — GPS, health, and AI in your pocket.
              </p>
              <div
                style={{
                  display: "flex",
                  gap: 14,
                  justifyContent: "center",
                  flexWrap: "wrap",
                  marginBottom: 32,
                }}
              >
                <Link
                  href="/auth/register"
                  className="lp-btn"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "16px 38px",
                    borderRadius: 14,
                    fontSize: 16,
                    fontWeight: 800,
                    color: "white",
                    textDecoration: "none",
                    background: "linear-gradient(135deg,#6D28D9,#2563EB)",
                    boxShadow: "0 0 50px rgba(109,40,217,0.5)",
                  }}
                >
                  <Icon d={I.shield} size={18} color="white" /> Get Started Free
                </Link>
                <Link
                  href="/contact"
                  className="lp-ghost"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "16px 30px",
                    borderRadius: 14,
                    fontSize: 16,
                    fontWeight: 700,
                    color: "#9CA3AF",
                    textDecoration: "none",
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  Talk to us <Icon d={I.arrowR} size={16} />
                </Link>
              </div>
              <div
                style={{
                  display: "flex",
                  gap: 24,
                  justifyContent: "center",
                  flexWrap: "wrap",
                }}
              >
                {["No credit card required", "Free setup", "24/7 support"].map(
                  (t) => (
                    <div
                      key={t}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 7,
                        fontSize: 12,
                        color: "#6B7280",
                      }}
                    >
                      <div
                        style={{
                          width: 16,
                          height: 16,
                          borderRadius: "50%",
                          background: "rgba(34,197,94,0.14)",
                          border: "1px solid rgba(34,197,94,0.32)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
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
