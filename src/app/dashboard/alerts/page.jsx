"use client";
// app/dashboard/alerts/page.jsx
import { useState, useEffect, useCallback } from "react";

// ─── API helpers ────────────────────────────────────────────────────────────
const BASE =
  process.env.NEXT_PUBLIC_API_URL || "https://nirapod-backend.onrender.com";

async function apiFetch(path, options = {}) {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `JWT ${token}` } : {}),
      ...options.headers,
    },
  });
  if (!res.ok) {
    let errData;
    try {
      errData = await res.json();
    } catch {
      errData = { detail: `HTTP ${res.status}` };
    }
    throw errData;
  }
  const text = await res.text();
  return text ? JSON.parse(text) : {};
}

function fetchAlerts({ device, resolved, alert_type, page = 1 } = {}) {
  const params = new URLSearchParams();
  if (device) params.set("device", device);
  if (resolved !== undefined && resolved !== "")
    params.set("resolved", resolved);
  if (alert_type) params.set("alert_type", alert_type);
  params.set("page", page);
  return apiFetch(`/api/alerts/?${params.toString()}`);
}

function fetchAlert(id) {
  return apiFetch(`/api/alerts/${id}/`);
}

function resolveAlertApi(id) {
  return apiFetch(`/api/alerts/${id}/resolve/`, { method: "PUT" });
}

// ─── Constants ───────────────────────────────────────────────────────────────
const TYPE_META = {
  PANIC: {
    label: "Panic Button",
    icon: "🆘",
    color: "#EF4444",
    bg: "rgba(239, 68, 68, 0.1)",
    border: "rgba(239, 68, 68, 0.25)",
  },
  GEOFENCE: {
    label: "Geofence Breach",
    icon: "📍",
    color: "#F59E0B",
    bg: "rgba(245, 158, 11, 0.1)",
    border: "rgba(245, 158, 11, 0.25)",
  },
  MOTION: {
    label: "Suspicious Motion",
    icon: "👁️",
    color: "#6366F1",
    bg: "rgba(99, 102, 241, 0.1)",
    border: "rgba(99, 102, 241, 0.25)",
  },
};
const UNKNOWN_META = {
  label: "Alert",
  icon: "⚠️",
  color: "#64748B",
  bg: "rgba(100, 116, 139, 0.1)",
  border: "rgba(100, 116, 139, 0.25)",
};

const getMeta = (type) => TYPE_META[type] || UNKNOWN_META;

