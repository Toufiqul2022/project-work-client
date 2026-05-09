"use client";
import { useState, useEffect } from "react";

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

// ─── SVG ICON COMPONENT ───────────────────────────────────────────────────────
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
  chevron: "M9 18l6-6-6-6",
  menu: "M3 12h18 M3 6h18 M3 18h18",
  close: "M18 6L6 18 M6 6l12 12",
};

// ─── SPARKLINE ────────────────────────────────────────────────────────────────
function Sparkline({ data, color = "#22C55E", h = 40 }) {
  const max = Math.max(...data),
    min = Math.min(...data);
  const pts = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * 100;
      const y = h - ((v - min) / (max - min || 1)) * (h - 6) - 3;
      return `${x},${y}`;
    })
    .join(" ");
  return (
    <svg
      viewBox={`0 0 100 ${h}`}
      style={{ width: "100%", height: h }}
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient
          id={`sg-${color.replace("#", "")}`}
          x1="0"
          y1="0"
          x2="0"
          y2="1"
        >
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline
        points={pts}
        fill="none"
        stroke={color}
        strokeWidth="2.5"
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
  size = 90,
  label,
  sublabel,
}) {
  const r = 30,
    c = 2 * Math.PI * r;
  const dash = (value / max) * c;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 6,
      }}
    >
      <svg width={size} height={size} viewBox="0 0 72 72">
        <circle
          cx="36"
          cy="36"
          r={r}
          fill="none"
          stroke="#ffffff08"
          strokeWidth="7"
        />
        <circle
          cx="36"
          cy="36"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="7"
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
        <span style={{ fontSize: 11, color: "#9CA3AF", fontWeight: 600 }}>
          {label}
        </span>
      )}
      {sublabel && (
        <span style={{ fontSize: 10, color: "#6B7280" }}>{sublabel}</span>
      )}
    </div>
  );
}

