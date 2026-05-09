import { useState, useEffect, useRef } from "react";

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
const MOCK = {
  user: { name: "Rahim Uddin", id: "BD-2024-001" },
  device: { battery: 78, signal: 4, status: "SAFE", lastSeen: "2 min ago" },
  location: {
    lat: 23.8103,
    lng: 90.4125,
    address: "Mirpur 10, Dhaka",
    speed: 0,
  },
  heartRate: {
    bpm: 72,
    stress: "Low",
    trend: [68, 70, 72, 69, 74, 72, 71, 73, 72, 70, 72, 74],
  },
  alerts: [
    {
      id: 1,
      type: "SOS",
      time: "11:42 AM",
      location: "Mirpur 10",
      status: "Resolved",
      color: "#EF4444",
    },
    {
      id: 2,
      type: "Geofence",
      time: "09:15 AM",
      location: "Dhanmondi",
      status: "Active",
      color: "#F59E0B",
    },
    {
      id: 3,
      type: "Anomaly",
      time: "Yesterday",
      location: "Gulshan 1",
      status: "Resolved",
      color: "#8B5CF6",
    },
  ],
  contacts: [
    { name: "Karim (Father)", phone: "01711-XXXXXX", priority: 1 },
    { name: "Fatema (Mother)", phone: "01821-XXXXXX", priority: 2 },
    { name: "Uncle Jamal", phone: "01911-XXXXXX", priority: 3 },
    { name: "Emergency: 999", phone: "999", priority: 4 },
  ],
  safeZones: [
    { name: "Home", radius: "200m", status: "Active" },
    { name: "School", radius: "500m", status: "Active" },
    { name: "Grandma's House", radius: "150m", status: "Inactive" },
  ],
  routes: [
    { time: "08:30", loc: "Home → School", dist: "2.3 km" },
    { time: "02:00", loc: "School → Market", dist: "0.8 km" },
    { time: "03:45", loc: "Market → Home", dist: "2.1 km" },
  ],
};

// ─── ICONS (inline SVG) ───────────────────────────────────────────────────────
const Icon = ({
  d,
  size = 16,
  color = "currentColor",
  fill = "none",
  stroke = 2,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={fill}
    stroke={color}
    strokeWidth={stroke}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d={d} />
  </svg>
);
const Icons = {
  shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  map: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z M12 7a3 3 0 100 6 3 3 0 000-6z",
  heart:
    "M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z",
  bell: "M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 01-3.46 0",
  route: "M3 12h18 M3 6h18 M3 18h18",
  zone: "M12 2L2 7l10 5 10-5-10-5z M2 17l10 5 10-5 M2 12l10 5 10-5",
  contacts:
    "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M9 11a4 4 0 100-8 4 4 0 000 8z M23 21v-2a4 4 0 00-3-3.87 M16 3.13a4 4 0 010 7.75",
  report:
    "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8",
  settings:
    "M12 15a3 3 0 100-6 3 3 0 000 6z M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z",
  battery: "M23 7h-2a2 2 0 00-2 2v6a2 2 0 002 2h2V7z M1 7h16v10H1z",
  wifi: "M5 12.55a11 11 0 0114.08 0 M1.42 9a16 16 0 0121.16 0 M8.53 16.11a6 6 0 016.95 0 M12 20h.01",
  sos: "M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z M12 9v4 M12 17h.01",
  check: "M20 6L9 17l-5-5",
  x: "M18 6L6 18 M6 6l12 12",
  danger:
    "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z",
};

// ─── MINI SPARKLINE ───────────────────────────────────────────────────────────
function Sparkline({ data, color = "#22C55E", h = 32 }) {
  const max = Math.max(...data),
    min = Math.min(...data);
  const pts = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * 100;
      const y = h - ((v - min) / (max - min || 1)) * (h - 4) - 2;
      return `${x},${y}`;
    })
    .join(" ");
  return (
    <svg
      viewBox={`0 0 100 ${h}`}
      style={{ width: "100%", height: h }}
      preserveAspectRatio="none"
    >
      <polyline
        points={pts}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ─── RING GAUGE ───────────────────────────────────────────────────────────────
function RingGauge({
  value,
  max = 100,
  color = "#22C55E",
  size = 80,
  label,
  sublabel,
}) {
  const r = 28,
    c = 2 * Math.PI * r;
  const pct = value / max,
    dash = pct * c;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 4,
      }}
    >
      <svg width={size} height={size} viewBox="0 0 72 72">
        <circle
          cx="36"
          cy="36"
          r={r}
          fill="none"
          stroke="#ffffff10"
          strokeWidth="6"
        />
        <circle
          cx="36"
          cy="36"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeDasharray={`${dash} ${c}`}
          strokeLinecap="round"
          transform="rotate(-90 36 36)"
          style={{ transition: "stroke-dasharray 1s ease" }}
        />
        <text
          x="36"
          y="40"
          textAnchor="middle"
          fill="white"
          fontSize="13"
          fontWeight="700"
        >
          {value}
        </text>
      </svg>
      {label && (
        <span style={{ fontSize: 10, color: "#9CA3AF", fontWeight: 600 }}>
          {label}
        </span>
      )}
      {sublabel && (
        <span style={{ fontSize: 9, color: "#6B7280" }}>{sublabel}</span>
      )}
    </div>
  );
}

