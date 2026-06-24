"use client";
// app/dashboard/layout.jsx
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  isLoggedIn,
  getMe,
  getDevices,
  getAlerts,
  getLatestLocation,
} from "@/lib/api"; // এক্সিস্টিং সেন্ট্রাল এপিআই লেয়ার
import { Icon, Icons } from "./shared"; // গ্লোবাল শেয়ার্ড আইকনসেট
import { DashboardContext } from "./dashboard-context"; // শেয়ার্ড ইউজার স্টেট কনটেক্সট

const NAV = [
  {
    id: "overview",
    href: "/dashboard",
    emoji: "🛡️",
    label: "Overview",
    icon: Icons.shield,
  },
  {
    id: "tracking",
    href: "/dashboard/tracking",
    emoji: "🗺️",
    label: "Tracking",
    icon: Icons.map,
  },
  {
    id: "alerts",
    href: "/dashboard/alerts",
    emoji: "🚨",
    label: "Alerts",
    icon: Icons.bell,
  },
  {
    id: "history",
    href: "/dashboard/history",
    emoji: "🛣️",
    label: "History",
    icon: Icons.route,
  },
  {
    id: "zones",
    href: "/dashboard/zones",
    emoji: "📍",
    label: "Zones",
    icon: Icons.zone,
  },
  {
    id: "contacts",
    href: "/dashboard/contacts",
    emoji: "📞",
    label: "Contacts",
    icon: Icons.contacts,
  },
  {
    id: "reports",
    href: "/dashboard/reports",
    emoji: "📄",
    label: "Reports",
    icon: Icons.report,
  },
  {
    id: "settings",
    href: "/dashboard/settings",
    emoji: "⚙️",
    label: "Settings",
    icon: Icons.settings,
  },
]; // নেভিগেশন ম্যাট্রিক্স এরে

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [headerData, setHeaderData] = useState({
    user: null,
    device: null,
    latestLoc: null,
    unresolvedAlerts: 0,
  });

  // Auth guard
  useEffect(() => {
    if (!isLoggedIn()) router.push("/auth/login");
  }, []);

  // Fetch lightweight header data
  useEffect(() => {
    async function load() {
      const [userR, devsR, alertsR] = await Promise.allSettled([
        getMe(),
        getDevices(),
        getAlerts(),
      ]);
      const user = userR.status === "fulfilled" ? userR.value : null;
      const devices =
        devsR.status === "fulfilled"
          ? Array.isArray(devsR.value)
            ? devsR.value
            : devsR.value?.results || []
          : [];
      const alerts =
        alertsR.status === "fulfilled"
          ? alertsR.value?.results || alertsR.value || []
          : [];
      let latestLoc = null;
      if (devices[0]) {
        try {
          latestLoc = await getLatestLocation(devices[0].id);
        } catch {}
      }
      setHeaderData({
        user,
        device: devices[0] || null,
        latestLoc,
        unresolvedAlerts: alerts.filter((a) => !a.resolved).length,
      });
    }
    if (isLoggedIn()) load();
  }, []);

  // Sidebar responsive check
  useEffect(() => {
    if (window.innerWidth >= 768) setSidebarOpen(true);
    const onResize = () => setSidebarOpen(window.innerWidth >= 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const handleNavClick = () => {
    if (window.innerWidth < 768) setSidebarOpen(false);
  };

  // Child pages (Settings) push profile updates here so the sidebar reflects them instantly
  const setUser = (u) =>
    setHeaderData((p) => ({
      ...p,
      user: typeof u === "function" ? u(p.user) : u,
    }));

  const { device, latestLoc, unresolvedAlerts, user } = headerData;
  const deviceStatus = device?.is_active ? "SAFE" : "OFFLINE";
  const statusColor = device?.is_active ? "#22C55E" : "#EF4444";
  const batteryPct = device?.battery_pct ?? "—";

  const currentNav = NAV.find((n) =>
    n.href === "/dashboard"
      ? pathname === "/dashboard"
      : pathname.startsWith(n.href),
  ); // একটিভ রাউট ডিটেকশন ট্র্যাকার

  return (
    <DashboardContext.Provider value={{ user, setUser }}>
    <div className="min-h-screen w-full bg-[#030712] text-white font-sans flex relative overflow-x-hidden">
      {/* Mobile Sidebar Back-drop Overlay */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300 ${sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* ── ১. বামপাশের ফিক্সড সাইডবার (Left Fixed Sidebar Engine) ── */}
      <aside
        className={`fixed h-screen top-0 left-0 z-50 bg-[#080E18] border-r border-white/5
          flex flex-col transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] shrink-0
          ${sidebarOpen ? "translate-x-0 w-64" : "-translate-x-full md:translate-x-0 md:w-[72px]"}`}
      >
        {/* লোগো সেকশন */}
        <div className="h-16 border-b border-white/5 flex items-center px-4 gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl shrink-0 bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-lg">
            🛡️
          </div>
          {sidebarOpen && (
            <span className="font-black text-base tracking-tight whitespace-nowrap bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Nirapod
            </span>
          )}
        </div>

        {/* সাইডবার কোলাপ্স টগল বাটন */}
        <button
          onClick={() => setSidebarOpen((o) => !o)}
          className="hidden md:flex absolute top-5 -right-3 w-6 h-6 bg-gray-800 border border-white/10 rounded-full items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 transition-colors z-50 shadow-lg"
        >
          <Icon d={sidebarOpen ? Icons.chevron : Icons.menu} size={11} />
        </button>

        {/* মেনু লিংকসমূহ */}
        <nav className="flex-1 py-4 px-3 overflow-y-auto hide-scrollbar space-y-1">
          {NAV.map((n) => {
            const active =
              n.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(n.href);
            const hasBadge = n.id === "alerts" && unresolvedAlerts > 0;
            return (
              <Link
                key={n.id}
                href={n.href}
                onClick={handleNavClick}
                title={!sidebarOpen ? n.label : undefined}
                className={`w-full flex items-center gap-3 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 relative no-underline
                  ${sidebarOpen ? "px-3 justify-start" : "px-0 justify-center"}
                  ${
                    active
                      ? "bg-purple-600/15 border border-purple-500/30 text-purple-400"
                      : "border border-transparent text-gray-500 hover:bg-white/5 hover:text-gray-300"
                  }`}
              >
                <Icon
                  d={n.icon}
                  size={16}
                  color={active ? "#A78BFA" : "currentColor"}
                />
                {sidebarOpen && (
                  <span className="animate-in fade-in">{n.label}</span>
                )}
                {sidebarOpen && hasBadge && (
                  <span className="ml-auto bg-red-500 text-white rounded-md text-[9px] px-1.5 py-0.5 font-bold">
                    {unresolvedAlerts}
                  </span>
                )}
                {!sidebarOpen && hasBadge && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-[#080E18]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* নিচের ইউজার প্রোফাইল কম্পোনেন্ট */}
        {sidebarOpen && user && (
          <div className="p-3 border-t border-white/5">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-purple-600/20 border border-purple-600/30 flex items-center justify-center text-xs shrink-0">
                👤
              </div>
              <div className="min-w-0">
                <div className="text-[10px] font-bold text-slate-300 truncate">
                  {user.name || user.email}
                </div>
                <div className="text-[9px] text-gray-500 truncate">
                  {user.email}
                </div>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* ── ২. ডানপাশের মূল কন্টেন্ট এরিয়া (Right Content Hub) ── */}
      <div
        className={`flex-1 flex flex-col min-w-0 min-h-screen transition-all duration-300 ${sidebarOpen ? "md:pl-64" : "md:pl-[72px]"}`}
      >
        {/* ড্যাশবোর্ড টপ বার হেডার */}
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

          <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pl-4">
            {[
              { label: deviceStatus, color: statusColor, dot: true },
              {
                label: batteryPct !== "—" ? `🔋 ${batteryPct}%` : "🔋 —",
                color: "#60A5FA",
              },
              {
                label: latestLoc ? "📡 GPS Active" : "📡 No GPS",
                color: latestLoc ? "#22C55E" : "#6B7280",
                hideMobile: true,
              },
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

        {/* ── ৩. পেজ চাইল্ড কন্টেন্ট উইন্ডো + নতুন ছোট ফুটার বাইন্ডিং ── */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 w-full flex flex-col justify-between">
          {/* কন্টেন্ট রেন্ডার কন্টেইনার */}
          <div className="w-full max-w-5xl mx-auto min-h-[calc(100vh-170px)]">
            {children}
          </div>

          {/* ⚡ ড্যাশবোর্ডের জন্য নতুন ডেডিকেটেড এক্সক্লুসিভ ছোট স্লিম ফুটার ⚡ */}
          {/* এটি ডানপাশের পুরো উইডথ ফিলাপ করবে এবং সাইডবারকে কখনোই ওভারল্যাপ করবে না */}
          <footer className="w-full mt-12 pt-5 border-t border-white/5 text-gray-500 text-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              &copy; {new Date().getFullYear()}{" "}
              <span className="font-bold text-slate-400">Nirapod</span> &mdash;
              Child Safety Alert System
            </div>
            <div className="flex gap-4 text-gray-600 font-mono text-[11px]">
              <span>Next.js</span> · <span>Django</span> · <span>ESP32</span>
            </div>
          </footer>
        </main>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `,
        }}
      />
    </div>
    </DashboardContext.Provider>
  );
}