// ─── FAKE MAP ─────────────────────────────────────────────────────────────────
function FakeMap({ height = 220 }) {
  return (
    <div
      style={{
        position: "relative",
        height,
        borderRadius: 14,
        overflow: "hidden",
        background: "#060D1A",
      }}
    >
      <svg
        width="100%"
        height="100%"
        style={{ position: "absolute", inset: 0 }}
      >
        {[...Array(16)].map((_, i) => (
          <line
            key={`v${i}`}
            x1={`${i * 7}%`}
            y1="0"
            x2={`${i * 7}%`}
            y2="100%"
            stroke="#1E3A5F"
            strokeWidth="0.5"
          />
        ))}
        {[...Array(10)].map((_, i) => (
          <line
            key={`h${i}`}
            x1="0"
            y1={`${i * 11}%`}
            x2="100%"
            y2={`${i * 11}%`}
            stroke="#1E3A5F"
            strokeWidth="0.5"
          />
        ))}
        {/* Roads */}
        <path
          d="M0,55% Q40%,50% 100%,52%"
          stroke="#1E4D8C"
          strokeWidth="3"
          fill="none"
          opacity="0.6"
        />
        <path
          d="M50%,0 Q52%,50% 50%,100%"
          stroke="#1E4D8C"
          strokeWidth="3"
          fill="none"
          opacity="0.6"
        />
        {/* Safe zone ring */}
        <circle
          cx="50%"
          cy="50%"
          r="60"
          fill="none"
          stroke="#22C55E"
          strokeWidth="1.5"
          opacity="0.5"
          strokeDasharray="5 4"
        />
        <circle cx="50%" cy="50%" r="60" fill="#22C55E" opacity="0.04" />
        {/* Pulse */}
        <circle cx="50%" cy="50%" r="18" fill="#22C55E" opacity="0.12" />
        <circle cx="50%" cy="50%" r="9" fill="#22C55E" opacity="0.25" />
        <circle cx="50%" cy="50%" r="5" fill="#22C55E" opacity="0.9" />
        <circle cx="50%" cy="50%" r="3" fill="white" opacity="0.95" />
        <text x="54%" y="44%" fill="#22C55E" fontSize="10" fontWeight="600">
          Mirpur 10
        </text>
      </svg>
      <div
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          background: "#00000080",
          backdropFilter: "blur(8px)",
          border: "1px solid #22C55E40",
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
          background: "#00000080",
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

// ─── COMPONENTS ───────────────────────────────────────────────────────────────

function OverviewPage({ bpm, sosActive, setSosActive }) {
  const S = styles;
  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1
          style={{
            fontSize: 22,
            fontWeight: 800,
            letterSpacing: "-0.04em",
            margin: 0,
            color: "#F1F5F9",
          }}
        >
          Child Safety & Anti-Kidnapping System
        </h1>
        <p
          style={{
            fontSize: 12,
            color: "#64748B",
            marginTop: 6,
            margin: "6px 0 0",
          }}
        >
          IoT ভিত্তিক সুরক্ষা সিস্টেম — Real-time Tracking & Smart Alerts
        </p>
      </div>

      {/* Status Row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 12,
          marginBottom: 14,
        }}
      >
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
          <div key={s.label} style={S.statCard(s.color)}>
            <div style={{ fontSize: 20, marginBottom: 6 }}>{s.icon}</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: s.color }}>
              {s.value}
            </div>
            <div style={{ fontSize: 10, color: "#94A3B8", marginTop: 3 }}>
              {s.label}
            </div>
            <div style={{ fontSize: 9, color: "#475569", marginTop: 2 }}>
              {s.sub}
            </div>
          </div>
        ))}
      </div>

      {/* Map + Heart Rate */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 14,
          marginBottom: 14,
        }}
      >
        <div style={S.card}>
          <div style={S.cardTitle}>📍 Live Location</div>
          <FakeMap height={165} />
          <div style={{ marginTop: 8, fontSize: 11, color: "#9CA3AF" }}>
            📌 {MOCK.location.address}
          </div>
        </div>
        <div style={S.card}>
          <div style={S.cardTitle}>💓 Heart Rate</div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              marginBottom: 10,
            }}
          >
            <div
              style={{
                fontSize: 42,
                fontWeight: 900,
                color: "#EF4444",
                lineHeight: 1,
              }}
            >
              {bpm}
            </div>
            <div>
              <div style={{ fontSize: 11, color: "#6B7280" }}>BPM</div>
              <span style={S.badge("#22C55E")}>● Normal</span>
            </div>
          </div>
          <Sparkline
            data={[...MOCK.heartRate.trend.slice(-6), bpm]}
            color="#EF4444"
            h={55}
          />
          <div style={{ marginTop: 8, fontSize: 10, color: "#6B7280" }}>
            Stress Level:{" "}
            <span style={{ color: "#22C55E", fontWeight: 700 }}>Low</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ ...S.card, marginBottom: 14 }}>
        <div style={S.cardTitle}>⚡ Quick Actions</div>
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
              style={S.sosBtn(sosActive)}
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
              <div style={{ fontSize: 26, fontWeight: 900, color: s.color }}>
                {s.value}
              </div>
              <div style={{ fontSize: 9, color: "#6B7280", marginTop: 2 }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tech Stack */}
      <div style={S.card}>
        <div style={S.cardTitle}>🛠️ Technology Stack</div>
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}
        >
          {[
            { cat: "Frontend", val: "Next.js 14 + Tailwind CSS" },
            { cat: "Backend", val: "Django REST Framework + PostgreSQL" },
            { cat: "Hardware", val: "ESP32 + NEO-6M GPS + SIM800L GSM" },
            { cat: "Algorithm", val: "Haversine + Motion Anomaly Detection" },
            { cat: "AI/ML", val: "TensorFlow.js — Danger Prediction" },
            { cat: "Hosting", val: "Vercel (Frontend) + Railway (Backend)" },
          ].map((t) => (
            <div
              key={t.cat}
              style={{ padding: "8px 0", borderBottom: "1px solid #ffffff06" }}
            >
              <div
                style={{
                  fontSize: 9,
                  color: "#6B7280",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                {t.cat}
              </div>
              <div style={{ fontSize: 11, color: "#E2E8F0", marginTop: 2 }}>
                {t.val}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TrackingPage() {
  const S = styles;
  return (
    <div>
      <h2 style={S.pageTitle}>🗺️ Live GPS Tracking</h2>
      <div style={{ ...S.card, marginBottom: 14 }}>
        <FakeMap height={300} />
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 12,
          marginBottom: 14,
        }}
      >
        {[
          { label: "Latitude", value: "23.8103°N", color: "#60A5FA" },
          { label: "Longitude", value: "90.4125°E", color: "#60A5FA" },
          { label: "Speed", value: "0 km/h", color: "#22C55E" },
        ].map((s) => (
          <div key={s.label} style={S.statCard(s.color)}>
            <div style={{ fontSize: 16, fontWeight: 800, color: s.color }}>
              {s.value}
            </div>
            <div style={{ fontSize: 10, color: "#6B7280", marginTop: 3 }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>
      <div style={S.card}>
        <div style={S.cardTitle}>📍 Location Details</div>
        {[
          { label: "Address", value: "Mirpur 10, Dhaka" },
          { label: "Last Updated", value: "2 minutes ago" },
          { label: "Update Rate", value: "Every 30 seconds" },
        ].map((item, i) => (
          <div key={i} style={S.listItem}>
            <span style={{ fontSize: 11, color: "#9CA3AF" }}>{item.label}</span>
            <span style={{ fontSize: 11, fontWeight: 600, color: "#E2E8F0" }}>
              {item.value}
            </span>
          </div>
        ))}
        <div style={{ ...S.listItem, borderBottom: "none" }}>
          <span style={{ fontSize: 11, color: "#9CA3AF" }}>Safe Zone</span>
          <span style={S.badge("#22C55E")}>✓ Inside Home Zone</span>
        </div>
      </div>
    </div>
  );
}

function HealthPage({ bpm }) {
  const S = styles;
  return (
    <div>
      <h2 style={S.pageTitle}>💓 Health Monitor</h2>
      <div style={{ ...S.card, marginBottom: 14 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            padding: "8px 0",
          }}
        >
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
      </div>
      <div style={{ ...S.card, marginBottom: 14 }}>
        <div style={S.cardTitle}>❤️ Heart Rate — Live Graph</div>
        <Sparkline
          data={[...MOCK.heartRate.trend.slice(-10), bpm]}
          color="#EF4444"
          h={70}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 6,
          }}
        >
          <span style={{ fontSize: 9, color: "#6B7280" }}>Min: 68 BPM</span>
          <span style={{ fontSize: 9, color: "#EF4444", fontWeight: 700 }}>
            Current: {bpm} BPM
          </span>
          <span style={{ fontSize: 9, color: "#6B7280" }}>Max: 82 BPM</span>
        </div>
      </div>
      <div style={S.card}>
        <div style={S.cardTitle}>📊 Health Summary</div>
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
        ].map((h, i) => (
          <div key={i} style={S.listItem}>
            <span style={{ fontSize: 11, color: "#9CA3AF" }}>{h.label}</span>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: "#E2E8F0" }}>
                {h.value}
              </span>
              <span style={S.badge(h.color)}>{h.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AlertsPage() {
  const S = styles;
  const [filter, setFilter] = useState("All");
  const filters = ["All", "SOS", "Geofence", "Anomaly"];
  const filtered =
    filter === "All"
      ? MOCK.alerts
      : MOCK.alerts.filter((a) => a.type === filter);
  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <h2 style={{ ...S.pageTitle, margin: 0 }}>🚨 Alerts & Incidents</h2>
        <div style={{ display: "flex", gap: 6 }}>
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: "5px 12px",
                borderRadius: 8,
                fontSize: 10,
                fontWeight: 700,
                cursor: "pointer",
                background: filter === f ? "#6D28D9" : "#ffffff08",
                border:
                  filter === f ? "1px solid #6D28D960" : "1px solid #ffffff10",
                color: filter === f ? "white" : "#6B7280",
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>
      {filtered.map((a) => (
        <div
          key={a.id}
          style={{
            ...S.card,
            borderLeft: `3px solid ${a.color}`,
            marginBottom: 10,
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
                  marginBottom: 5,
                }}
              >
                <span style={S.badge(a.color)}>{a.type}</span>
                <span style={{ fontSize: 9, color: "#6B7280" }}>{a.time}</span>
              </div>
              <div style={{ fontSize: 11, color: "#E2E8F0" }}>
                📍 {a.location}
              </div>
            </div>
            <span
              style={S.badge(a.status === "Resolved" ? "#22C55E" : "#F59E0B")}
            >
              {a.status === "Resolved" ? "✓" : "●"} {a.status}
            </span>
          </div>
        </div>
      ))}
      <div style={S.card}>
        <div style={S.cardTitle}>⚡ Send Test Alert</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button style={S.actionBtn("#EF4444")}>🆘 Test SOS</button>
          <button style={S.actionBtn("#F59E0B")}>📍 Test Geofence</button>
          <button style={S.actionBtn("#8B5CF6")}>⚠️ Test Anomaly</button>
        </div>
      </div>
    </div>
  );
}

function HistoryPage() {
  const S = styles;
  return (
    <div>
      <h2 style={S.pageTitle}>🛣️ Route History</h2>
      <div style={{ ...S.card, marginBottom: 14 }}>
        <div style={S.cardTitle}>
          📅 Today — {new Date().toLocaleDateString("en-BD")}
        </div>
        <FakeMap height={200} />
      </div>
      <div style={S.card}>
        <div style={S.cardTitle}>🕐 Timeline</div>
        {MOCK.routes.map((r, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              gap: 14,
              padding: "10px 0",
              borderBottom:
                i < MOCK.routes.length - 1 ? "1px solid #ffffff06" : "none",
            }}
          >
            <div
              style={{
                fontSize: 10,
                color: "#6B7280",
                minWidth: 44,
                fontFamily: "monospace",
                paddingTop: 2,
              }}
            >
              {r.time}
            </div>
            <div
              style={{
                width: 2,
                background: "linear-gradient(to bottom, #6D28D9, #2563EB)",
                borderRadius: 4,
                flexShrink: 0,
              }}
            />
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#E2E8F0" }}>
                {r.loc}
              </div>
              <div style={{ fontSize: 9, color: "#6B7280", marginTop: 2 }}>
                Distance: {r.dist}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ZonesPage() {
  const S = styles;
  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <h2 style={{ ...S.pageTitle, margin: 0 }}>📍 Safe Zone Management</h2>
        <button style={S.actionBtn("#6D28D9")}>+ Add Zone</button>
      </div>
      {MOCK.safeZones.map((z, i) => (
        <div
          key={i}
          style={{
            ...S.card,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 10,
          }}
        >
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#E2E8F0" }}>
              {z.name}
            </div>
            <div style={{ fontSize: 10, color: "#6B7280", marginTop: 2 }}>
              Radius: {z.radius}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span
              style={S.badge(z.status === "Active" ? "#22C55E" : "#6B7280")}
            >
              {z.status}
            </span>
            <button
              style={{
                padding: "5px 12px",
                borderRadius: 8,
                background: "#ffffff08",
                border: "1px solid #ffffff10",
                color: "#9CA3AF",
                fontSize: 10,
                cursor: "pointer",
              }}
            >
              Edit
            </button>
          </div>
        </div>
      ))}
      <div style={S.card}>
        <div style={S.cardTitle}>🗺️ Zone Preview</div>
        <FakeMap height={180} />
      </div>
    </div>
  );
}

function ContactsPage() {
  const S = styles;
  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <h2 style={{ ...S.pageTitle, margin: 0 }}>📞 Emergency Contacts</h2>
        <button style={S.actionBtn("#6D28D9")}>+ Add Contact</button>
      </div>
      {MOCK.contacts.map((c, i) => (
        <div
          key={i}
          style={{
            ...S.card,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 10,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: "50%",
                background: "#6D28D915",
                border: "1px solid #6D28D930",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 16,
              }}
            >
              {i === 3 ? "🚨" : "👤"}
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#E2E8F0" }}>
                {c.name}
              </div>
              <div style={{ fontSize: 10, color: "#6B7280", marginTop: 2 }}>
                {c.phone}
              </div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={S.badge("#A78BFA")}>#{c.priority}</span>
            <button
              style={{
                padding: "5px 12px",
                borderRadius: 8,
                background: "#22C55E10",
                border: "1px solid #22C55E25",
                color: "#22C55E",
                fontSize: 10,
                cursor: "pointer",
                fontWeight: 700,
              }}
            >
              Test
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function ReportsPage() {
  const S = styles;
  const reports = [
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
      title: "Monthly Summary — May 2026",
      date: "01 May 2026",
      type: "Summary",
      size: "342 KB",
      color: "#60A5FA",
    },
  ];
  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <h2 style={{ ...S.pageTitle, margin: 0 }}>📄 Evidence & Reports</h2>
        <button style={S.actionBtn("#6D28D9")}>⬇ Export PDF</button>
      </div>
      {reports.map((r, i) => (
        <div
          key={i}
          style={{
            ...S.card,
            borderLeft: `3px solid ${r.color}`,
            marginBottom: 10,
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
              <div style={{ fontSize: 12, fontWeight: 700, color: "#E2E8F0" }}>
                {r.title}
              </div>
              <div style={{ fontSize: 9, color: "#6B7280", marginTop: 4 }}>
                {r.date} · {r.size}
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <span style={S.badge(r.color)}>{r.type}</span>
              <button
                style={{
                  padding: "5px 12px",
                  borderRadius: 8,
                  background: "#ffffff08",
                  border: "1px solid #ffffff10",
                  color: "#9CA3AF",
                  fontSize: 10,
                  cursor: "pointer",
                }}
              >
                View
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function SettingsPage() {
  const S = styles;
  const sections = [
    {
      section: "Device Configuration",
      fields: [
        { label: "Device ID", value: MOCK.user.id, type: "text" },
        {
          label: "Hardware API URL",
          value: "http://192.168.1.100/data",
          type: "text",
        },
        { label: "Update Interval (sec)", value: "30", type: "number" },
      ],
    },
    {
      section: "Alert Settings",
      fields: [
        { label: "Motion Sensitivity", value: "Medium", type: "text" },
        { label: "Geofence Radius (m)", value: "200", type: "number" },
        { label: "Notification Mode", value: "SMS + App", type: "text" },
      ],
    },
    {
      section: "Profile",
      fields: [
        { label: "Full Name", value: MOCK.user.name, type: "text" },
        { label: "Email", value: "rahim@example.com", type: "email" },
      ],
    },
  ];
  return (
    <div>
      <h2 style={S.pageTitle}>⚙️ Settings</h2>
      {sections.map((sec) => (
        <div key={sec.section} style={{ ...S.card, marginBottom: 14 }}>
          <div style={S.cardTitle}>{sec.section}</div>
          {sec.fields.map((f) => (
            <div key={f.label} style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 10, color: "#6B7280", marginBottom: 5 }}>
                {f.label}
              </div>
              <input style={S.input} defaultValue={f.value} type={f.type} />
            </div>
          ))}
          <button style={{ ...S.actionBtn("#6D28D9"), marginTop: 4 }}>
            Save Changes
          </button>
        </div>
      ))}
    </div>
  );
}

// ─── SHARED STYLES ────────────────────────────────────────────────────────────
const styles = {
  card: {
    background: "#0D1117",
    border: "1px solid #ffffff08",
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
  },
  cardTitle: {
    fontSize: 10,
    fontWeight: 700,
    color: "#6B7280",
    textTransform: "uppercase",
    letterSpacing: "0.12em",
    marginBottom: 14,
  },
  statCard: (accent) => ({
    background: "#0D1117",
    border: `1px solid ${accent}18`,
    borderRadius: 14,
    padding: 16,
    borderTop: `2px solid ${accent}`,
  }),
  badge: (color) => ({
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
    padding: "3px 9px",
    borderRadius: 20,
    background: color + "15",
    border: `1px solid ${color}30`,
    fontSize: 9,
    color,
    fontWeight: 700,
  }),
  actionBtn: (color) => ({
    padding: "8px 16px",
    borderRadius: 10,
    background: color,
    border: "none",
    color: "white",
    fontWeight: 700,
    fontSize: 11,
    cursor: "pointer",
  }),
  sosBtn: (active) => ({
    width: 84,
    height: 84,
    borderRadius: "50%",
    background: active ? "#EF444420" : "#EF4444",
    border: `3px solid ${active ? "#EF4444" : "#EF444460"}`,
    color: "white",
    fontSize: 11,
    fontWeight: 900,
    cursor: "pointer",
    letterSpacing: "0.1em",
    boxShadow: active ? "0 0 32px #EF444460" : "none",
    transition: "all 0.3s",
  }),
  listItem: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "10px 0",
    borderBottom: "1px solid #ffffff06",
  },
  input: {
    width: "100%",
    background: "#ffffff06",
    border: "1px solid #ffffff12",
    borderRadius: 10,
    padding: "9px 13px",
    color: "white",
    fontSize: 12,
    outline: "none",
    boxSizing: "border-box",
  },
  pageTitle: {
    fontSize: 18,
    fontWeight: 800,
    letterSpacing: "-0.03em",
    color: "#F1F5F9",
    margin: "0 0 18px",
  },
};

// ─── NAV CONFIG ───────────────────────────────────────────────────────────────
const NAV = [
  { id: "overview", icon: Icons.shield, label: "Overview", emoji: "🛡️" },
  { id: "tracking", icon: Icons.map, label: "Tracking", emoji: "🗺️" },
  { id: "health", icon: Icons.heart, label: "Health", emoji: "💓" },
  { id: "alerts", icon: Icons.bell, label: "Alerts", emoji: "🚨", badge: 1 },
  { id: "history", icon: Icons.route, label: "History", emoji: "🛣️" },
  { id: "zones", icon: Icons.zone, label: "Zones", emoji: "📍" },
  { id: "contacts", icon: Icons.contacts, label: "Contacts", emoji: "📞" },
  { id: "reports", icon: Icons.report, label: "Reports", emoji: "📄" },
  { id: "settings", icon: Icons.settings, label: "Settings", emoji: "⚙️" },
];

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function SafetySystem() {
  const [page, setPage] = useState("overview");
  const [sosActive, setSosActive] = useState(false);
  const [bpm, setBpm] = useState(72);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const t = setInterval(() => {
      setBpm((prev) =>
        Math.max(60, Math.min(90, prev + (Math.random() > 0.5 ? 1 : -1))),
      );
    }, 2000);
    return () => clearInterval(t);
  }, []);

  const currentNav = NAV.find((n) => n.id === page);

  const renderPage = () => {
    switch (page) {
      case "overview":
        return (
          <OverviewPage
            bpm={bpm}
            sosActive={sosActive}
            setSosActive={setSosActive}
          />
        );
      case "tracking":
        return <TrackingPage />;
      case "health":
        return <HealthPage bpm={bpm} />;
      case "alerts":
        return <AlertsPage />;
      case "history":
        return <HistoryPage />;
      case "zones":
        return <ZonesPage />;
      case "contacts":
        return <ContactsPage />;
      case "reports":
        return <ReportsPage />;
      case "settings":
        return <SettingsPage />;
      default:
        return null;
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#030712",
        color: "white",
        fontFamily: "'DM Sans', system-ui, sans-serif",
        display: "flex",
      }}
    >
      {/* ── SIDEBAR ── */}
      <div
        style={{
          width: sidebarOpen ? 220 : 64,
          flexShrink: 0,
          background: "#080E18",
          borderRight: "1px solid #ffffff08",
          display: "flex",
          flexDirection: "column",
          transition: "width 0.25s cubic-bezier(0.4,0,0.2,1)",
          overflow: "hidden",
          position: "relative",
          zIndex: 10,
        }}
      >
        {/* Sidebar Header */}
        <div
          style={{
            padding: "18px 14px 14px",
            borderBottom: "1px solid #ffffff08",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 10,
              flexShrink: 0,
              background: "linear-gradient(135deg,#6D28D9,#2563EB)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 16,
            }}
          >
            🛡️
          </div>
          {sidebarOpen && (
            <span
              style={{
                fontWeight: 900,
                fontSize: 15,
                letterSpacing: "-0.03em",
                whiteSpace: "nowrap",
                background: "linear-gradient(90deg,#A78BFA,#60A5FA)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              SafeGuard
            </span>
          )}
        </div>

        {/* Toggle Button */}
        <button
          onClick={() => setSidebarOpen((o) => !o)}
          style={{
            position: "absolute",
            top: 18,
            right: -12,
            width: 24,
            height: 24,
            background: "#1E293B",
            border: "1px solid #ffffff15",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "#6B7280",
          }}
        >
          <Icon d={sidebarOpen ? Icons.close : Icons.chevron} size={11} />
        </button>

        {/* Nav Items */}
        <nav style={{ flex: 1, padding: "10px 8px", overflowY: "auto" }}>
          {NAV.map((n) => {
            const active = page === n.id;
            return (
              <button
                key={n.id}
                onClick={() => setPage(n.id)}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: sidebarOpen ? "9px 12px" : "9px 0",
                  justifyContent: sidebarOpen ? "flex-start" : "center",
                  borderRadius: 10,
                  background: active ? "#6D28D918" : "none",
                  border: active
                    ? "1px solid #6D28D930"
                    : "1px solid transparent",
                  color: active ? "#A78BFA" : "#6B7280",
                  cursor: "pointer",
                  fontSize: 12,
                  fontWeight: 600,
                  marginBottom: 2,
                  whiteSpace: "nowrap",
                  transition: "all 0.15s",
                }}
              >
                <Icon
                  d={n.icon}
                  size={15}
                  color={active ? "#A78BFA" : "#6B7280"}
                />
                {sidebarOpen && <span>{n.label}</span>}
                {sidebarOpen && n.badge && (
                  <span
                    style={{
                      marginLeft: "auto",
                      background: "#EF4444",
                      color: "white",
                      borderRadius: 10,
                      fontSize: 9,
                      padding: "1px 6px",
                      fontWeight: 800,
                    }}
                  >
                    {n.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div style={{ padding: "12px 14px", borderTop: "1px solid #ffffff06" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: "50%",
                background: "linear-gradient(135deg,#6D28D950,#2563EB50)",
                border: "1px solid #6D28D940",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 13,
                flexShrink: 0,
              }}
            >
              👤
            </div>
            {sidebarOpen && (
              <div>
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#E2E8F0",
                    whiteSpace: "nowrap",
                  }}
                >
                  {MOCK.user.name}
                </div>
                <div
                  style={{
                    fontSize: 9,
                    color: "#4B5563",
                    whiteSpace: "nowrap",
                  }}
                >
                  {MOCK.user.id}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── MAIN ── */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
        }}
      >
        {/* Top Bar */}
        <div
          style={{
            background: "#080E18",
            borderBottom: "1px solid #ffffff08",
            padding: "12px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            flexShrink: 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 16 }}>{currentNav?.emoji}</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: "#E2E8F0" }}>
              {currentNav?.label}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {[
              { label: "SAFE", color: "#22C55E", dot: true },
              { label: `🔋 ${MOCK.device.battery}%`, color: "#60A5FA" },
              { label: "📡 Strong", color: "#A78BFA" },
            ].map((c) => (
              <div
                key={c.label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  padding: "4px 10px",
                  borderRadius: 20,
                  background: c.color + "12",
                  border: `1px solid ${c.color}25`,
                  fontSize: 10,
                  color: c.color,
                  fontWeight: 700,
                }}
              >
                {c.dot && (
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: c.color,
                      display: "inline-block",
                    }}
                  />
                )}
                {c.label}
              </div>
            ))}
          </div>
        </div>

        {/* Page Content */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "24px",
            maxWidth: 960,
            width: "100%",
            margin: "0 auto",
            boxSizing: "border-box",
          }}
        >
          {renderPage()}
        </div>

        {/* Footer */}
        <div
          style={{
            background: "#080E18",
            borderTop: "1px solid #ffffff06",
            padding: "6px 24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span
            style={{ fontSize: 9, color: "#1F2937", fontFamily: "monospace" }}
          >
            SafeGuard v2.1 · BPI Final Year Project
          </span>
          <span
            style={{ fontSize: 9, color: "#1F2937", fontFamily: "monospace" }}
          >
            ESP32 · NEO-6M · SIM800L
          </span>
        </div>
      </div>
    </div>
  );
}
