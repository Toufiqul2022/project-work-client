"use client";
// Footer.jsx
import { usePathname } from "next/navigation"; // রাউট ডিটেক্ট করার জন্য নেক্সট রাউটার ইম্পোর্ট

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
  bell: "M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 01-3.46 0",
  route: "M3 3h5l2 9 2.5-6h5",
  zone: "M12 2L2 7l10 5 10-5-10-5z M2 17l10 5 10-5 M2 12l10 5 10-5",
  contacts:
    "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M9 11a4 4 0 100-8 4 4 0 000 8z M23 21v-2a4 4 0 00-3-3.87 M16 3.13a4 4 0 010 7.75",
  report:
    "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8",
  settings:
    "M12 15a3 3 0 100-6 3 3 0 000 6z M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z",
  satellite: "M12 2L2 7l10 5 10-5-10-5z M2 17l10 5 10-5 M2 12l10 5 10-5",
  github:
    "M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22",
  book: "M4 19.5A2.5 2.5 0 016.5 17H20 M4 19.5A2.5 2.5 0 016.5 22H20V2H6.5A2.5 2.5 0 004 4.5v15z",
  headset:
    "M3 18v-6a9 9 0 0118 0v6 M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3zM3 19a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3z",
  bug: "M8 6h8 M18.09 10a10.66 10.66 0 01.91 4c0 4-3.13 7-7 7s-7-3-7-7c0-1.4.36-2.72 1-3.87 M2 10h4 M18 10h4 M12 2a4 4 0 014 4v2H8V6a4 4 0 014-4z",
  tag: "M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z M7 7h.01",
  code: "M16 18l6-6-6-6 M8 6l-6 6 6 6",
  pin: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z M12 7a3 3 0 100 6 3 3 0 000-6z",
};

// ─── NAV LINKS DATA ─────────────────────────────────────────
const NAV_LINKS = [
  {
    title: "Navigation",
    links: [
      { label: "Overview", icon: Icons.overview, href: "/dashboard" },
      { label: "Live Tracking", icon: Icons.map, href: "/dashboard/tracking" },
      { label: "Alerts", icon: Icons.bell, href: "/dashboard/alerts" },
      { label: "History", icon: Icons.route, href: "/dashboard/history" },
      { label: "Zones", icon: Icons.zone, href: "/dashboard/zones" },
    ],
  },
  {
    title: "System",
    links: [
      { label: "Contacts", icon: Icons.contacts, href: "/dashboard/contacts" },
      { label: "Reports", icon: Icons.report, href: "/dashboard/reports" },
      { label: "Settings", icon: Icons.settings, href: "/dashboard/settings" },
    ],
  },
];

const SOCIAL_LINKS = [
  { label: "GitHub", icon: Icons.github, href: "https://github.com" },
  { label: "Docs", icon: Icons.book, href: "/docs" },
  { label: "Support", icon: Icons.headset, href: "/support" },
  { label: "Report issue", icon: Icons.bug, href: "/issues" },
];

function StatusChip({ children, colorClass }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border whitespace-nowrap ${colorClass}`}
    >
      {children}
    </span>
  );
}

function NavColumn({ col }) {
  return (
    <div>
      <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-4">
        {col.title}
      </p>
      <ul className="flex flex-col gap-2.5 list-none p-0 m-0">
        {col.links.map((link) => (
          <li key={link.label}>
            <a
              href={link.href}
              className="inline-flex items-center gap-2 text-[13px] text-gray-500 hover:text-slate-200 transition-colors duration-150 no-underline"
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

// ─── MASTER CONTROL FOOTER RENDER ─────────────────────────────────────────────
export default function Footer() {
  const pathname = usePathname();

  // 🎯 ম্যাজিক গার্ড লজিক: ইউজার ড্যাশবোর্ডে প্রবেশ করলেই এই বড় ফুটারটি বন্ধ (Deactivate) হয়ে যাবে।
  // ড্যাশবোর্ড তার নিজস্ব ছোট ফুটারটি তার লেআউট ফাইল থেকে ইন্ডিপেন্ডেন্টলি রেন্ডার করছে।
  if (pathname?.startsWith("/dashboard")) {
    return null;
  }

  // ল্যান্ডিং পেইজগুলোর জন্য আপনার চমৎকার বড় ফুটার
  return (
    <footer className="bg-[#080E18] border-t border-white/[0.05] font-sans text-white w-full relative z-10">
      <div className="max-w-[1200px] mx-auto px-6 sm:px-8 pt-12 pb-8">
        {/* MAIN GRID */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr] gap-8 lg:gap-10 mb-10">
          {/* Brand Box */}
          <div className="col-span-2 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-9 h-9 rounded-[10px] bg-gradient-to-br from-violet-700 to-blue-600 flex items-center justify-center shrink-0">
                <Icon d={Icons.shield} size={17} color="white" />
              </div>
              <span className="font-black text-[18px] tracking-tight bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
                Nirapod
              </span>
            </div>

            <p className="text-[13px] text-gray-500 leading-relaxed mb-5 max-w-md">
              IoT-based child safety &amp; anti-kidnapping system. Real-time GPS
              tracking, geofencing, and smart alerts — powered by ESP32 &amp;
              NEO-6M.
            </p>

            <div className="flex flex-wrap gap-2">
              <StatusChip colorClass="bg-green-500/10 border-green-500/20 text-green-400">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
                System online
              </StatusChip>
              <StatusChip colorClass="bg-blue-400/10 border-blue-400/20 text-blue-400">
                <Icon d={Icons.pin} size={11} color="currentColor" />
                GPS tracking
              </StatusChip>
            </div>
          </div>

          {/* Links Columns */}
          {NAV_LINKS.map((col) => (
            <NavColumn key={col.title} col={col} />
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/[0.05] pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-[12px] text-gray-700">
              &copy; {new Date().getFullYear()} Nirapod &mdash; Child Safety
              Alert System
            </span>
          </div>

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
