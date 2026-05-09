"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// ─── INLINE SVG ICONS ────────────────────────────────────────────────────────
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
  map: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z M12 7a3 3 0 100 6 3 3 0 000-6z",
  heart:
    "M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z",
  bell: "M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 01-3.46 0",
  user: "M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2 M12 11a4 4 0 100-8 4 4 0 000 8z",
  menu: "M3 12h18 M3 6h18 M3 18h18",
  close: "M18 6L6 18 M6 6l12 12",
  home: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10",
  layout: "M3 3h18v18H3z M3 9h18 M9 21V9",
  wifi: "M5 12.55a11 11 0 0114.08 0 M1.42 9a16 16 0 0121.16 0 M8.53 16.11a6 6 0 016.95 0 M12 20h.01",
  battery: "M23 7h-2a2 2 0 00-2 2v6a2 2 0 002 2h2V7z M1 7h16v10H1z",
  logout: "M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4 M16 17l5-5-5-5 M21 12H9",
  chevron: "M6 9l6 6 6-6",
  star: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  info: "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z M12 8h.01 M12 12v4",
  mail: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6",
};

const ALL_NAV_LINKS = [
  { label: "Home", href: "/", icon: Icons.home },
  { label: "Features", href: "./Features", icon: Icons.star },
  { label: "About", href: "./AboutPage", icon: Icons.info },
  { label: "Contact", href: "./ContactPage", icon: Icons.mail },
  { label: "Dashboard", href: "/dashboard", icon: Icons.layout },
];

const AUTH_NAV_LINKS = [
  { label: "Home", href: "/", icon: Icons.home },
  { label: "Features", href: "./Features", icon: Icons.star },
  { label: "About", href: "./AboutPage", icon: Icons.info },
  { label: "Contact", href: "./ContactPage", icon: Icons.mail },
];

function PulseDot({ color = "#22C55E" }) {
  return (
    <span
      style={{
        position: "relative",
        display: "inline-flex",
        width: 8,
        height: 8,
      }}
    >
      <span
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          background: color,
          opacity: 0.5,
          animation: "sg-ping 1.4s cubic-bezier(0,0,0.2,1) infinite",
        }}
      />
      <span
        style={{
          position: "relative",
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: color,
          display: "inline-block",
        }}
      />
    </span>
  );
}

