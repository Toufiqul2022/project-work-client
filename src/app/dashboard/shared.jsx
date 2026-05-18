// dashboard/shared.jsx  — shared UI primitives & LiveMap

// ─── SVG ICON ─────────────────────────────────────────────────────────────────
export const Icon = ({
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

export const Icons = {
  shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  map: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z M12 7a3 3 0 100 6 3 3 0 000-6z",
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
  pin: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z M12 7a3 3 0 100 6 3 3 0 000-6z",
  refresh:
    "M23 4v6h-6 M1 20v-6h6 M3.51 9a9 9 0 0114.85-3.36L23 10 M1 14l4.64 4.36A9 9 0 0020.49 15",
  navigate: "M3 11l19-9-9 19-2-8-8-2z",
  clock:
    "M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-12v4l3 3",
  satellite: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
  battery:
    "M17 7H7C5.895 7 5 7.895 5 9v6c0 1.105.895 2 2 2h10c1.105 0 2-.895 2-2V9c0-1.105-.895-2-2-2zm3 4h1a1 1 0 110 2h-1v-2z M8 10h5v4H8z",
  logout: "M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4 M16 17l5-5-5-5 M21 12H9",
};

// ─── UI PRIMITIVES ─────────────────────────────────────────────────────────────
export const Card = ({ children, className = "", title, style, accent }) => (
  <div
    className={`bg-[#0D1117] border border-white/5 rounded-2xl p-4 md:p-5 mb-4 ${className}`}
    style={{
      ...(accent ? { borderTop: `2px solid ${accent}` } : {}),
      ...style,
    }}
  >
    {title && (
      <div className="text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">
        {title}
      </div>
    )}
    {children}
  </div>
);

export const Badge = ({ children, color }) => (
  <span
    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] md:text-[10px] font-bold border whitespace-nowrap"
    style={{ backgroundColor: `${color}15`, borderColor: `${color}30`, color }}
  >
    {children}
  </span>
);

export const ActionBtn = ({
  children,
  color,
  className = "",
  onClick,
  disabled,
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`px-3 py-2 md:px-4 md:py-2 rounded-xl text-white font-bold text-[10px] md:text-xs transition-all hover:brightness-110 flex-shrink-0 disabled:opacity-40 ${className}`}
    style={{ backgroundColor: color }}
  >
    {children}
  </button>
);

export const ListItem = ({ label, value, badge, border = true }) => (
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

export const Loader = () => (
  <div className="flex items-center justify-center py-10">
    <div className="w-6 h-6 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
  </div>
);

// ─── LIVE MAP ──────────────────────────────────────────────────────────────────
export function LiveMap({
  lat,
  lon,
  className = "h-40 md:h-[220px]",
  accuracy,
  showPulse = true,
}) {
  const displayLat = lat || 23.8103;
  const displayLon = lon || 90.4125;
  const hasData = !!(lat && lon);

  return (
    <div
      className={`relative w-full rounded-xl overflow-hidden bg-[#060D1A] ${className}`}
    >
      <svg
        width="100%"
        height="100%"
        className="absolute inset-0"
        style={{ opacity: 0.6 }}
      >
        <defs>
          <pattern
            id="grid"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="#1E3A5F"
              strokeWidth="0.5"
            />
          </pattern>
          <radialGradient id="glow" cx="50%" cy="50%" r="50%">
            <stop
              offset="0%"
              stopColor={hasData ? "#22C55E" : "#3B82F6"}
              stopOpacity="0.12"
            />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
        <rect width="100%" height="100%" fill="url(#glow)" />
        <path
          d="M0,55% Q40%,50% 100%,52%"
          stroke="#1E4D8C"
          strokeWidth="3"
          fill="none"
          opacity="0.5"
        />
        <path
          d="M50%,0 Q52%,50% 50%,100%"
          stroke="#1E4D8C"
          strokeWidth="3"
          fill="none"
          opacity="0.5"
        />
        <path
          d="M0,30% Q60%,35% 100%,28%"
          stroke="#162B4D"
          strokeWidth="2"
          fill="none"
          opacity="0.4"
        />
        <path
          d="M0,70% Q30%,68% 100%,72%"
          stroke="#162B4D"
          strokeWidth="2"
          fill="none"
          opacity="0.4"
        />
        {accuracy && (
          <circle
            cx="50%"
            cy="50%"
            r={Math.min(70, accuracy * 0.8)}
            fill="#22C55E"
            opacity="0.05"
          />
        )}
        <circle
          cx="50%"
          cy="50%"
          r="65"
          fill="none"
          stroke="#22C55E"
          strokeWidth="1.5"
          opacity="0.4"
          strokeDasharray="6 4"
        />
        {showPulse && hasData && (
          <>
            <circle
              cx="50%"
              cy="50%"
              r="28"
              fill="none"
              stroke="#22C55E"
              strokeWidth="1"
              opacity="0.25"
              className="animate-ping"
              style={{ transformOrigin: "center", animationDuration: "3s" }}
            />
            <circle cx="50%" cy="50%" r="18" fill="#22C55E" opacity="0.08" />
          </>
        )}
        <circle
          cx="50%"
          cy="50%"
          r="9"
          fill={hasData ? "#22C55E" : "#3B82F6"}
          opacity="0.25"
        />
        <circle
          cx="50%"
          cy="50%"
          r="5"
          fill={hasData ? "#22C55E" : "#3B82F6"}
          opacity="0.9"
        />
        <circle cx="50%" cy="50%" r="2.5" fill="white" opacity="0.95" />
      </svg>

      <div
        className={`absolute top-2.5 right-2.5 backdrop-blur-md border rounded-lg px-2.5 py-1 text-[9px] md:text-[10px] font-bold flex items-center gap-1.5 ${hasData ? "bg-black/50 border-green-500/30 text-green-400" : "bg-black/50 border-yellow-500/30 text-yellow-400"}`}
      >
        <span
          className={`w-1.5 h-1.5 rounded-full ${hasData ? "bg-green-400 animate-pulse" : "bg-yellow-400"}`}
        />
        {hasData ? "LIVE" : "WAITING"}
      </div>

      <div className="absolute bottom-2.5 left-2.5 bg-black/60 backdrop-blur-md border border-white/10 rounded-lg px-2.5 py-1 text-[9px] md:text-[10px] font-mono text-slate-400 flex items-center gap-1.5">
        <Icon d={Icons.pin} size={9} color="#22C55E" />
        {displayLat.toString().slice(0, 9)}°N ·{" "}
        {displayLon.toString().slice(0, 9)}°E
      </div>

      {accuracy && (
        <div className="absolute bottom-2.5 right-2.5 bg-black/60 backdrop-blur-md border border-white/10 rounded-lg px-2 py-1 text-[9px] text-slate-500 font-mono">
          ±{accuracy}m
        </div>
      )}
    </div>
  );
}
