"use client";
import React, { useState, useEffect } from "react";

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
    className="shrink-0"
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

// ─── REUSABLE UI COMPONENTS ───────────────────────────────────────────────────

const Card = ({ children, className = "", title }) => (
  <div
    className={`bg-[#0D1117] border border-white/5 rounded-2xl p-4 md:p-5 mb-4 ${className}`}
  >
    {title && (
      <div className="text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">
        {title}
      </div>
    )}
    {children}
  </div>
);

const Badge = ({ children, color }) => (
  <span
    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] md:text-[10px] font-bold border whitespace-nowrap"
    style={{
      backgroundColor: `${color}15`,
      borderColor: `${color}30`,
      color: color,
    }}
  >
    {children}
  </span>
);

const ActionBtn = ({ children, color, className = "", onClick }) => (
  <button
    onClick={onClick}
    className={`px-3 py-2 md:px-4 md:py-2 rounded-xl text-white font-bold text-[10px] md:text-xs transition-colors hover:brightness-110 flex-shrink-0 ${className}`}
    style={{ backgroundColor: color }}
  >
    {children}
  </button>
);

const ListItem = ({ label, value, badge, border = true }) => (
  <div
    className={`flex items-center justify-between py-3 ${border ? "border-b border-white/5" : ""}`}
  >
    <span className="text-[11px] md:text-xs text-gray-400">{label}</span>
    <div className="flex items-center gap-2">
      {value && (
        <span className="text-[11px] md:text-xs font-semibold text-slate-200">
          {value}
        </span>
      )}
      {badge && <Badge color={badge.color}>{badge.label}</Badge>}
    </div>
  </div>
);

// ─── DATA VISUALIZATIONS ──────────────────────────────────────────────────────

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
      className="w-full"
      style={{ height: h }}
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
    <div className="flex flex-col items-center gap-1.5 p-2">
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
          className="transition-all duration-1000 ease-out"
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
        <span className="text-[11px] text-gray-400 font-semibold">{label}</span>
      )}
      {sublabel && (
        <span className="text-[10px] text-gray-500 text-center">
          {sublabel}
        </span>
      )}
    </div>
  );
}

function FakeMap({ className = "h-40 md:h-[220px]" }) {
  return (
    <div
      className={`relative w-full rounded-xl overflow-hidden bg-[#060D1A] ${className}`}
    >
      <svg width="100%" height="100%" className="absolute inset-0">
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
      <div className="absolute top-2 right-2 md:top-3 md:right-3 bg-black/50 backdrop-blur-md border border-green-500/30 rounded-lg px-2.5 py-1 text-[9px] md:text-[10px] text-green-500 font-bold">
        🟢 LIVE
      </div>
      <div className="absolute bottom-2 left-2 md:bottom-3 md:left-3 bg-black/50 backdrop-blur-md border border-white/10 rounded-lg px-2.5 py-1 text-[9px] md:text-[10px] text-slate-400">
        23.8103°N · 90.4125°E
      </div>
    </div>
  );
}

// ─── PAGES ────────────────────────────────────────────────────────────────────