function formatDate(ts) {
  if (!ts) return "—";
  const d = new Date(ts);
  return (
    d.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }) +
    " · " +
    d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })
  );
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function Spinner({ size = 20 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className="animate-spin text-purple-500"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="2"
        strokeDasharray="40"
        strokeDashoffset="10"
        strokeLinecap="round"
        opacity="0.25"
      />
      <path
        d="M12 2a10 10 0 0 1 10 10"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function StatCard({ label, value, sub, accent }) {
  return (
    <div
      style={{ borderTop: `3px solid ${accent}` }}
      className="bg-white/[0.02] backdrop-blur-md border border-white/10 rounded-2xl p-5 shadow-xl transition-all"
    >
      <div className="text-3xl font-black text-white font-mono tracking-tight">
        {value}
      </div>
      <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mt-1.5">
        {label}
      </div>
      {sub && (
        <div
          style={{ color: accent }}
          className="text-[10px] uppercase font-black tracking-widest mt-1"
        >
          {sub}
        </div>
      )}
    </div>
  );
}

function AlertDetailModal({ alert, onClose, onResolve, resolving }) {
  const meta = getMeta(alert.alert_type);
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/60 backdrop-blur-xl flex items-center justify-center z-50 p-4 animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ borderLeft: `5px solid ${meta.color}` }}
        className="bg-[#0b0b14] border border-white/10 rounded-[28px] w-full max-w-lg overflow-hidden shadow-2xl p-6 md:p-8 animate-in slide-in-from-bottom-8 duration-300"
      >
        <div className="flex justify-between items-start border-b border-white/5 pb-4">
          <div className="flex gap-4 items-center">
            <span className="text-3xl p-3 bg-white/5 rounded-2xl border border-white/10">
              {meta.icon}
            </span>
            <div>
              <div className="text-xl font-bold text-white">{meta.label}</div>
              <div className="text-xs text-gray-500 mt-0.5">
                {alert.device_name}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-gray-400 hover:text-white flex items-center justify-center text-sm transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="py-6 space-y-4">
          {[
            { label: "Alert ID", value: alert.id },
            { label: "Device ID", value: alert.device },
            {
              label: "Type",
              value: `${alert.alert_type} — ${alert.alert_type_display}`,
            },
            {
              label: "Location",
              value: alert.latitude
                ? `${alert.latitude}°N, ${alert.longitude}°E`
                : "Not recorded",
            },
            { label: "Triggered", value: formatDate(alert.timestamp) },
            {
              label: "SMS Status",
              value: alert.sms_sent
                ? `✓ Sent — ${formatDate(alert.sms_sent_at)}`
                : "No SMS dispatched",
            },
            {
              label: "Status Mode",
              value: alert.resolved ? "🟢 Resolved" : "🔴 Active Emergency",
            },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="grid grid-cols-3 gap-4 py-1 border-b border-white/[0.02]"
            >
              <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest pt-0.5">
                {label}
              </div>
              <div className="col-span-2 text-sm text-gray-300 font-medium break-all">
                {String(value)}
              </div>
            </div>
          ))}
        </div>

        {!alert.resolved && (
          <div className="pt-2">
            <button
              onClick={() => onResolve(alert.id)}
              disabled={resolving === alert.id}
              style={{
                background:
                  resolving === alert.id ? "rgba(16,185,129,0.2)" : "#10B981",
                boxShadow:
                  resolving === alert.id
                    ? "none"
                    : "0 8px 20px -6px rgba(16,185,129,0.4)",
              }}
              className="w-full h-12 rounded-xl text-white font-bold tracking-wider text-xs uppercase disabled:text-emerald-500/50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
              {resolving === alert.id ? (
                <>
                  <Spinner size={16} /> System Resolving…
                </>
              ) : (
                "✓ Mark Alert as Resolved"
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function AlertRow({ alert, onResolve, resolving, onDetail }) {
  const meta = getMeta(alert.alert_type);
  return (
    <div
      onClick={onDetail}
      style={{
        borderLeft: `4px solid ${alert.resolved ? "rgba(255,255,255,0.15)" : meta.color}`,
      }}
      className={`bg-white/[0.02] border border-white/5 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer transition-all duration-300 hover:border-white/20 hover:bg-white/[0.04] ${
        alert.resolved ? "opacity-40" : "opacity-100 shadow-lg shadow-black/20"
      }`}
    >
      <div className="flex items-center gap-5 min-w-0">
        <div
          style={{ background: meta.bg, border: `1px solid ${meta.border}` }}
          className="w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
        >
          {meta.icon}
        </div>

        <div className="min-w-0 space-y-1">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="text-sm font-bold text-white tracking-wide">
              {meta.label}
            </span>
            <span
              style={{
                color: meta.color,
                background: meta.bg,
                borderColor: meta.border,
              }}
              className="text-[9px] font-extrabold px-2 py-0.5 rounded-md border tracking-wider uppercase"
            >
              {alert.alert_type}
            </span>
            {alert.resolved ? (
              <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 uppercase tracking-wider">
                ✓ Resolved
              </span>
            ) : (
              <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-md bg-red-500/10 border border-red-500/20 text-red-400 uppercase tracking-wider animate-pulse">
                ● Active Alert
              </span>
            )}
          </div>
          <div className="text-xs text-gray-400">
            {alert.device_name} &nbsp;·&nbsp;{" "}
            <span className="font-mono">{formatDate(alert.timestamp)}</span>
          </div>
          <div className="text-[11px] text-gray-500 flex items-center gap-3">
            <span>
              📍{" "}
              {alert.latitude
                ? `${alert.latitude}°N, ${alert.longitude}°E`
                : "Location payload missing"}
            </span>
            {alert.sms_sent && (
              <span className="text-emerald-400 bg-emerald-500/5 px-1.5 py-0.5 rounded border border-emerald-500/10 text-[9px] font-bold uppercase tracking-widest flex items-center gap-1">
                ✉ SMS Dispatched
              </span>
            )}
          </div>
        </div>
      </div>

      {!alert.resolved && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onResolve(alert.id);
          }}
          disabled={resolving === alert.id}
          className="sm:self-center h-9 px-4 rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 text-xs font-bold hover:bg-emerald-500 hover:text-white transition-all flex items-center justify-center gap-2 flex-shrink-0 disabled:opacity-50"
        >
          {resolving === alert.id ? <Spinner size={12} /> : "✓"} Resolve
        </button>
      )}
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function AlertsPage() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [resolvedFilter, setResolvedFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  const [resolving, setResolving] = useState(null);
  const [resolveError, setResolveError] = useState(null);

  const [detailAlert, setDetailAlert] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    count: 0,
    next: null,
    previous: null,
  });

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    fetchAlerts({ resolved: resolvedFilter, alert_type: typeFilter, page })
      .then((data) => {
        if (data && Array.isArray(data.results)) {
          setAlerts(data.results);
          setPagination({
            count: data.count,
            next: data.next,
            previous: data.previous,
          });
        } else {
          setAlerts(Array.isArray(data) ? data : []);
          setPagination({ count: 0, next: null, previous: null });
        }
      })
      .catch((e) => {
        const msg = e?.detail || e?.message || JSON.stringify(e);
        setError(msg);
      })
      .finally(() => setLoading(false));
  }, [resolvedFilter, typeFilter, page]);

  useEffect(() => {
    load();
  }, [load]);

  const setResolvedFilterAndReset = (v) => {
    setResolvedFilter(v);
    setPage(1);
  };
  const setTypeFilterAndReset = (v) => {
    setTypeFilter(v);
    setPage(1);
  };

  const handleResolve = async (id) => {
    setResolving(id);
    setResolveError(null);
    try {
      await resolveAlertApi(id);
      setAlerts((prev) =>
        prev.map((a) => (a.id === id ? { ...a, resolved: true } : a)),
      );
      if (detailAlert?.id === id)
        setDetailAlert((d) => ({ ...d, resolved: true }));
    } catch (e) {
      const msg = e?.detail || e?.message || JSON.stringify(e);
      setResolveError(`Failed to resolve: ${msg}`);
    }
    setResolving(null);
  };

  const openDetail = async (id) => {
    setDetailLoading(true);
    const existing = alerts.find((a) => a.id === id);
    if (existing) setDetailAlert(existing);
    try {
      const full = await fetchAlert(id);
      setDetailAlert(full);
    } catch {
      // keep row payload fallback
    }
    setDetailLoading(false);
  };

  const displayTotal = pagination.count || alerts.length;
  const activeCount = alerts.filter((a) => !a.resolved).length;
  const panicCount = alerts.filter((a) => a.alert_type === "PANIC").length;
  const geofenceCount = alerts.filter(
    (a) => a.alert_type === "GEOFENCE",
  ).length;
  const smsCount = alerts.filter((a) => a.sms_sent).length;

  const RESOLVED_FILTERS = [
    { label: "All Alerts", value: "" },
    { label: "Active", value: "false" },
    { label: "Resolved", value: "true" },
  ];
  const TYPE_FILTERS = [
    { label: "All types", value: "" },
    { label: "🆘 Panic", value: "PANIC" },
    { label: "📍 Geofence", value: "GEOFENCE" },
    { label: "👁️ Motion", value: "MOTION" },
  ];

  return (
    <div className="min-h-screen bg-[#030712] p-6 md:p-8 text-slate-100 relative overflow-hidden font-sans">
      {/* Mesh Gradients System matching Core Theme */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-900/10 blur-[130px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-900/10 blur-[130px] rounded-full"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto space-y-8">
        {/* Header Block */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-6">
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight">
              Incidents & Signals
            </h1>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">
              Live System Telemetry &nbsp;·&nbsp; {displayTotal} Logged Events
              {activeCount > 0 && (
                <span className="text-red-400 font-extrabold animate-pulse">
                  {" "}
                  · {activeCount} Breach Active
                </span>
              )}
            </p>
          </div>
          <button
            onClick={load}
            className="self-start sm:self-center h-10 px-5 rounded-xl border border-white/10 bg-white/5 font-bold text-xs uppercase tracking-wider text-gray-300 hover:bg-white/10 hover:text-white transition-all flex items-center gap-2 shadow-lg"
          >
            ↺ Sync Feed
          </button>
        </div>

        {/* Telemetry Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <StatCard
            label="Total incidents"
            value={displayTotal}
            accent="#6366F1"
          />
          <StatCard
            label="Active Alert"
            value={activeCount}
            accent="#EF4444"
            sub={activeCount > 0 ? "ACTION REQUIRED" : "INTEGRITY NOMINAL"}
          />
          <StatCard label="Panic Taps" value={panicCount} accent="#EF4444" />
          <StatCard label="Geofences" value={geofenceCount} accent="#F59E0B" />
          <StatCard label="SMS Relays" value={smsCount} accent="#10B981" />
        </div>

        {/* Error Relays */}
        {resolveError && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold flex justify-between items-center shadow-lg">
            <span className="flex items-center gap-2">⚠️ {resolveError}</span>
            <button
              onClick={() => setResolveError(null)}
              className="text-red-400 hover:text-white text-sm px-2"
            >
              ✕
            </button>
          </div>
        )}

        {/* Filters Panel Container */}
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between bg-white/[0.01] border border-white/5 p-4 rounded-2xl backdrop-blur-md">
          <div className="flex gap-1.5 bg-black/40 p-1 rounded-xl border border-white/5">
            {RESOLVED_FILTERS.map(({ label, value }) => (
              <button
                key={value}
                onClick={() => setResolvedFilterAndReset(value)}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  resolvedFilter === value
                    ? "bg-white/10 text-white shadow-md border border-white/5"
                    : "text-gray-500 hover:text-gray-300"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="flex gap-2 flex-wrap">
            {TYPE_FILTERS.map(({ label, value }) => {
              const meta = value ? getMeta(value) : null;
              const isActive = typeFilter === value;
              return (
                <button
                  key={value}
                  onClick={() => setTypeFilterAndReset(value)}
                  style={{
                    borderColor: isActive
                      ? meta?.color
                      : "rgba(255,255,255,0.08)",
                    background: isActive ? meta?.bg : "rgba(255,255,255,0.02)",
                    color: isActive ? meta?.color : "rgba(156,163,175,1)",
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold border transition-all hover:bg-white/5"
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Feed Output */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Spinner size={32} />
          </div>
        ) : error ? (
          <div className="text-center py-16 bg-white/[0.01] border border-white/5 rounded-3xl backdrop-blur-md">
            <div className="text-4xl">⚠️</div>
            <div className="text-red-400 font-bold text-sm mt-3">
              Telemetry Stream Disrupted
            </div>
            <div className="text-gray-500 text-xs mt-1 font-mono">{error}</div>
            <button
              onClick={load}
              className="mt-6 px-5 py-2.5 rounded-xl border border-white/10 bg-white/5 text-xs font-bold text-gray-300 hover:bg-white/10"
            >
              Re-establish Connection
            </button>
          </div>
        ) : alerts.length === 0 ? (
          <div className="text-center py-20 bg-white/[0.01] border border-white/5 rounded-3xl backdrop-blur-md">
            <div className="text-4xl">🔕</div>
            <div className="text-gray-400 font-bold text-sm mt-3">
              No Alerts Intercepted
            </div>
            <div className="text-gray-600 text-xs mt-1">
              Filters clear. System monitoring background feeds.
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {alerts.map((alert) => (
              <AlertRow
                key={alert.id}
                alert={alert}
                onResolve={handleResolve}
                resolving={resolving}
                onDetail={() => openDetail(alert.id)}
              />
            ))}
          </div>
        )}

        {/* Core Pagination System */}
        {(pagination.next || pagination.previous) && (
          <div className="flex justify-center items-center gap-4 pt-4">
            <button
              disabled={!pagination.previous}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-4 py-2 rounded-xl border border-white/10 bg-white/5 text-xs font-bold text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              ← Previous Segment
            </button>
            <span className="text-xs text-gray-500 font-mono font-bold">
              Index {page}
            </span>
            <button
              disabled={!pagination.next}
              onClick={() => setPage((p) => p + 1)}
              className="px-4 py-2 rounded-xl border border-white/10 bg-white/5 text-xs font-bold text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              Next Segment →
            </button>
          </div>
        )}

        {/* Modal Target System */}
        {detailAlert && !detailLoading && (
          <AlertDetailModal
            alert={detailAlert}
            onClose={() => setDetailAlert(null)}
            onResolve={handleResolve}
            resolving={resolving}
          />
        )}

        {detailLoading && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50">
            <Spinner size={36} />
          </div>
        )}
      </div>
    </div>
  );
}