// ─── FAKE MAP ────────────────────────────────────────────────────────────────
function FakeMap({ height = 220 }) {
  return (
    <div
      style={{
        position: "relative",
        height,
        borderRadius: 16,
        overflow: "hidden",
        background: "#0f172a",
      }}
    >
      <svg
        width="100%"
        height="100%"
        style={{ position: "absolute", inset: 0, opacity: 0.3 }}
      >
        {[...Array(12)].map((_, i) => (
          <line
            key={i}
            x1={`${i * 9}%`}
            y1="0"
            x2={`${i * 9}%`}
            y2="100%"
            stroke="#334155"
            strokeWidth="0.5"
          />
        ))}
        {[...Array(8)].map((_, i) => (
          <line
            key={i}
            x1="0"
            y1={`${i * 14}%`}
            x2="100%"
            y2={`${i * 14}%`}
            stroke="#334155"
            strokeWidth="0.5"
          />
        ))}
        <ellipse
          cx="50%"
          cy="50%"
          rx="80"
          ry="40"
          fill="none"
          stroke="#22C55E"
          strokeWidth="1.5"
          opacity="0.4"
          strokeDasharray="4 3"
        />
        <circle cx="50%" cy="50%" r="8" fill="#22C55E" opacity="0.9" />
        <circle cx="50%" cy="50%" r="20" fill="#22C55E" opacity="0.1" />
        <circle cx="50%" cy="50%" r="6" fill="white" opacity="0.9" />
        <text x="52%" y="42%" fill="#22C55E" fontSize="11" fontWeight="600">
          Mirpur 10, Dhaka
        </text>
      </svg>
      <div
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          background: "#0f172a99",
          backdropFilter: "blur(8px)",
          border: "1px solid #ffffff15",
          borderRadius: 8,
          padding: "4px 10px",
          fontSize: 10,
          color: "#22C55E",
          fontWeight: 700,
        }}
      >
        🟢 LIVE
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 10,
          left: 10,
          background: "#0f172a99",
          backdropFilter: "blur(8px)",
          border: "1px solid #ffffff15",
          borderRadius: 8,
          padding: "4px 10px",
          fontSize: 10,
          color: "#94A3B8",
        }}
      >
        23.8103°N · 90.4125°E
      </div>
    </div>
  );
}