function OverviewPage({ bpm, sosActive, setSosActive }) {
  return (
    <div className="animate-in fade-in duration-300">
      <div className="mb-6 md:mb-8">
        <h1 className="text-xl md:text-2xl font-extrabold tracking-tight text-slate-100 m-0">
          Child Safety & Anti-Kidnapping System
        </h1>
        <p className="text-xs md:text-sm text-slate-500 mt-2">
          IoT ভিত্তিক সুরক্ষা সিস্টেম — Real-time Tracking & Smart Alerts
        </p>
      </div>

      {/* Status Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mb-4">
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
          <div
            key={s.label}
            className="bg-[#0D1117] rounded-2xl p-4 md:p-5 border-t-2"
            style={{
              borderColor: s.color,
              borderLeftColor: `${s.color}18`,
              borderRightColor: `${s.color}18`,
              borderBottomColor: `${s.color}18`,
              borderWidth: "2px 1px 1px 1px",
            }}
          >
            <div className="text-lg md:text-xl mb-1.5">{s.icon}</div>
            <div
              className="text-lg md:text-xl font-extrabold"
              style={{ color: s.color }}
            >
              {s.value}
            </div>
            <div className="text-[10px] md:text-xs text-slate-400 mt-1">
              {s.label}
            </div>
            <div className="text-[9px] md:text-[10px] text-slate-500 mt-0.5">
              {s.sub}
            </div>
          </div>
        ))}
      </div>

      {/* Map + Heart Rate */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <Card title="📍 Live Location">
          <FakeMap className="h-40 md:h-[165px]" />
          <div className="mt-2 text-[11px] text-gray-400">
            📌 {MOCK.location.address}
          </div>
        </Card>

        <Card title="💓 Heart Rate">
          <div className="flex items-center gap-4 mb-3 md:mb-4">
            <div className="text-4xl md:text-5xl font-black text-red-500 leading-none">
              {bpm}
            </div>
            <div>
              <div className="text-[10px] md:text-[11px] text-gray-500 mb-1">
                BPM
              </div>
              <Badge color="#22C55E">● Normal</Badge>
            </div>
          </div>
          <Sparkline
            data={[...MOCK.heartRate.trend.slice(-6), bpm]}
            color="#EF4444"
            h={55}
          />
          <div className="mt-2 text-[10px] text-gray-500">
            Stress Level: <span className="text-green-500 font-bold">Low</span>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card title="⚡ Quick Actions">
        <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-6 py-2">
          <div className="w-full sm:w-auto flex flex-col items-center justify-center shrink-0">
            <button
              className={`w-20 h-20 md:w-24 md:h-24 rounded-full font-black text-xs md:text-sm tracking-widest text-white transition-all duration-300 flex items-center justify-center
                ${sosActive ? "bg-red-500/20 border-4 border-red-500 shadow-[0_0_32px_rgba(239,68,68,0.6)]" : "bg-red-500 border-4 border-red-500/60 hover:brightness-110"}
              `}
              onClick={() => setSosActive((s) => !s)}
            >
              {sosActive ? "ACTIVE" : "SOS"}
            </button>
            <div className="text-[9px] md:text-[10px] text-gray-500 mt-2 font-semibold">
              Emergency Alert
            </div>
          </div>

          <div className="flex-1 grid grid-cols-2 lg:grid-cols-4 gap-4 w-full">
            {[
              { label: "Total Alerts", value: "3", color: "text-red-500" },
              { label: "Safe Zones", value: "2", color: "text-green-500" },
              { label: "Contacts", value: "4", color: "text-blue-400" },
              { label: "Uptime", value: "99%", color: "text-purple-400" },
            ].map((s) => (
              <div
                key={s.label}
                className="text-center bg-white/5 rounded-xl p-3 sm:bg-transparent sm:p-0"
              >
                <div className={`text-xl md:text-3xl font-black ${s.color}`}>
                  {s.value}
                </div>
                <div className="text-[9px] md:text-[10px] text-gray-500 mt-1 md:mt-2">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Tech Stack */}
      <Card title="🛠️ Technology Stack">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1">
          {[
            { cat: "Frontend", val: "React + Tailwind CSS" },
            { cat: "Backend", val: "Django REST Framework + PostgreSQL" },
            { cat: "Hardware", val: "ESP32 + NEO-6M GPS + SIM800L GSM" },
            { cat: "Algorithm", val: "Haversine + Motion Anomaly Detection" },
            { cat: "AI/ML", val: "TensorFlow.js — Danger Prediction" },
            { cat: "Hosting", val: "Vercel + Railway" },
          ].map((t) => (
            <div
              key={t.cat}
              className="py-2 border-b border-white/5 last:border-0 sm:last:border-b"
            >
              <div className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">
                {t.cat}
              </div>
              <div className="text-[10px] md:text-[11px] text-slate-300 mt-1">
                {t.val}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function TrackingPage() {
  return (
    <div className="animate-in fade-in duration-300">
      <h2 className="text-lg md:text-xl font-extrabold tracking-tight text-slate-100 mb-4 md:mb-5">
        🗺️ Live GPS Tracking
      </h2>
      <Card>
        <FakeMap className="h-64 md:h-[350px]" />
      </Card>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mb-4">
        {[
          { label: "Latitude", value: "23.8103°N", color: "#60A5FA" },
          { label: "Longitude", value: "90.4125°E", color: "#60A5FA" },
          { label: "Speed", value: "0 km/h", color: "#22C55E" },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-[#0D1117] rounded-xl p-4 border"
            style={{ borderColor: `${s.color}18` }}
          >
            <div
              className="text-base md:text-lg font-extrabold"
              style={{ color: s.color }}
            >
              {s.value}
            </div>
            <div className="text-[10px] md:text-xs text-gray-500 mt-1">
              {s.label}
            </div>
          </div>
        ))}
      </div>
      <Card title="📍 Location Details">
        <ListItem label="Address" value="Mirpur 10, Dhaka" />
        <ListItem label="Last Updated" value="2 minutes ago" />
        <ListItem label="Update Rate" value="Every 30 seconds" />
        <ListItem
          label="Safe Zone"
          badge={{ label: "✓ Inside Home Zone", color: "#22C55E" }}
          border={false}
        />
      </Card>
    </div>
  );
}

function HealthPage({ bpm }) {
  return (
    <div className="animate-in fade-in duration-300">
      <h2 className="text-lg md:text-xl font-extrabold tracking-tight text-slate-100 mb-4 md:mb-5">
        💓 Health Monitor
      </h2>
      <Card>
        <div className="flex flex-wrap justify-around py-2 gap-4">
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
      </Card>
      <Card title="❤️ Heart Rate — Live Graph">
        <Sparkline
          data={[...MOCK.heartRate.trend.slice(-10), bpm]}
          color="#EF4444"
          h={80}
        />
        <div className="flex justify-between items-center mt-3">
          <span className="text-[9px] md:text-[10px] text-gray-500">
            Min: 68 BPM
          </span>
          <span className="text-[9px] md:text-[10px] text-red-500 font-bold bg-red-500/10 px-2 py-1 rounded-md">
            Current: {bpm} BPM
          </span>
          <span className="text-[9px] md:text-[10px] text-gray-500">
            Max: 82 BPM
          </span>
        </div>
      </Card>
      <Card title="📊 Health Summary">
        <ListItem
          label="Resting Heart Rate"
          value="70 BPM"
          badge={{ label: "Normal", color: "#22C55E" }}
        />
        <ListItem
          label="Stress Level"
          value="Low"
          badge={{ label: "Good", color: "#22C55E" }}
        />
        <ListItem
          label="Activity Level"
          value="Moderate"
          badge={{ label: "Active", color: "#60A5FA" }}
        />
        <ListItem
          label="Anomaly Count (Today)"
          value="0"
          badge={{ label: "Clear", color: "#22C55E" }}
          border={false}
        />
      </Card>
    </div>
  );
}

function AlertsPage() {
  const [filter, setFilter] = useState("All");
  const filters = ["All", "SOS", "Geofence", "Anomaly"];
  const filtered =
    filter === "All"
      ? MOCK.alerts
      : MOCK.alerts.filter((a) => a.type === filter);

  return (
    <div className="animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 md:mb-5 gap-3">
        <h2 className="text-lg md:text-xl font-extrabold tracking-tight text-slate-100 m-0">
          🚨 Alerts & Incidents
        </h2>
        <div className="flex overflow-x-auto gap-2 pb-1 sm:pb-0 hide-scrollbar">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold whitespace-nowrap transition-colors border
                ${filter === f ? "bg-purple-700 border-purple-600 text-white" : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {filtered.map((a) => (
        <Card
          key={a.id}
          className="border-l-4"
          style={{ borderLeftColor: a.color }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <Badge color={a.color}>{a.type}</Badge>
                <span className="text-[9px] md:text-[10px] text-gray-500">
                  {a.time}
                </span>
              </div>
              <div className="text-[11px] md:text-xs text-slate-300 font-medium">
                📍 {a.location}
              </div>
            </div>
            <Badge color={a.status === "Resolved" ? "#22C55E" : "#F59E0B"}>
              {a.status === "Resolved" ? "✓" : "●"} {a.status}
            </Badge>
          </div>
        </Card>
      ))}

      <Card title="⚡ Send Test Alert">
        <div className="flex flex-wrap gap-2">
          <ActionBtn color="#EF4444">🆘 Test SOS</ActionBtn>
          <ActionBtn color="#F59E0B">📍 Test Geofence</ActionBtn>
          <ActionBtn color="#8B5CF6">⚠️ Test Anomaly</ActionBtn>
        </div>
      </Card>
    </div>
  );
}

function HistoryPage() {
  return (
    <div className="animate-in fade-in duration-300">
      <h2 className="text-lg md:text-xl font-extrabold tracking-tight text-slate-100 mb-4 md:mb-5">
        🛣️ Route History
      </h2>
      <Card title={`📅 Today — ${new Date().toLocaleDateString("en-BD")}`}>
        <FakeMap className="h-48 md:h-[250px]" />
      </Card>
      <Card title="🕐 Timeline">
        <div className="py-2">
          {MOCK.routes.map((r, i) => (
            <div key={i} className="flex gap-4 relative pb-6 last:pb-0">
              {/* Timeline line connecting items */}
              {i < MOCK.routes.length - 1 && (
                <div className="absolute top-6 left-[30px] bottom-[-6px] w-[2px] bg-gradient-to-b from-purple-600/50 to-blue-600/50 rounded-full" />
              )}
              <div className="text-[10px] text-gray-500 min-w-[44px] font-mono pt-0.5">
                {r.time}
              </div>
              <div className="w-[10px] h-[10px] rounded-full bg-purple-500 shrink-0 mt-1 border-2 border-[#0D1117] z-10" />
              <div className="-mt-1">
                <div className="text-xs md:text-sm font-semibold text-slate-200">
                  {r.loc}
                </div>
                <div className="text-[10px] text-gray-500 mt-1">
                  Distance: {r.dist}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function ZonesPage() {
  return (
    <div className="animate-in fade-in duration-300">
      <div className="flex items-center justify-between mb-4 md:mb-5">
        <h2 className="text-lg md:text-xl font-extrabold tracking-tight text-slate-100 m-0">
          📍 Safe Zone Management
        </h2>
        <ActionBtn color="#6D28D9">+ Add Zone</ActionBtn>
      </div>

      {MOCK.safeZones.map((z, i) => (
        <Card key={i} className="!mb-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-xs md:text-sm font-bold text-slate-200">
                {z.name}
              </div>
              <div className="text-[10px] text-gray-500 mt-1">
                Radius: {z.radius}
              </div>
            </div>
            <div className="flex items-center gap-2 md:gap-3">
              <Badge color={z.status === "Active" ? "#22C55E" : "#6B7280"}>
                {z.status}
              </Badge>
              <button className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-400 text-[10px] hover:bg-white/10 transition-colors">
                Edit
              </button>
            </div>
          </div>
        </Card>
      ))}
      <Card title="🗺️ Zone Preview" className="mt-5">
        <FakeMap className="h-48 md:h-[200px]" />
      </Card>
    </div>
  );
}

function ContactsPage() {
  return (
    <div className="animate-in fade-in duration-300">
      <div className="flex items-center justify-between mb-4 md:mb-5">
        <h2 className="text-lg md:text-xl font-extrabold tracking-tight text-slate-100 m-0">
          📞 Emergency Contacts
        </h2>
        <ActionBtn color="#6D28D9">+ Add Contact</ActionBtn>
      </div>

      {MOCK.contacts.map((c, i) => (
        <Card key={i} className="!mb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-600/10 border border-purple-600/30 flex items-center justify-center text-lg shrink-0">
                {i === 3 ? "🚨" : "👤"}
              </div>
              <div>
                <div className="text-xs md:text-sm font-bold text-slate-200">
                  {c.name}
                </div>
                <div className="text-[10px] md:text-[11px] text-gray-500 mt-0.5">
                  {c.phone}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 pl-13 sm:pl-0">
              <Badge color="#A78BFA">#{c.priority}</Badge>
              <button className="px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/25 text-green-500 text-[10px] font-bold hover:bg-green-500/20 transition-colors">
                Test
              </button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

function ReportsPage() {
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
    <div className="animate-in fade-in duration-300">
      <div className="flex items-center justify-between mb-4 md:mb-5">
        <h2 className="text-lg md:text-xl font-extrabold tracking-tight text-slate-100 m-0">
          📄 Evidence & Reports
        </h2>
        <ActionBtn color="#6D28D9">⬇ Export PDF</ActionBtn>
      </div>

      {reports.map((r, i) => (
        <Card
          key={i}
          className="border-l-4 !mb-3"
          style={{ borderLeftColor: r.color }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="text-xs md:text-sm font-bold text-slate-200">
                {r.title}
              </div>
              <div className="text-[9px] md:text-[10px] text-gray-500 mt-1">
                {r.date} · {r.size}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge color={r.color}>{r.type}</Badge>
              <button className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-400 text-[10px] hover:bg-white/10 transition-colors">
                View
              </button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

function SettingsPage() {
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
    <div className="animate-in fade-in duration-300">
      <h2 className="text-lg md:text-xl font-extrabold tracking-tight text-slate-100 mb-4 md:mb-5">
        ⚙️ Settings
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {sections.map((sec) => (
          <Card
            key={sec.section}
            title={sec.section}
            className="flex flex-col h-full"
          >
            <div className="flex-1">
              {sec.fields.map((f) => (
                <div key={f.label} className="mb-4 last:mb-0">
                  <label className="block text-[10px] text-gray-500 mb-1.5 font-semibold">
                    {f.label}
                  </label>
                  <input
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 md:py-2.5 text-slate-200 text-xs md:text-sm focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-colors"
                    defaultValue={f.value}
                    type={f.type}
                  />
                </div>
              ))}
            </div>
            {sec.section === "Profile" && (
              <div className="mt-5">
                <ActionBtn color="#6D28D9" className="w-full">
                  Save Changes
                </ActionBtn>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}

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
export default function App() {
  const [page, setPage] = useState("overview");
  const [sosActive, setSosActive] = useState(false);
  const [bpm, setBpm] = useState(72);
  const [sidebarOpen, setSidebarOpen] = useState(false); // Mobile defaults to closed

  // Auto-close sidebar on mobile after navigating
  const handleNavClick = (id) => {
    setPage(id);
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  useEffect(() => {
    // Open sidebar by default on desktop
    if (window.innerWidth >= 768) setSidebarOpen(true);

    const handleResize = () => {
      if (window.innerWidth >= 768) setSidebarOpen(true);
      else setSidebarOpen(false);
    };
    window.addEventListener("resize", handleResize);

    const t = setInterval(() => {
      setBpm((prev) =>
        Math.max(60, Math.min(90, prev + (Math.random() > 0.5 ? 1 : -1))),
      );
    }, 2000);

    return () => {
      clearInterval(t);
      window.removeEventListener("resize", handleResize);
    };
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
    <div className="min-h-screen bg-gray-950 text-white font-sans flex overflow-hidden">
      {/* ── MOBILE OVERLAY ── */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300 ${sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* ── SIDEBAR ── */}
      <div
        className={`fixed md:relative top-0 left-0 h-full z-50 bg-[#080E18] border-r border-white/5 flex flex-col transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] shrink-0
          ${sidebarOpen ? "translate-x-0 w-[240px]" : "-translate-x-full md:translate-x-0 md:w-[72px]"}
        `}
      >
        {/* Sidebar Header */}
        <div className="h-16 border-b border-white/5 flex items-center px-4 gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl shrink-0 bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-lg">
            🛡️
          </div>
          {sidebarOpen && (
            <span className="font-black text-base tracking-tight whitespace-nowrap bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent animate-in fade-in">
              SafeGuard
            </span>
          )}
        </div>

        {/* Toggle Button (Desktop only, absolutely positioned outside) */}
        <button
          onClick={() => setSidebarOpen((o) => !o)}
          className="hidden md:flex absolute top-5 -right-3 w-6 h-6 bg-gray-800 border border-white/10 rounded-full items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 transition-colors z-50 shadow-lg"
        >
          <Icon d={sidebarOpen ? Icons.chevron : Icons.menu} size={11} />
        </button>

        {/* Nav Items */}
        <nav className="flex-1 py-4 px-3 overflow-y-auto hide-scrollbar space-y-1">
          {NAV.map((n) => {
            const active = page === n.id;
            return (
              <button
                key={n.id}
                onClick={() => handleNavClick(n.id)}
                title={!sidebarOpen ? n.label : undefined}
                className={`w-full flex items-center gap-3 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200
                  ${sidebarOpen ? "px-3 justify-start" : "px-0 justify-center"}
                  ${active ? "bg-purple-600/15 border border-purple-500/30 text-purple-400" : "border border-transparent text-gray-500 hover:bg-white/5 hover:text-gray-300"}
                `}
              >
                <Icon
                  d={n.icon}
                  size={16}
                  color={active ? "#A78BFA" : "currentColor"}
                />

                {sidebarOpen && (
                  <span className="animate-in fade-in">{n.label}</span>
                )}

                {sidebarOpen && n.badge && (
                  <span className="ml-auto bg-red-500 text-white rounded-md text-[9px] px-1.5 py-0.5 font-bold animate-in fade-in">
                    {n.badge}
                  </span>
                )}
                {!sidebarOpen && n.badge && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-[#080E18]"></span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Bar */}
        <header className="h-16 bg-[#080E18]/80 backdrop-blur-md border-b border-white/5 px-4 md:px-6 flex items-center justify-between shrink-0 sticky top-0 z-20">
          <div className="flex items-center gap-3 md:gap-4">
            <button
              className="md:hidden p-1.5 -ml-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
              onClick={() => setSidebarOpen(true)}
            >
              <Icon d={Icons.menu} size={20} />
            </button>
            <div className="flex items-center gap-2.5">
              <span className="text-lg md:text-xl leading-none">
                {currentNav?.emoji}
              </span>
              <span className="text-sm md:text-base font-bold text-slate-200">
                {currentNav?.label}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar mask-edges pl-4">
            {[
              { label: "SAFE", color: "#22C55E", dot: true, hideMobile: false },
              {
                label: `🔋 ${MOCK.device.battery}%`,
                color: "#60A5FA",
                hideMobile: false,
              },
              { label: "📡 Strong", color: "#A78BFA", hideMobile: true },
            ].map((c) => (
              <div
                key={c.label}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] md:text-[10px] font-bold border whitespace-nowrap shrink-0 ${c.hideMobile ? "hidden sm:flex" : "flex"}`}
                style={{
                  backgroundColor: `${c.color}12`,
                  borderColor: `${c.color}25`,
                  color: c.color,
                }}
              >
                {c.dot && (
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: c.color }}
                  />
                )}
                {c.label}
              </div>
            ))}
          </div>
        </header>

        {/* Scrollable Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-5xl mx-auto w-full">{renderPage()}</div>
        </main>

        {/* Footer */}
        <footer className="bg-[#080E18] border-t border-white/5 py-2 px-4 md:px-6 flex flex-col sm:flex-row justify-between items-center shrink-0 gap-1 sm:gap-0">
          <span className="text-[9px] md:text-[10px] text-gray-600 font-mono tracking-tight">
            SafeGuard v2.1 · BPI Final Year Project
          </span>
          <span className="text-[9px] md:text-[10px] text-gray-600 font-mono tracking-tight">
            ESP32 · NEO-6M · SIM800L
          </span>
        </footer>
      </div>

      {/* Global CSS overrides for hiding scrollbars neatly */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .mask-edges { -webkit-mask-image: linear-gradient(to right, transparent, black 10px, black 90%, transparent); mask-image: linear-gradient(to right, transparent, black 10px, black calc(100% - 10px), transparent); }
      `,
        }}
      />
    </div>
  );
}
