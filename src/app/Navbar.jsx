"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { isLoggedIn, getMe, logout } from "@/lib/api";

// ─── ICONS (Tailwind Optimized) ──────────────────────────────────────────────
const Icon = ({ d, size = 16, color = "currentColor" }) => (
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

const Icons = {
  shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  bell: "M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 01-3.46 0",
  menu: "M3 12h18 M3 6h18 M3 18h18",
  close: "M18 6L6 18 M6 6l12 12",
  home: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10",
  layout: "M3 3h18v18H3z M3 9h18 M9 21V9",
  star: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  info: "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z M12 8h.01 M12 12v4",
  mail: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6",
  logout: "M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4 M16 17l5-5-5-5 M21 12H9",
  chevron: "M6 9l6 6 6-6",
};

const NAV_LINKS = [
  { label: "Home", href: "/", icon: Icons.home },
  { label: "Features", href: "/Features", icon: Icons.star },
  { label: "About", href: "/AboutPage", icon: Icons.info },
  { label: "Contact", href: "/ContactPage", icon: Icons.mail },
  { label: "Dashboard", href: "/dashboard", icon: Icons.layout },
];

const AUTH_NAV_LINKS = NAV_LINKS.filter((l) => l.label !== "Dashboard");

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false); // Hydration fix gate
  const [userInfo, setUserInfo] = useState({
    name: null,
    email: null,
    loading: true,
  });

  // Scroll effect
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileOpen(false);
    setUserMenuOpen(false);
  }, [pathname]);

  // Close dropdown on outside click
  useEffect(() => {
    if (!userMenuOpen) return;
    const handler = (e) => {
      if (!e.target.closest("#sg-user-menu")) setUserMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [userMenuOpen]);

  // Mount setup & fetch user info securely on client side
  useEffect(() => {
    setIsMounted(true);
    if (!isLoggedIn()) {
      setUserInfo({ name: null, email: null, loading: false });
      return;
    }
    getMe()
      .then((u) =>
        setUserInfo({
          name: u?.name || u?.email?.split("@")[0] || null,
          email: u?.email || null,
          loading: false,
        }),
      )
      .catch(() => setUserInfo({ name: null, email: null, loading: false }));
  }, []);

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    setMobileOpen(false);
    router.push("/auth/login");
  };

  // Safe checks using mount state
  const loggedIn = isMounted && isLoggedIn();
  const isAuthPage = pathname?.startsWith("/auth");
  const displayLinks = isAuthPage ? AUTH_NAV_LINKS : NAV_LINKS;
  const isActive = (href) =>
    href === "/" ? pathname === "/" : pathname?.startsWith(href);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-[1000] backdrop-blur-xl transition-all duration-300 font-sans ${
          scrolled
            ? "bg-[#080e18]/97 border-b border-white/12 shadow-2xl shadow-black/50"
            : "bg-[#080e18]/80 border-b border-white/6"
        }`}
      >
        <div className="max-w-7xl mx-auto h-[62px] px-6 flex items-center justify-between gap-4">
          {/* LOGO */}
          <Link
            href="/"
            className="flex items-center gap-2.5 flex-shrink-0 no-underline"
          >
            <div className="w-[34px] h-[34px] rounded-xl bg-gradient-to-br from-purple-700 to-blue-600 flex items-center justify-center shadow-[0_0_16px_rgba(109,40,217,0.4)] flex-shrink-0">
              <Icon d={Icons.shield} size={17} color="white" />
            </div>
            <span className="font-black text-base tracking-tight bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Nirapod
            </span>
          </Link>

          {/* DESKTOP NAV LINKS */}
          <div className="hidden md:flex items-center gap-0.5 flex-1 justify-center">
            {displayLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`group flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl no-underline transition-all duration-150 border ${
                    active
                      ? "bg-purple-600/15 border-purple-600/35"
                      : "bg-transparent border-transparent"
                  }`}
                >
                  <span
                    className={`transition-colors duration-150 flex items-center ${active ? "text-purple-400" : "text-gray-500 group-hover:text-purple-400"}`}
                  >
                    <Icon d={link.icon} size={14} />
                  </span>
                  <span
                    className={`text-xs font-bold transition-colors duration-150 ${active ? "text-purple-400" : "text-gray-500 group-hover:text-gray-300"}`}
                  >
                    {link.label}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* RIGHT SIDE ACTIONS */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Auth Page: Login / Signup CTAs */}
            {isAuthPage && (
              <div className="hidden md:flex items-center gap-2">
                <Link
                  href="/auth/login"
                  className="px-4 py-1.5 rounded-xl text-xs font-bold text-gray-400 bg-white/5 border border-white/8 no-underline hover:bg-white/10 hover:text-gray-200 transition-all"
                >
                  Log in
                </Link>
                <Link
                  href="/auth/register"
                  className="px-4 py-1.5 rounded-xl text-xs font-bold text-white bg-gradient-to-br from-purple-700 to-blue-600 no-underline shadow-[0_0_12px_rgba(109,40,217,0.3)] hover:opacity-90 transition-all"
                >
                  Sign up
                </Link>
              </div>
            )}

            {/* Authenticated State: Bell + User Dropdown */}
            {!isAuthPage && loggedIn && (
              <>
                {/* Notification Bell */}
                <button
                  aria-label="Notifications"
                  className="relative w-9 h-9 rounded-xl bg-white/4 border border-white/8 flex items-center justify-center cursor-pointer text-gray-500 hover:bg-white/10 hover:text-gray-300 transition-all"
                >
                  <Icon d={Icons.bell} size={15} />
                  <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-red-500 border border-[#080e18]" />
                </button>

                {/* User Profile Dropdown Menu */}
                <div id="sg-user-menu" className="relative">
                  <button
                    onClick={() => setUserMenuOpen((o) => !o)}
                    aria-label="User menu"
                    className={`flex items-center gap-2 p-1.5 pr-2.5 rounded-xl border cursor-pointer transition-all ${
                      userMenuOpen
                        ? "bg-purple-600/15 border-purple-600/35"
                        : "bg-white/4 border-white/8"
                    }`}
                  >
                    <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-purple-700/30 to-blue-600/30 border border-purple-600/40 flex items-center justify-center text-[11px] flex-shrink-0">
                      👤
                    </div>
                    <span className="hidden md:inline text-xs font-bold text-gray-400 max-w-[80px] overflow-hidden text-ellipsis whitespace-nowrap">
                      {userInfo.name || "Account"}
                    </span>
                    <Icon d={Icons.chevron} size={12} color="#6B7280" />
                  </button>

                  {/* Dropdown Card */}
                  {userMenuOpen && (
                    <div className="absolute top-[calc(100%+8px)] right-0 w-48 bg-[#0d1117] border border-white/8 rounded-2xl p-1.5 shadow-2xl shadow-black/60 animate-in fade-in slide-in-from-top-2 duration-150 z-[1100]">
                      <div className="px-3 py-2.5 border-b border-white/6 mb-1">
                        <div className="text-xs font-bold text-gray-300">
                          {userInfo.name || "User"}
                        </div>
                        <div className="text-[10px] text-gray-500 mt-0.5 truncate">
                          {userInfo.email || ""}
                        </div>
                      </div>

                      <Link
                        href="/dashboard"
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-gray-400 no-underline hover:bg-white/5 hover:text-gray-300 transition-all"
                      >
                        <Icon d={Icons.layout} size={13} color="#6B7280" />
                        Dashboard
                      </Link>

                      <div className="h-px bg-white/5 my-1" />

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-red-500 bg-transparent border-none cursor-pointer text-left hover:bg-red-500/10 transition-all"
                      >
                        <Icon d={Icons.logout} size={13} color="#EF4444" />
                        Log out
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Mobile Hamburger Trigger */}
            <button
              onClick={() => setMobileOpen((o) => !o)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              className="md:hidden w-9 h-9 rounded-xl bg-white/4 border border-white/8 flex items-center justify-center cursor-pointer text-gray-500 hover:bg-white/10 hover:text-gray-300 transition-all"
            >
              <Icon d={mobileOpen ? Icons.close : Icons.menu} size={16} />
            </button>
          </div>
        </div>

        {/* MOBILE DRAWER MENU */}
        {mobileOpen && (
          <div className="md:hidden border-t border-white/6 p-4 pb-5 bg-[#080e18]/98 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex flex-col gap-0.5">
              {displayLinks.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold no-underline border transition-all ${
                      active
                        ? "bg-purple-600/12 border-purple-600/25 text-purple-400"
                        : "bg-transparent border-transparent text-gray-500 hover:bg-white/5 hover:text-gray-300"
                    }`}
                  >
                    <Icon
                      d={link.icon}
                      size={15}
                      color={active ? "#A78BFA" : "#6B7280"}
                    />
                    {link.label}
                  </Link>
                );
              })}
            </div>

            {/* Mobile Footer CTAs inside drawer */}
            {loggedIn ? (
              <button
                onClick={handleLogout}
                className="mt-3 w-full py-2.5 rounded-xl bg-red-500/8 border border-red-500/20 text-red-500 text-xs font-bold cursor-pointer flex items-center justify-center gap-2 hover:bg-red-500/15 transition-all"
              >
                <Icon d={Icons.logout} size={15} color="#EF4444" /> Log out
              </button>
            ) : (
              <div className="flex gap-2.5 mt-4 pt-3 border-t border-white/5">
                <Link
                  href="/auth/login"
                  className="flex-1 py-2 rounded-xl text-center text-xs font-bold text-gray-400 bg-white/5 border border-white/8 no-underline hover:bg-white/10 transition-all"
                >
                  Log in
                </Link>
                <Link
                  href="/auth/register"
                  className="flex-1 py-2 rounded-xl text-center text-xs font-bold text-white bg-gradient-to-br from-purple-700 to-blue-600 no-underline hover:opacity-90 transition-all"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        )}
      </nav>

      {/* Nav Spacer to prevent layout shifts */}
      <div className="h-[62px]" />
    </>
  );
}
