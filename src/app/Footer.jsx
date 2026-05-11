"use client";

// ─── ICONS (inline SVG) ───────────────────────────────────────────────────────
const Icon = ({ d, size = 14, color = "currentColor", className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d={d} />
  </svg>
);

const Icons = {
  shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  overview: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10",
  map: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z M12 7a3 3 0 100 6 3 3 0 000-6z",
  heart:
    "M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z",
  bell: "M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 01-3.46 0",
  route: "M3 3h5l2 9 2.5-6h5",
  zone: "M12 2L2 7l10 5 10-5-10-5z M2 17l10 5 10-5 M2 12l10 5 10-5",
  contacts:
    "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M9 11a4 4 0 100-8 4 4 0 000 8z M23 21v-2a4 4 0 00-3-3.87 M16 3.13a4 4 0 010 7.75",
  report:
    "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8",
  settings:
    "M12 15a3 3 0 100-6 3 3 0 000 6z M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z",
  device:
    "M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18",
  api: "M8 9l3 3-3 3 M13 15h3",
  cpu: "M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18",
  satellite: "M12 2L2 7l10 5 10-5-10-5z",
  antenna:
    "M2 12h4 M18 12h4 M12 2v4 M12 18v4 M4.93 4.93l2.83 2.83 M16.24 16.24l2.83 2.83 M4.93 19.07l2.83-2.83 M16.24 7.76l2.83-2.83",
  firmware:
    "M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12",
  github:
    "M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22",
  book: "M4 19.5A2.5 2.5 0 016.5 17H20 M4 19.5A2.5 2.5 0 016.5 22H20V2H6.5A2.5 2.5 0 004 4.5v15z",
  headset:
    "M3 18v-6a9 9 0 0118 0v6 M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3zM3 19a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3z",
  bug: "M8 6h8 M18.09 10a10.66 10.66 0 01.91 4c0 4-3.13 7-7 7s-7-3-7-7c0-1.4.36-2.72 1-3.87 M2 10h4 M18 10h4 M12 2a4 4 0 014 4v2H8V6a4 4 0 014-4z",
  battery: "M23 7h-2a2 2 0 00-2 2v6a2 2 0 002 2h2V7z M1 7h16v10H1z",
  wifi: "M5 12.55a11 11 0 0114.08 0 M1.42 9a16 16 0 0121.16 0 M8.53 16.11a6 6 0 016.95 0 M12 20h.01",
  tag: "M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z M7 7h.01",
  code: "M16 18l6-6-6-6 M8 6l-6 6 6 6",
  diag: "M22 12h-4l-3 9L9 3l-3 9H2",
};

// ─── NAV LINKS DATA ───────────────────────────────────────────────────────────
const NAV_LINKS = [
  {
    title: "Navigation",
    links: [
      { label: "Overview", icon: Icons.overview, href: "/" },
      { label: "Live Tracking", icon: Icons.map, href: "/tracking" },
      { label: "Health", icon: Icons.heart, href: "/health" },
      { label: "Alerts", icon: Icons.bell, href: "/alerts" },
      { label: "History", icon: Icons.route, href: "/history" },
      { label: "Zones", icon: Icons.zone, href: "/zones" },
    ],
  },
  {
    title: "System",
    links: [
      { label: "Contacts", icon: Icons.contacts, href: "/contacts" },
      { label: "Reports", icon: Icons.report, href: "/reports" },
      { label: "Settings", icon: Icons.settings, href: "/settings" },
      { label: "Device Config", icon: Icons.device, href: "/settings#device" },
      { label: "API Docs", icon: Icons.api, href: "/docs" },
    ],
  },
  {
    title: "Hardware",
    links: [
      { label: "ESP32 Module", icon: Icons.cpu, href: "/hardware/esp32" },
      { label: "NEO-6M GPS", icon: Icons.satellite, href: "/hardware/gps" },
      { label: "SIM800L GSM", icon: Icons.antenna, href: "/hardware/gsm" },
      { label: "Diagnostics", icon: Icons.diag, href: "/hardware/diagnostics" },
      {
        label: "Firmware Update",
        icon: Icons.firmware,
        href: "/hardware/firmware",
      },
    ],
  },
];

const SOCIAL_LINKS = [
  { label: "GitHub", icon: Icons.github, href: "https://github.com" },
  { label: "Docs", icon: Icons.book, href: "/docs" },
  { label: "Support", icon: Icons.headset, href: "/support" },
  { label: "Report issue", icon: Icons.bug, href: "/issues" },
];

// ─── STATUS CHIP ──────────────────────────────────────────────────────────────
function StatusChip({ children, colorClass, dotColorClass }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border whitespace-nowrap ${colorClass}`}
    >
      {children}
    </span>
  );
}

// ─── NAV COLUMN ──────────────────────────────────────────────────────────────
function NavColumn({ col }) {
  return (
    <div>
      <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-4">
        {col.title}
      </p>
      <ul className="flex flex-col gap-2.5">
        {col.links.map((link) => (
          <li key={link.label}>
            <a
              href={link.href}
              className="inline-flex items-center gap-2 text-[13px] text-gray-500 hover:text-slate-200 transition-colors duration-150"
            >
              <Icon d={link.icon} size={13} />
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─── FOOTER COMPONENT ─────────────────────────────────────────────────────────
export default function Footer() {
  return (
    <footer className="bg-[#080E18] border-t border-white/[0.05] font-sans text-white">
      <div className="max-w-[1200px] mx-auto px-6 sm:px-8 pt-12 pb-8">
        {/* ── MAIN GRID ── */}
        {/*
          Mobile:   1 col (brand full-width, then nav cols stacked)
          Tablet:   2 cols (brand + one nav group per row)
          Desktop:  4 cols (brand takes 2fr, each nav col 1fr)
        */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr] gap-8 lg:gap-10 mb-10">
          {/* Brand Column — always full-width on mobile */}
          <div className="col-span-2 sm:col-span-2 lg:col-span-1">
            {/* Logo */}
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-9 h-9 rounded-[10px] bg-gradient-to-br from-violet-700 to-blue-600 flex items-center justify-center shrink-0">
                <Icon d={Icons.shield} size={17} color="white" />
              </div>
              <span className="font-black text-[18px] tracking-tight bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
                SafeGuard
              </span>
            </div>

            {/* Description */}
            <p className="text-[13px] text-gray-500 leading-relaxed mb-5 max-w-[300px] lg:max-w-[280px]">
              IoT-based child safety &amp; anti-kidnapping system. Real-time GPS
              tracking, smart alerts, and health monitoring — powered by ESP32
              &amp; AI.
            </p>

            {/* Status chips */}
            <div className="flex flex-wrap gap-2">
              <StatusChip colorClass="bg-green-500/10 border-green-500/20 text-green-400">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
                System online
              </StatusChip>
              <StatusChip colorClass="bg-blue-400/10 border-blue-400/20 text-blue-400">
                <Icon d={Icons.wifi} size={11} color="currentColor" />
                Strong signal
              </StatusChip>
              <StatusChip colorClass="bg-violet-400/10 border-violet-400/20 text-violet-400">
                <Icon d={Icons.battery} size={11} color="currentColor" />
                78%
              </StatusChip>
            </div>
          </div>

          {/* Nav Columns — 2-up on mobile/tablet, 3-up on desktop */}
          {NAV_LINKS.map((col) => (
            <NavColumn key={col.title} col={col} />
          ))}
        </div>

        {/* ── BOTTOM BAR ── */}
        <div className="border-t border-white/[0.05] pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          {/* Left — copyright + badges */}
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-[12px] text-gray-700">
              &copy; {new Date().getFullYear()} SafeGuard &mdash; BPI Final Year
              Project
            </span>
            {[
              { icon: Icons.tag, text: "v2.1.0" },
              { icon: Icons.code, text: "Next.js · Django · ESP32" },
            ].map((b) => (
              <span
                key={b.text}
                className="inline-flex items-center gap-1.5 text-[11px] text-gray-700 font-mono"
              >
                <Icon d={b.icon} size={11} color="currentColor" />
                {b.text}
              </span>
            ))}
          </div>

          {/* Right — social icon buttons */}
          <div className="flex gap-2 shrink-0">
            {SOCIAL_LINKS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                aria-label={s.label}
                className="w-[34px] h-[34px] rounded-[9px] bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-gray-500 hover:bg-white/[0.08] hover:text-slate-200 transition-all duration-150"
              >
                <Icon d={s.icon} size={15} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