// ─── MAIN APP ────────────────────────────────────────────────────────────────
export default function SafetySystem() {
  const [page, setPage] = useState("overview");
  const [sosActive, setSosActive] = useState(false);
  const [bpm, setBpm] = useState(72);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setBpm((prev) =>
        Math.max(60, Math.min(90, prev + (Math.random() > 0.5 ? 1 : -1))),
      );
      setTick((t) => t + 1);
    }, 2000);
    return () => clearInterval(t);
  }, []);

  const nav = [
    { id: "overview", icon: Icons.shield, label: "Overview" },
    { id: "tracking", icon: Icons.map, label: "Tracking" },
    { id: "health", icon: Icons.heart, label: "Health" },
    { id: "alerts", icon: Icons.bell, label: "Alerts" },
    { id: "history", icon: Icons.route, label: "History" },
    { id: "zones", icon: Icons.zone, label: "Zones" },
    { id: "contacts", icon: Icons.contacts, label: "Contacts" },
    { id: "reports", icon: Icons.report, label: "Reports" },
    { id: "settings", icon: Icons.settings, label: "Settings" },
  ];

  const css = {
    app: {
      minHeight: "100vh",
      background: "#030712",
      color: "white",
      fontFamily: "'DM Sans', system-ui, sans-serif",
      display: "flex",
      flexDirection: "column",
    },
    topbar: {
      background: "#0D1117",
      borderBottom: "1px solid #ffffff0f",
      padding: "10px 20px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 12,
    },
    logo: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      fontWeight: 800,
      fontSize: 15,
      letterSpacing: "-0.02em",
    },
    logoIcon: {
      width: 30,
      height: 30,
      borderRadius: 8,
      background: "linear-gradient(135deg,#6D28D9,#2563EB)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 14,
    },
    statusBar: { display: "flex", alignItems: "center", gap: 12 },
    statusChip: (color) => ({
      display: "flex",
      alignItems: "center",
      gap: 5,
      padding: "3px 10px",
      borderRadius: 20,
      background: color + "15",
      border: `1px solid ${color}30`,
      fontSize: 10,
      color,
      fontWeight: 700,
    }),
    navRow: {
      background: "#0D1117",
      borderBottom: "1px solid #ffffff0f",
      padding: "0 16px",
      display: "flex",
      gap: 2,
      overflowX: "auto",
    },
    navBtn: (active) => ({
      display: "flex",
      alignItems: "center",
      gap: 6,
      padding: "10px 14px",
      borderRadius: 0,
      background: "none",
      border: "none",
      borderBottom: active ? "2px solid #6D28D9" : "2px solid transparent",
      color: active ? "#A78BFA" : "#6B7280",
      cursor: "pointer",
      fontSize: 11,
      fontWeight: 600,
      whiteSpace: "nowrap",
      transition: "all 0.2s",
    }),
    content: {
      flex: 1,
      padding: "20px 16px",
      maxWidth: 900,
      margin: "0 auto",
      width: "100%",
    },
    card: {
      background: "#0D1117",
      border: "1px solid #ffffff0a",
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
    },
    cardTitle: {
      fontSize: 11,
      fontWeight: 700,
      color: "#6B7280",
      textTransform: "uppercase",
      letterSpacing: "0.1em",
      marginBottom: 12,
    },
    grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
    grid3: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 },
    statCard: (accent) => ({
      background: "#0D1117",
      border: `1px solid ${accent}20`,
      borderRadius: 14,
      padding: 14,
      borderTop: `2px solid ${accent}`,
    }),
    badge: (color) => ({
      display: "inline-flex",
      alignItems: "center",
      gap: 4,
      padding: "2px 8px",
      borderRadius: 20,
      background: color + "15",
      border: `1px solid ${color}30`,
      fontSize: 9,
      color,
      fontWeight: 700,
    }),
    btn: (color = "#6D28D9") => ({
      padding: "8px 18px",
      borderRadius: 10,
      background: color,
      border: "none",
      color: "white",
      fontWeight: 700,
      fontSize: 12,
      cursor: "pointer",
    }),
    sosBtn: {
      width: 80,
      height: 80,
      borderRadius: "50%",
      background: sosActive ? "#EF444430" : "#EF4444",
      border: `3px solid ${sosActive ? "#EF4444" : "#EF444460"}`,
      color: "white",
      fontSize: 10,
      fontWeight: 800,
      cursor: "pointer",
      letterSpacing: "0.1em",
      boxShadow: sosActive ? "0 0 30px #EF444460" : "none",
      transition: "all 0.3s",
    },
    input: {
      width: "100%",
      background: "#ffffff08",
      border: "1px solid #ffffff15",
      borderRadius: 10,
      padding: "8px 12px",
      color: "white",
      fontSize: 12,
      outline: "none",
      boxSizing: "border-box",
    },
    listItem: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "10px 0",
      borderBottom: "1px solid #ffffff08",
    },
  };

  return (
    <div style={css.app}>
      {/* TOP BAR */}
      <div style={css.topbar}>
        <div style={css.logo}>
          <div style={css.logoIcon}>🛡️</div>
          <span
            style={{
              background: "linear-gradient(90deg,#A78BFA,#60A5FA)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            SafeGuard
          </span>
        </div>
        <div style={css.statusBar}>
          <div style={css.statusChip("#22C55E")}>
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#22C55E",
              }}
            />
            SAFE
          </div>
          <div style={css.statusChip("#60A5FA")}>🔋 {MOCK.device.battery}%</div>
          <div style={css.statusChip("#A78BFA")}>📡 Strong</div>
          <div style={{ fontSize: 10, color: "#4B5563" }}>{MOCK.user.name}</div>
        </div>
      </div>

      {/* NAV */}
      <div style={css.navRow}>
        {nav.map((n) => (
          <button
            key={n.id}
            style={css.navBtn(page === n.id)}
            onClick={() => setPage(n.id)}
          >
            <Icon
              d={n.icon}
              size={13}
              color={page === n.id ? "#A78BFA" : "#6B7280"}
            />
            {n.label}
          </button>
        ))}
      </div>

      {/* CONTENT */}
      <div style={css.content}>
        {/* ── OVERVIEW ── */}
        {page === "overview" && (
          <div>
            <div style={{ marginBottom: 16 }}>
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 800,
                  letterSpacing: "-0.03em",
                }}
              >
                Child Safety & Anti-Kidnapping System
              </div>
              <div style={{ fontSize: 12, color: "#6B7280", marginTop: 4 }}>
                একটি IoT ভিত্তিক সুরক্ষা সিস্টেম — Real-time Tracking, Smart
                Alerts
              </div>
            </div>

            {/* Status Cards */}
            <div style={css.grid3}>
              {[
                {
                  label: "Device Status",
                  value: "SAFE",
                  sub: "All systems normal",
                  color: "#22C55E",
                  icon: "🟢",
                },
                {
                  label: "Battery",
                  value: `${MOCK.device.battery}%`,
                  sub: "Est. 18h remaining",
                  color: "#60A5FA",
                  icon: "🔋",
                },
                {
                  label: "Signal",
                  value: "Strong",
                  sub: "4/4 bars",
                  color: "#A78BFA",
                  icon: "📡",
                },
              ].map((s) => (
                <div key={s.label} style={css.statCard(s.color)}>
                  <div style={{ fontSize: 18, marginBottom: 4 }}>{s.icon}</div>
                  <div
                    style={{ fontSize: 18, fontWeight: 800, color: s.color }}
                  >
                    {s.value}
                  </div>
                  <div style={{ fontSize: 10, color: "#6B7280", marginTop: 2 }}>
                    {s.label}
                  </div>
                  <div style={{ fontSize: 9, color: "#4B5563", marginTop: 1 }}>
                    {s.sub}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ ...css.grid2, marginTop: 12 }}>
              {/* Live Location Preview */}
              <div style={css.card}>
                <div style={css.cardTitle}>📍 Live Location</div>
                <FakeMap height={160} />
                <div style={{ marginTop: 8, fontSize: 11, color: "#9CA3AF" }}>
                  📌 {MOCK.location.address}
                </div>
              </div>

              {/* Heart Rate */}
              <div style={css.card}>
                <div style={css.cardTitle}>💓 Heart Rate</div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    marginBottom: 8,
                  }}
                >
                  <div
                    style={{ fontSize: 36, fontWeight: 800, color: "#EF4444" }}
                  >
                    {bpm}
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: "#6B7280" }}>BPM</div>
                    <div style={css.badge("#22C55E")}>● Normal</div>
                  </div>
                </div>
                <Sparkline
                  data={[...MOCK.heartRate.trend.slice(-6), bpm]}
                  color="#EF4444"
                />
                <div style={{ marginTop: 8, fontSize: 10, color: "#6B7280" }}>
                  Stress Level:{" "}
                  <span style={{ color: "#22C55E", fontWeight: 700 }}>Low</span>
                </div>
              </div>
            </div>

            {/* SOS + Quick Stats */}
            <div style={css.card}>
              <div style={css.cardTitle}>⚡ Quick Actions</div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-around",
                  flexWrap: "wrap",
                  gap: 16,
                }}
              >
                <div style={{ textAlign: "center" }}>
                  <button
                    style={css.sosBtn}
                    onClick={() => setSosActive((s) => !s)}
                  >
                    {sosActive ? "ACTIVE" : "SOS"}
                  </button>
                  <div style={{ fontSize: 9, color: "#6B7280", marginTop: 6 }}>
                    Emergency Alert
                  </div>
                </div>
                {[
                  { label: "Total Alerts", value: "3", color: "#EF4444" },
                  { label: "Safe Zones", value: "2", color: "#22C55E" },
                  { label: "Contacts", value: "4", color: "#60A5FA" },
                  { label: "Uptime", value: "99%", color: "#A78BFA" },
                ].map((s) => (
                  <div key={s.label} style={{ textAlign: "center" }}>
                    <div
                      style={{ fontSize: 24, fontWeight: 800, color: s.color }}
                    >
                      {s.value}
                    </div>
                    <div style={{ fontSize: 9, color: "#6B7280" }}>
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tech Stack */}
            <div style={css.card}>
              <div style={css.cardTitle}>🛠️ Technology Stack</div>
              <div style={css.grid2}>
                {[
                  { cat: "Frontend", val: "Next.js 14 + Tailwind CSS" },
                  { cat: "Backend", val: "Django REST Framework + PostgreSQL" },
                  { cat: "Hardware", val: "ESP32 + NEO-6M GPS + SIM800L GSM" },
                  {
                    cat: "Algorithm",
                    val: "Haversine Formula + Motion Anomaly Detection",
                  },
                  { cat: "AI/ML", val: "TensorFlow.js — Danger Prediction" },
                  {
                    cat: "Hosting",
                    val: "Vercel (Frontend) + Railway (Backend)",
                  },
                ].map((t) => (
                  <div
                    key={t.cat}
                    style={{
                      padding: "8px 0",
                      borderBottom: "1px solid #ffffff08",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 9,
                        color: "#6B7280",
                        fontWeight: 700,
                        textTransform: "uppercase",
                      }}
                    >
                      {t.cat}
                    </div>
                    <div
                      style={{ fontSize: 11, color: "#E5E7EB", marginTop: 2 }}
                    >
                      {t.val}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── TRACKING ── */}
        {page === "tracking" && (
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>
              🗺️ Live GPS Tracking
            </div>
            <div style={css.card}>
              <FakeMap height={280} />
            </div>
            <div style={css.grid3}>
              {[
                { label: "Latitude", value: "23.8103°N", color: "#60A5FA" },
                { label: "Longitude", value: "90.4125°E", color: "#60A5FA" },
                { label: "Speed", value: "0 km/h", color: "#22C55E" },
              ].map((s) => (
                <div key={s.label} style={css.statCard(s.color)}>
                  <div
                    style={{ fontSize: 14, fontWeight: 800, color: s.color }}
                  >
                    {s.value}
                  </div>
                  <div style={{ fontSize: 10, color: "#6B7280" }}>
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
            <div style={css.card}>
              <div style={css.cardTitle}>📍 Location Details</div>
              <div style={css.listItem}>
                <span style={{ fontSize: 11, color: "#9CA3AF" }}>Address</span>
                <span style={{ fontSize: 11, fontWeight: 600 }}>
                  Mirpur 10, Dhaka
                </span>
              </div>
              <div style={css.listItem}>
                <span style={{ fontSize: 11, color: "#9CA3AF" }}>
                  Last Updated
                </span>
                <span style={{ fontSize: 11, fontWeight: 600 }}>
                  2 minutes ago
                </span>
              </div>
              <div style={css.listItem}>
                <span style={{ fontSize: 11, color: "#9CA3AF" }}>
                  Safe Zone
                </span>
                <span style={{ ...css.badge("#22C55E"), fontSize: 10 }}>
                  ✓ Inside Home Zone
                </span>
              </div>
              <div style={{ ...css.listItem, borderBottom: "none" }}>
                <span style={{ fontSize: 11, color: "#9CA3AF" }}>
                  Update Rate
                </span>
                <span style={{ fontSize: 11, fontWeight: 600 }}>
                  Every 30 seconds
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ── HEALTH ── */}
        {page === "health" && (
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>
              💓 Health Monitor
            </div>
            <div style={css.grid3}>
              <RingGauge
                value={bpm}
                max={120}
                color="#EF4444"
                label="BPM"
                sublabel="Heart Rate"
              />
              <RingGauge
                value={30}
                max={100}
                color="#22C55E"
                label="Low"
                sublabel="Stress Level"
              />
              <RingGauge
                value={MOCK.device.battery}
                color="#60A5FA"
                label={`${MOCK.device.battery}%`}
                sublabel="Battery"
              />
            </div>
            <div style={{ ...css.card, marginTop: 12 }}>
              <div style={css.cardTitle}>❤️ Heart Rate — Live Graph</div>
              <Sparkline
                data={[...MOCK.heartRate.trend.slice(-10), bpm]}
                color="#EF4444"
                h={60}
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: 6,
                }}
              >
                <span style={{ fontSize: 9, color: "#6B7280" }}>
                  Min: 68 BPM
                </span>
                <span style={{ fontSize: 9, color: "#6B7280" }}>
                  Current: {bpm} BPM
                </span>
                <span style={{ fontSize: 9, color: "#6B7280" }}>
                  Max: 82 BPM
                </span>
              </div>
            </div>
            <div style={css.card}>
              <div style={css.cardTitle}>📊 Health Summary</div>
              {[
                {
                  label: "Resting Heart Rate",
                  value: "70 BPM",
                  status: "Normal",
                  color: "#22C55E",
                },
                {
                  label: "Stress Level",
                  value: "Low",
                  status: "Good",
                  color: "#22C55E",
                },
                {
                  label: "Activity Level",
                  value: "Moderate",
                  status: "Active",
                  color: "#60A5FA",
                },
                {
                  label: "Anomaly Count (Today)",
                  value: "0",
                  status: "Clear",
                  color: "#22C55E",
                },
              ].map((h) => (
                <div key={h.label} style={css.listItem}>
                  <span style={{ fontSize: 11, color: "#9CA3AF" }}>
                    {h.label}
                  </span>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <span style={{ fontSize: 11, fontWeight: 600 }}>
                      {h.value}
                    </span>
                    <span style={css.badge(h.color)}>{h.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── ALERTS ── */}
        {page === "alerts" && (
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 12,
              }}
            >
              <div style={{ fontSize: 16, fontWeight: 700 }}>
                🚨 Alerts & Incidents
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                {["All", "SOS", "Geofence", "Anomaly"].map((f) => (
                  <button
                    key={f}
                    style={{
                      ...css.btn("#ffffff10"),
                      fontSize: 9,
                      padding: "4px 10px",
                      border: "1px solid #ffffff15",
                    }}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
            {MOCK.alerts.map((a) => (
              <div
                key={a.id}
                style={{
                  ...css.card,
                  borderLeft: `3px solid ${a.color}`,
                  marginBottom: 8,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        marginBottom: 4,
                      }}
                    >
                      <span style={css.badge(a.color)}>{a.type}</span>
                      <span style={{ fontSize: 9, color: "#6B7280" }}>
                        {a.time}
                      </span>
                    </div>
                    <div style={{ fontSize: 11, color: "#E5E7EB" }}>
                      📍 {a.location}
                    </div>
                  </div>
                  <span
                    style={css.badge(
                      a.status === "Resolved" ? "#22C55E" : "#F59E0B",
                    )}
                  >
                    {a.status === "Resolved" ? "✓" : "●"} {a.status}
                  </span>
                </div>
              </div>
            ))}
            <div style={css.card}>
              <div style={css.cardTitle}>⚡ Send Test Alert</div>
              <div style={{ display: "flex", gap: 8 }}>
                <button style={css.btn("#EF4444")}>🆘 Test SOS</button>
                <button style={css.btn("#F59E0B")}>📍 Test Geofence</button>
                <button style={css.btn("#8B5CF6")}>⚠️ Test Anomaly</button>
              </div>
            </div>
          </div>
        )}

        {/* ── HISTORY ── */}
        {page === "history" && (
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>
              🛣️ Route History
            </div>
            <div style={css.card}>
              <div style={css.cardTitle}>
                📅 Today — {new Date().toLocaleDateString("en-BD")}
              </div>
              <FakeMap height={180} />
            </div>
            <div style={css.card}>
              <div style={css.cardTitle}>🕐 Timeline</div>
              {MOCK.routes.map((r, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    gap: 12,
                    padding: "8px 0",
                    borderBottom: "1px solid #ffffff08",
                  }}
                >
                  <div
                    style={{
                      fontSize: 10,
                      color: "#6B7280",
                      minWidth: 40,
                      fontFamily: "monospace",
                    }}
                  >
                    {r.time}
                  </div>
                  <div
                    style={{
                      width: 2,
                      background: "#6D28D930",
                      borderRadius: 4,
                    }}
                  />
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 600 }}>{r.loc}</div>
                    <div style={{ fontSize: 9, color: "#6B7280" }}>
                      Distance: {r.dist}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── ZONES ── */}
        {page === "zones" && (
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 12,
              }}
            >
              <div style={{ fontSize: 16, fontWeight: 700 }}>
                📍 Safe Zone Management
              </div>
              <button style={css.btn()}>+ Add Zone</button>
            </div>
            {MOCK.safeZones.map((z, i) => (
              <div
                key={i}
                style={{
                  ...css.card,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>{z.name}</div>
                  <div style={{ fontSize: 10, color: "#6B7280", marginTop: 2 }}>
                    Radius: {z.radius}
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span
                    style={css.badge(
                      z.status === "Active" ? "#22C55E" : "#6B7280",
                    )}
                  >
                    {z.status}
                  </span>
                  <button
                    style={{
                      ...css.btn("#ffffff10"),
                      fontSize: 9,
                      padding: "4px 8px",
                      border: "1px solid #ffffff15",
                    }}
                  >
                    Edit
                  </button>
                </div>
              </div>
            ))}
            <div style={css.card}>
              <div style={css.cardTitle}>🗺️ Zone Preview</div>
              <FakeMap height={160} />
            </div>
          </div>
        )}

        {/* ── CONTACTS ── */}
        {page === "contacts" && (
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 12,
              }}
            >
              <div style={{ fontSize: 16, fontWeight: 700 }}>
                📞 Emergency Contacts
              </div>
              <button style={css.btn()}>+ Add Contact</button>
            </div>
            {MOCK.contacts.map((c, i) => (
              <div
                key={i}
                style={{
                  ...css.card,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      background: "#6D28D920",
                      border: "1px solid #6D28D940",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 14,
                    }}
                  >
                    {i === 3 ? "🚨" : "👤"}
                  </div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700 }}>
                      {c.name}
                    </div>
                    <div style={{ fontSize: 10, color: "#6B7280" }}>
                      {c.phone}
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ ...css.badge("#A78BFA"), fontSize: 9 }}>
                    #{c.priority}
                  </span>
                  <button
                    style={{
                      ...css.btn("#22C55E20"),
                      fontSize: 9,
                      padding: "4px 8px",
                      border: "1px solid #22C55E30",
                      color: "#22C55E",
                    }}
                  >
                    Test
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── REPORTS ── */}
        {page === "reports" && (
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 12,
              }}
            >
              <div style={{ fontSize: 16, fontWeight: 700 }}>
                📄 Evidence & Reports
              </div>
              <button style={css.btn()}>⬇ Export PDF</button>
            </div>
            {[
              {
                title: "Incident Report — Alert #001",
                date: "Today 11:42 AM",
                type: "SOS",
                size: "124 KB",
                color: "#EF4444",
              },
              {
                title: "Geofence Breach Report",
                date: "Today 09:15 AM",
                type: "Geofence",
                size: "89 KB",
                color: "#F59E0B",
              },
              {
                title: "Monthly Summary — May 2025",
                date: "01 May 2025",
                type: "Summary",
                size: "342 KB",
                color: "#60A5FA",
              },
            ].map((r, i) => (
              <div
                key={i}
                style={{ ...css.card, borderLeft: `3px solid ${r.color}` }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700 }}>
                      {r.title}
                    </div>
                    <div
                      style={{ fontSize: 9, color: "#6B7280", marginTop: 3 }}
                    >
                      {r.date} · {r.size}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    <span style={css.badge(r.color)}>{r.type}</span>
                    <button
                      style={{
                        ...css.btn("#ffffff10"),
                        fontSize: 9,
                        padding: "4px 8px",
                        border: "1px solid #ffffff15",
                      }}
                    >
                      View
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── SETTINGS ── */}
        {page === "settings" && (
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>
              ⚙️ Settings
            </div>
            {[
              {
                section: "Device Configuration",
                fields: [
                  { label: "Device ID", value: MOCK.user.id, type: "text" },
                  {
                    label: "Hardware API URL",
                    value: "http://192.168.1.100/data",
                    type: "text",
                  },
                  { label: "Update Interval", value: "30", type: "number" },
                ],
              },
              {
                section: "Alert Settings",
                fields: [
                  {
                    label: "Motion Sensitivity",
                    value: "Medium",
                    type: "select",
                  },
                  {
                    label: "Geofence Radius (m)",
                    value: "200",
                    type: "number",
                  },
                  {
                    label: "Notification Mode",
                    value: "SMS + App",
                    type: "select",
                  },
                ],
              },
              {
                section: "Profile",
                fields: [
                  { label: "Full Name", value: MOCK.user.name, type: "text" },
                  { label: "Email", value: "rahim@example.com", type: "email" },
                ],
              },
            ].map((sec) => (
              <div key={sec.section} style={css.card}>
                <div style={css.cardTitle}>{sec.section}</div>
                {sec.fields.map((f) => (
                  <div key={f.label} style={{ marginBottom: 10 }}>
                    <div
                      style={{
                        fontSize: 10,
                        color: "#6B7280",
                        marginBottom: 4,
                      }}
                    >
                      {f.label}
                    </div>
                    <input
                      style={css.input}
                      defaultValue={f.value}
                      type={f.type}
                    />
                  </div>
                ))}
                <button style={{ ...css.btn(), marginTop: 4, fontSize: 11 }}>
                  Save Changes
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* BOTTOM BAR */}
      <div
        style={{
          background: "#0D1117",
          borderTop: "1px solid #ffffff0a",
          padding: "6px 16px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span
          style={{ fontSize: 9, color: "#374151", fontFamily: "monospace" }}
        >
          SafeGuard v2.1 · BPI Final Year Project
        </span>
        <span
          style={{ fontSize: 9, color: "#374151", fontFamily: "monospace" }}
        >
          ESP32 · NEO-6M · SIM800L
        </span>
      </div>
    </div>
  );
}