export default function Navbar() {
  // ✅ ALL hooks declared first — never after a conditional return
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setUserMenuOpen(false);
  }, [pathname]);

  // ✅ Derived values AFTER all hooks
  const isAuthPage = pathname?.startsWith("/auth");
  const displayLinks = isAuthPage ? AUTH_NAV_LINKS : ALL_NAV_LINKS;
  const isActive = (href) =>
    href === "/" ? pathname === "/" : pathname?.startsWith(href);

  return (
    <>
      <style>{`
        @keyframes sg-ping {
          75%, 100% { transform: scale(2); opacity: 0; }
        }
        @keyframes sg-slide-down {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .sg-nav-link:hover .sg-nav-label { color: #E2E8F0 !important; }
        .sg-nav-link:hover .sg-nav-icon  { color: #A78BFA !important; }
        .sg-mobile-link:hover { background: #ffffff08 !important; color: #E2E8F0 !important; }
        .sg-user-item:hover   { background: #ffffff08 !important; color: #E2E8F0 !important; }
        .sg-icon-btn:hover    { background: #ffffff10 !important; color: #E2E8F0 !important; }
        @media (max-width: 768px) {
          .sg-desktop-nav  { display: none !important; }
          .sg-status-chips { display: none !important; }
          .sg-divider      { display: none !important; }
          .sg-username     { display: none !important; }
          .sg-hamburger    { display: flex !important; }
          .sg-auth-cta     { display: none !important; }
        }
        @media (min-width: 769px) {
          .sg-mobile-menu  { display: none !important; }
        }
      `}</style>

      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          background: scrolled ? "rgba(8,14,24,0.97)" : "rgba(8,14,24,0.80)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: scrolled
            ? "1px solid rgba(255,255,255,0.12)"
            : "1px solid rgba(255,255,255,0.06)",
          transition: "all 0.3s ease",
          boxShadow: scrolled ? "0 8px 32px rgba(0,0,0,0.5)" : "none",
          fontFamily: "'DM Sans', system-ui, sans-serif",
        }}
      >
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            padding: "0 24px",
            height: 62,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
          }}
        >
          {/* ── LOGO ── */}
          <Link
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              textDecoration: "none",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 10,
                background: "linear-gradient(135deg,#6D28D9,#2563EB)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 0 16px rgba(109,40,217,0.4)",
                flexShrink: 0,
              }}
            >
              <Icon d={Icons.shield} size={17} color="white" />
            </div>
            <span
              style={{
                fontWeight: 900,
                fontSize: 16,
                letterSpacing: "-0.03em",
                background: "linear-gradient(90deg,#A78BFA,#60A5FA)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              SafeGuard
            </span>
          </Link>

          {/* ── DESKTOP NAV LINKS ── */}
          <div
            className="sg-desktop-nav"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              flex: 1,
              justifyContent: "center",
            }}
          >
            {displayLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className="sg-nav-link"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "7px 14px",
                    borderRadius: 10,
                    textDecoration: "none",
                    background: active
                      ? "rgba(109,40,217,0.15)"
                      : "transparent",
                    border: active
                      ? "1px solid rgba(109,40,217,0.35)"
                      : "1px solid transparent",
                    transition: "background 0.15s, border-color 0.15s",
                  }}
                >
                  <span
                    className="sg-nav-icon"
                    style={{
                      color: active ? "#A78BFA" : "#6B7280",
                      transition: "color 0.15s",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Icon d={link.icon} size={14} />
                  </span>
                  <span
                    className="sg-nav-label"
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: active ? "#A78BFA" : "#6B7280",
                      transition: "color 0.15s",
                    }}
                  >
                    {link.label}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* ── RIGHT SIDE ── */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              flexShrink: 0,
            }}
          >
            {/* Status chips — non-auth pages only */}
            {!isAuthPage && (
              <div
                className="sg-status-chips"
                style={{ display: "flex", alignItems: "center", gap: 6 }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "5px 10px",
                    borderRadius: 20,
                    background: "rgba(34,197,94,0.1)",
                    border: "1px solid rgba(34,197,94,0.25)",
                    fontSize: 10,
                    fontWeight: 700,
                    color: "#22C55E",
                  }}
                >
                  <PulseDot color="#22C55E" /> SAFE
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    padding: "5px 10px",
                    borderRadius: 20,
                    background: "rgba(96,165,250,0.08)",
                    border: "1px solid rgba(96,165,250,0.2)",
                    fontSize: 10,
                    fontWeight: 700,
                    color: "#60A5FA",
                  }}
                >
                  <Icon d={Icons.battery} size={11} color="#60A5FA" /> 78%
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    padding: "5px 10px",
                    borderRadius: 20,
                    background: "rgba(167,139,250,0.08)",
                    border: "1px solid rgba(167,139,250,0.2)",
                    fontSize: 10,
                    fontWeight: 700,
                    color: "#A78BFA",
                  }}
                >
                  <Icon d={Icons.wifi} size={11} color="#A78BFA" /> 4/4
                </div>
              </div>
            )}

            {/* Divider */}
            {!isAuthPage && (
              <div
                className="sg-divider"
                style={{
                  width: 1,
                  height: 22,
                  background: "#ffffff10",
                  margin: "0 4px",
                }}
              />
            )}

            {/* Auth pages → Log in / Sign up */}
            {isAuthPage ? (
              <div className="sg-auth-cta" style={{ display: "flex", gap: 8 }}>
                <Link
                  href="/auth/login"
                  style={{
                    padding: "7px 16px",
                    borderRadius: 10,
                    fontSize: 12,
                    fontWeight: 700,
                    color: "#9CA3AF",
                    textDecoration: "none",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  Log in
                </Link>
                <Link
                  href="/auth/register"
                  style={{
                    padding: "7px 16px",
                    borderRadius: 10,
                    fontSize: 12,
                    fontWeight: 700,
                    color: "white",
                    textDecoration: "none",
                    background: "linear-gradient(135deg,#6D28D9,#2563EB)",
                    boxShadow: "0 0 12px rgba(109,40,217,0.3)",
                  }}
                >
                  Sign up
                </Link>
              </div>
            ) : (
              <>
                {/* Notification bell */}
                <button
                  className="sg-icon-btn"
                  aria-label="Notifications"
                  style={{
                    position: "relative",
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    color: "#6B7280",
                    transition: "background 0.15s, color 0.15s",
                  }}
                >
                  <Icon d={Icons.bell} size={15} />
                  <span
                    style={{
                      position: "absolute",
                      top: 6,
                      right: 6,
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      background: "#EF4444",
                      border: "1.5px solid #080E18",
                    }}
                  />
                </button>

                {/* User avatar + dropdown */}
                <div style={{ position: "relative" }}>
                  <button
                    onClick={() => setUserMenuOpen((o) => !o)}
                    aria-label="User menu"
                    aria-expanded={userMenuOpen}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "5px 10px 5px 5px",
                      borderRadius: 10,
                      background: userMenuOpen
                        ? "rgba(109,40,217,0.15)"
                        : "rgba(255,255,255,0.04)",
                      border: userMenuOpen
                        ? "1px solid rgba(109,40,217,0.35)"
                        : "1px solid rgba(255,255,255,0.08)",
                      cursor: "pointer",
                      transition: "background 0.15s, border-color 0.15s",
                    }}
                  >
                    <div
                      style={{
                        width: 26,
                        height: 26,
                        borderRadius: 8,
                        background:
                          "linear-gradient(135deg,#6D28D950,#2563EB50)",
                        border: "1px solid rgba(109,40,217,0.4)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 11,
                        flexShrink: 0,
                      }}
                    >
                      👤
                    </div>
                    <span
                      className="sg-username"
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: "#9CA3AF",
                        maxWidth: 80,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Rahim
                    </span>
                    <Icon d={Icons.chevron} size={12} color="#6B7280" />
                  </button>

                  {userMenuOpen && (
                    <div
                      style={{
                        position: "absolute",
                        top: "calc(100% + 8px)",
                        right: 0,
                        width: 200,
                        background: "#0D1117",
                        border: "1px solid rgba(255,255,255,0.08)",
                        borderRadius: 14,
                        padding: 6,
                        boxShadow: "0 16px 48px rgba(0,0,0,0.5)",
                        animation: "sg-slide-down 0.15s ease",
                        zIndex: 200,
                      }}
                    >
                      <div
                        style={{
                          padding: "10px 12px 8px",
                          borderBottom: "1px solid rgba(255,255,255,0.06)",
                          marginBottom: 4,
                        }}
                      >
                        <div
                          style={{
                            fontSize: 12,
                            fontWeight: 700,
                            color: "#E2E8F0",
                          }}
                        >
                          Rahim Uddin
                        </div>
                        <div
                          style={{
                            fontSize: 10,
                            color: "#4B5563",
                            marginTop: 2,
                          }}
                        >
                          BD-2024-001
                        </div>
                      </div>
                      {[
                        {
                          label: "Dashboard",
                          href: "/dashboard",
                          icon: Icons.layout,
                        },
                        {
                          label: "Profile",
                          href: "/dashboard",
                          icon: Icons.user,
                        },
                      ].map((item) => (
                        <Link
                          key={item.label}
                          href={item.href}
                          className="sg-user-item"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                            padding: "8px 12px",
                            borderRadius: 9,
                            fontSize: 12,
                            fontWeight: 600,
                            color: "#9CA3AF",
                            textDecoration: "none",
                            transition: "background 0.12s, color 0.12s",
                          }}
                        >
                          <Icon d={item.icon} size={13} color="#6B7280" />{" "}
                          {item.label}
                        </Link>
                      ))}
                      <div
                        style={{
                          height: 1,
                          background: "rgba(255,255,255,0.05)",
                          margin: "4px 0",
                        }}
                      />
                      <Link
                        href="/auth/login"
                        className="sg-user-item"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          padding: "8px 12px",
                          borderRadius: 9,
                          fontSize: 12,
                          fontWeight: 600,
                          color: "#EF4444",
                          textDecoration: "none",
                          transition: "background 0.12s",
                        }}
                      >
                        <Icon d={Icons.logout} size={13} color="#EF4444" /> Log
                        out
                      </Link>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen((o) => !o)}
              className="sg-icon-btn sg-hamburger"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                display: "none",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "#6B7280",
                transition: "background 0.15s, color 0.15s",
              }}
            >
              <Icon d={mobileOpen ? Icons.close : Icons.menu} size={16} />
            </button>
          </div>
        </div>

        {/* ── MOBILE MENU ── */}
        {mobileOpen && (
          <div
            className="sg-mobile-menu"
            style={{
              borderTop: "1px solid rgba(255,255,255,0.06)",
              padding: "12px 16px 20px",
              background: "rgba(8,14,24,0.98)",
              animation: "sg-slide-down 0.2s ease",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                marginBottom: 12,
              }}
            >
              {displayLinks.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="sg-mobile-link"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "10px 14px",
                      borderRadius: 10,
                      fontSize: 13,
                      fontWeight: 600,
                      color: active ? "#A78BFA" : "#6B7280",
                      textDecoration: "none",
                      background: active
                        ? "rgba(109,40,217,0.12)"
                        : "transparent",
                      border: active
                        ? "1px solid rgba(109,40,217,0.25)"
                        : "1px solid transparent",
                      transition: "background 0.15s, color 0.15s",
                    }}
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

            {!isAuthPage && (
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  flexWrap: "wrap",
                  paddingTop: 12,
                  borderTop: "1px solid rgba(255,255,255,0.05)",
                }}
              >
                {[
                  { label: "SAFE", color: "#22C55E", dot: true },
                  { label: "🔋 78%", color: "#60A5FA" },
                  { label: "📡 4/4", color: "#A78BFA" },
                ].map((s) => (
                  <div
                    key={s.label}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                      padding: "4px 10px",
                      borderRadius: 20,
                      background: s.color + "12",
                      border: `1px solid ${s.color}28`,
                      fontSize: 10,
                      fontWeight: 700,
                      color: s.color,
                    }}
                  >
                    {s.dot && <PulseDot color={s.color} />}
                    {s.label}
                  </div>
                ))}
              </div>
            )}

            <div
              style={{
                display: "flex",
                gap: 10,
                marginTop: 16,
                paddingTop: 12,
                borderTop: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              <Link
                href="/auth/login"
                style={{
                  flex: 1,
                  padding: "9px 0",
                  borderRadius: 10,
                  textAlign: "center",
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#9CA3AF",
                  textDecoration: "none",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                Log in
              </Link>
              <Link
                href="/auth/register"
                style={{
                  flex: 1,
                  padding: "9px 0",
                  borderRadius: 10,
                  textAlign: "center",
                  fontSize: 12,
                  fontWeight: 700,
                  color: "white",
                  textDecoration: "none",
                  background: "linear-gradient(135deg,#6D28D9,#2563EB)",
                }}
              >
                Sign up
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Spacer — pushes page content below the fixed navbar */}
      <div style={{ height: 62 }} />
    </>
  );
}
