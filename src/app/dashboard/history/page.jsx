"use client";
// app/dashboard/history/page.jsx
import { useState, useEffect, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import {
  getDevices,
  getDeviceLocations,
  getGeofences,
  getAlerts,
} from "@/lib/api";

// ── Haversine & Formatting Helpers ──────────────────────────────────────────
const haversine = (lat1, lon1, lat2, lon2) => {
  const R = 6371000;
  const φ1 = (lat1 * Math.PI) / 180,
    φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(Δφ / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const fmtDist = (m) =>
  m >= 1000 ? `${(m / 1000).toFixed(2)} km` : `${Math.round(m)} m`;
const fmtTime = (ts) =>
  ts
    ? new Date(ts).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    : "—";
const fmtDate = (ts) =>
  ts
    ? new Date(ts).toLocaleDateString("en-BD", {
        weekday: "short",
        day: "numeric",
        month: "short",
      })
    : "—";

// ── Leaflet Dynamic Imports (Anti-SSR Guard) ──────────────────────────────────
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false },
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false },
);
const Polyline = dynamic(
  () => import("react-leaflet").then((mod) => mod.Polyline),
  { ssr: false },
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false },
);
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});

function RouteMap({ locations }) {
  const mapRef = useRef(null);
  const [customIcons, setCustomIcons] = useState(null);

  useEffect(() => {
    import("leaflet").then((L) => {
      setCustomIcons({
        start: new L.Icon({
          iconUrl:
            "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
          iconSize: [20, 32],
          iconAnchor: [10, 32],
        }),
        current: new L.Icon({
          iconUrl:
            "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png",
          iconSize: [22, 35],
          iconAnchor: [11, 35],
        }),
      });
    });
  }, []);

  if (typeof window === "undefined" || !locations?.length || !customIcons) {
    return (
      <div className="h-[240px] bg-white/5 flex items-center justify-center text-xs text-gray-500 font-mono">
        📡 Awaiting System Telemetry Coordinates...
      </div>
    );
  }

  const coords = locations.map((l) => [
    parseFloat(l.latitude),
    parseFloat(l.longitude),
  ]);
  const center = coords[0] || [23.8103, 90.4125];

  return (
    <div className="relative rounded-2xl overflow-hidden h-[240px] border border-white/10 z-10">
      <MapContainer
        center={center}
        zoom={15}
        scrollWheelZoom={false}
        className="w-full h-full"
        whenReady={(mapInstance) => {
          mapRef.current = mapInstance.target;
        }}
      >
        <TileLayer
          attribution="&copy; CARTO"
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        {coords.length > 1 && (
          <Polyline
            positions={coords}
            pathOptions={{ color: "#7C3AED", weight: 3, opacity: 0.8 }}
          />
        )}
        {coords.length > 1 && (
          <Marker position={coords[coords.length - 1]} icon={customIcons.start}>
            <Popup>🏁 Starting Node</Popup>
          </Marker>
        )}
        <Marker position={coords[0]} icon={customIcons.current}>
          <Popup>🛰️ Current Tracker Fix</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}

// ── Generic List Item & Metric Components ─────────────────────────────────────
function StatCard({ label, value, color }) {
  return (
    <div
      style={{ borderTop: `3px solid ${color}` }}
      className="bg-white/[0.02] backdrop-blur-md border border-white/5 rounded-2xl p-4 text-center shadow-xl"
    >
      <div className="text-xl font-black text-white font-mono tracking-tight">
        {value}
      </div>
      <div className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mt-2">
        {label}
      </div>
    </div>
  );
}

// ── MAIN HISTORY INTERFACE WITH TABS ──────────────────────────────────────────
export default function IntegratedHistoryPage() {
  const [activeTab, setActiveTab] = useState("locations"); // TABS: locations | devices | alerts | geofences
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [expandedLoc, setExpandedLoc] = useState(null);

  // Consolidated Master State Data Matrix
  const [masterData, setMasterData] = useState({
    device: null,
    locations: [],
    totalLocations: 0,
    nextLocationPage: null,
    locationPage: 1,
    devicesList: [],
    alertsList: [],
    geofencesList: [],
    error: null,
  });

  // Fetch Full Ecosystem logs synchronously in Promise clusters
  const loadMasterEcosystem = useCallback(async () => {
    try {
      setLoading(true);
      const [devsR, alertsR, geosR] = await Promise.allSettled([
        getDevices(),
        getAlerts(),
        getGeofences(),
      ]);

      const devices =
        devsR.status === "fulfilled"
          ? devsR.value?.results || devsR.value || []
          : [];
      const primaryDevice = devices[0] || null;

      let locations = [];
      let totalLocations = 0;
      let nextLocationPage = null;

      if (primaryDevice) {
        try {
          const locsData = await getDeviceLocations(primaryDevice.id, 1);
          locations =
            locsData?.results || (Array.isArray(locsData) ? locsData : []);
          totalLocations = locsData?.count || locations.length;
          nextLocationPage = locsData?.next || null;
        } catch (err) {
          console.error("GPS stream omitted for empty arrays", err);
        }
      }

      setMasterData({
        device: primaryDevice,
        locations,
        totalLocations,
        nextLocationPage,
        locationPage: 1,
        devicesList: devices,
        alertsList:
          alertsR.status === "fulfilled"
            ? alertsR.value?.results || alertsR.value || []
            : [],
        geofencesList:
          geosR.status === "fulfilled"
            ? geosR.value?.results || geosR.value || []
            : [],
        error: primaryDevice
          ? null
          : "No active data streams intercepted on this client node.",
        loading: false,
      });
    } catch {
      setMasterData((p) => ({
        ...p,
        error: "Failed to load central telemetry payload structure.",
      }));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMasterEcosystem();
  }, [loadMasterEcosystem]);

  // Infinite Scroll Handler for GPS points
  const loadMoreLocations = async () => {
    if (!masterData.nextLocationPage || loadingMore) return;
    setLoadingMore(true);
    try {
      const nextPageNum = masterData.locationPage + 1;
      const data = await getDeviceLocations(masterData.device.id, nextPageNum);
      const newLocs = data?.results || (Array.isArray(data) ? data : []);
      setMasterData((p) => ({
        ...p,
        locations: [...p.locations, ...newLocs],
        nextLocationPage: data?.next || null,
        locationPage: nextPageNum,
      }));
    } catch (e) {
      console.error("Pagination block dropped", e);
    } finally {
      setLoadingMore(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-purple-500/20 border-t-purple-500 animate-spin" />
        <span className="text-gray-500 text-xs font-bold uppercase tracking-wider">
          Syncing Master Database Logs…
        </span>
      </div>
    );
  }

  if (masterData.error && masterData.devicesList.length === 0) {
    return (
      <div className="text-center p-10 bg-red-950/10 border border-red-500/20 rounded-2xl max-w-md mx-auto shadow-2xl">
        <div className="text-4xl mb-3">⚠️</div>
        <p className="text-red-400 text-sm font-bold uppercase tracking-wider">
          {masterData.error}
        </p>
      </div>
    );
  }

  // Mathematics Matrix calculation loops
  let totalDist = 0;
  for (let i = 1; i < masterData.locations.length; i++) {
    totalDist += haversine(
      parseFloat(masterData.locations[i - 1].latitude),
      parseFloat(masterData.locations[i - 1].longitude),
      parseFloat(masterData.locations[i].latitude),
      parseFloat(masterData.locations[i].longitude),
    );
  }
  const avgSpeed = masterData.locations.length
    ? masterData.locations.reduce((s, l) => s + (parseFloat(l.speed) || 0), 0) /
      masterData.locations.length
    : 0;

  return (
    <div className="min-h-screen bg-[#030712] p-4 md:p-8 text-slate-100 relative overflow-hidden font-sans">
      {/* Background Matrix Mesh Gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-900/10 blur-[130px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-900/10 blur-[130px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto space-y-6">
        {/* Main Central System Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-5">
          <div>
            <h1 className="text-2xl font-black text-white italic tracking-tight m-0">
              Nirapod SafeGuard Analytics
            </h1>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1.5">
              Parent Command Terminal System Center &nbsp;·&nbsp; Complete
              Ecosystem History
            </p>
          </div>
          <button
            onClick={loadMasterEcosystem}
            className="h-10 px-5 rounded-xl border border-white/10 bg-white/5 font-bold text-xs uppercase text-gray-300 hover:bg-white/10 transition-all shadow-lg self-start sm:self-center"
          >
            ↺ Refresh Logs
          </button>
        </div>

        {/* Tab Selection Switches Container */}
        <div className="flex gap-1.5 p-1 bg-black/40 border border-white/5 rounded-2xl backdrop-blur-md overflow-x-auto custom-scrollbar">
          {[
            {
              id: "locations",
              label: "📍 GPS Tracking Map",
              count: masterData.totalLocations,
            },
            {
              id: "devices",
              label: "📱 Hardware Profile",
              count: masterData.devicesList.length,
            },
            {
              id: "alerts",
              label: "🚨 Incident Signals",
              count: masterData.alertsList.length,
            },
            {
              id: "geofences",
              label: "🛡️ Config SafeZones",
              count: masterData.geofencesList.length,
            },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 flex items-center gap-2 ${
                activeTab === tab.id
                  ? "bg-white/10 text-white border border-white/5 shadow-xl"
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              {tab.label}
              <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-white/5 text-gray-400 font-mono">
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* ─── TAB CONTENT 1: LOCATION HISTORY ─── */}
        {activeTab === "locations" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <StatCard
                label="Intercepted Vectors"
                value={masterData.totalLocations.toLocaleString()}
                color="#60a5fa"
              />
              <StatCard
                label="Displacement Path"
                value={fmtDist(totalDist)}
                color="#22c55e"
              />
              <StatCard
                label="Average Velocity"
                value={`${avgSpeed.toFixed(1)} km/h`}
                color="#a78bfa"
              />
            </div>

            <div className="bg-white/[0.01] border border-white/5 rounded-[24px] p-4 shadow-2xl backdrop-blur-md">
              <RouteMap locations={masterData.locations} />
            </div>

            {/* Timeline Intercept Stream */}
            <div className="bg-white/[0.01] border border-white/5 rounded-[24px] p-5 shadow-2xl backdrop-blur-md">
              <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest border-b border-white/5 pb-3 mb-4">
                🕐 Sequential Node Packet Timeline
              </div>
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {masterData.locations.map((loc, i) => (
                  <div
                    key={loc.id || i}
                    className="flex gap-4 border-b border-white/[0.02] pb-3 last:border-0 last:pb-0"
                  >
                    <div className="text-[10px] font-mono text-gray-500 text-right min-w-[50px]">
                      {fmtTime(loc.timestamp).split(":").slice(0, 2).join(":")}
                    </div>
                    <div
                      className={`w-2 h-2 rounded-full mt-1 border border-[#030712] ${i === 0 ? "bg-emerald-400 shadow-[0_0_8px_#34d399]" : "bg-purple-600"}`}
                    />
                    <div className="flex-1">
                      <div
                        onClick={() =>
                          setExpandedLoc(expandedLoc === i ? null : i)
                        }
                        className="text-xs font-bold text-slate-300 font-mono cursor-pointer hover:text-purple-400 transition-colors"
                      >
                        {parseFloat(loc.latitude).toFixed(5)}°N,{" "}
                        {parseFloat(loc.longitude).toFixed(5)}°E
                      </div>
                      <div className="flex gap-2 mt-1 text-[9px] font-bold">
                        <span className="text-blue-400 font-mono">
                          ⚡ {parseFloat(loc.speed || 0).toFixed(1)} km/h
                        </span>
                        <span className="text-purple-400 font-mono">
                          🎯 ±{loc.accuracy || 30}m
                        </span>
                      </div>
                      {expandedLoc === i && (
                        <div className="mt-2 p-3 bg-white/[0.02] border border-white/5 rounded-xl text-[10px] text-gray-400 space-y-1 font-mono">
                          <div>
                            Timestamp:{" "}
                            {new Date(loc.timestamp).toLocaleString("en-BD")}
                          </div>
                          <div className="truncate">Node ID: {loc.id}</div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              {masterData.nextLocationPage && (
                <div className="text-center pt-4 border-t border-white/5 mt-4">
                  <button
                    onClick={loadMoreLocations}
                    disabled={loadingMore}
                    className="h-9 px-5 bg-purple-500/10 border border-purple-500/20 rounded-xl text-xs text-purple-400 font-bold uppercase tracking-wider hover:bg-purple-500/20 disabled:opacity-40 transition-all"
                  >
                    {loadingMore
                      ? "Streaming..."
                      : "Fetch Older Telemetry Packets"}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ─── TAB CONTENT 2: REGISTERED DEVICES HISTORY ─── */}
        {activeTab === "devices" && (
          <div className="grid md:grid-cols-2 gap-4 animate-in fade-in duration-300">
            {masterData.devicesList.map((dev) => (
              <div
                key={dev.id}
                className="bg-white/[0.01] border border-white/5 rounded-2xl p-5 backdrop-blur-md relative overflow-hidden"
                style={{
                  borderLeft: dev.is_active
                    ? "4px solid #10B981"
                    : "4px solid #6B7280",
                }}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-sm font-bold text-white tracking-wide m-0">
                      {dev.name || "Unnamed Core Node"}
                    </h3>
                    <p className="text-[10px] text-gray-500 font-mono tracking-tighter mt-1 break-all select-all">
                      UUID: {dev.id}
                    </p>
                  </div>
                  <span
                    className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded border ${dev.is_active ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-white/5 border-white/10 text-gray-500"}`}
                  >
                    {dev.is_active ? "● SENSOR ENGAGED" : "○ OFFLINE"}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-white/[0.03] text-[11px] font-medium text-gray-400">
                  <div>
                    🔋 Power Core:{" "}
                    <span className="text-slate-200 font-bold font-mono">
                      {dev.battery_pct != null ? `${dev.battery_pct}%` : "—"}
                    </span>
                  </div>
                  <div>
                    📡 Last Ping:{" "}
                    <span className="text-slate-200 font-bold font-mono">
                      {dev.last_seen ? relativeTime(dev.last_seen) : "Never"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ─── TAB CONTENT 3: ALERTS/INCIDENTS HISTORY ─── */}
        {activeTab === "alerts" && (
          <div className="space-y-3 animate-in fade-in duration-300">
            {masterData.alertsList.map((alert) => (
              <div
                key={alert.id}
                className="bg-white/[0.01] border border-white/5 rounded-xl p-4 flex items-center justify-between gap-4"
                style={{
                  borderLeft: alert.resolved
                    ? "3px solid #64748B"
                    : "3px solid #EF4444",
                }}
              >
                <div className="min-w-0 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-black text-white tracking-wide">
                      {alert.alert_type} SIGNAL
                    </span>
                    <span
                      className={`text-[8px] font-bold uppercase px-1.5 py-0.5 rounded ${alert.resolved ? "bg-white/5 text-gray-400 border border-white/10" : "bg-red-500/10 border border-red-500/20 text-red-400 animate-pulse"}`}
                    >
                      {alert.resolved ? "Resolved Clear" : "🚨 Action Required"}
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-500 font-mono m-0">
                    Vector Fix: {alert.latitude}°N, {alert.longitude}°E ·{" "}
                    {new Date(alert.timestamp).toLocaleString("en-BD")}
                  </p>
                  {alert.sms_sent && (
                    <span className="inline-block text-[8px] bg-emerald-500/5 text-emerald-400 border border-emerald-500/20 font-bold uppercase tracking-widest px-1 rounded mt-1">
                      ✉ SMS Relay Dispatched
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ─── TAB CONTENT 4: SAFE ZONES GEOFENCES ─── */}
        {activeTab === "geofences" && (
          <div className="grid md:grid-cols-2 gap-4 animate-in fade-in duration-300">
            {masterData.geofencesList.map((zone) => (
              <div
                key={zone.id}
                className="bg-white/[0.01] border border-white/5 rounded-2xl p-5 backdrop-blur-md relative"
                style={{ borderLeft: `3px solid #7C3AED40` }}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xs md:text-sm font-extrabold text-slate-200 tracking-wide m-0">
                      🛡️ Area Fenced: {zone.name}
                    </h3>
                    <p className="text-[10px] text-gray-500 font-mono tracking-tighter mt-1">
                      {parseFloat(zone.latitude).toFixed(5)}°N,{" "}
                      {parseFloat(zone.longitude).toFixed(5)}°E
                    </p>
                  </div>
                  <span
                    className={`text-[8px] font-extrabold px-2 py-0.5 rounded border tracking-wider uppercase ${zone.is_active ? "bg-green-500/10 border-green-500/20 text-green-400" : "bg-white/5 border-white/10 text-gray-500"}`}
                  >
                    {zone.is_active ? "● ACTIVE MONITOR" : "○ OFFLINE"}
                  </span>
                </div>
                <div className="mt-3.5 pt-3.5 border-t border-white/[0.03] flex items-center justify-between text-[10px] text-gray-500">
                  <span className="font-bold text-purple-400 font-mono bg-purple-500/5 border border-purple-500/10 px-2 py-0.5 rounded">
                    ⊙ Radius Matrix: {zone.radius_m}m
                  </span>
                  {zone.device_name && (
                    <span className="truncate">
                      Device Link: {zone.device_name}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Additional formatting time handler logic wrapper
function relativeTime(ts) {
  if (!ts) return "—";
  const diff = Math.floor((Date.now() - new Date(ts)) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  return new Date(ts).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}
