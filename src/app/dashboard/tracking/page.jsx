"use client";
// app/dashboard/tracking/page.jsx
import { useState, useEffect, useCallback, useRef } from "react";
import {
  getDevices,
  getLatestLocation,
  getDeviceLocations,
  connectDeviceSocket,
} from "@/lib/api";

// ── Helpers ────────────────────────────────────────────────────────────────
const fmt = (v, decimals = 6) =>
  v != null ? parseFloat(v).toFixed(decimals) : null;

const relativeTime = (ts) => {
  if (!ts) return "—";
  const diff = Math.floor((Date.now() - new Date(ts)) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  return new Date(ts).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

// ── Mini Leaflet Map ───────────────────────────────────────────────────────
function LiveMap({ lat, lon, accuracy, deviceName }) {
  const mapRef = useRef(null);
  const leafletRef = useRef(null);
  const markerRef = useRef(null);
  const circleRef = useRef(null);
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const initMap = async () => {
      if (!window.L) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(link);
        await new Promise((res) => {
          const s = document.createElement("script");
          s.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
          s.onload = res;
          document.head.appendChild(s);
        });
      }
      const L = window.L;
      const defaultLat = 23.726008;
      const defaultLon = 90.406723;
      const map = L.map(mapRef.current, {
        zoomControl: true,
        attributionControl: false,
      }).setView([defaultLat, defaultLon], 15);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
      }).addTo(map);
      const pulseIcon = L.divIcon({
        html: `<div style="position:relative;width:24px;height:24px">
          <div style="position:absolute;inset:0;border-radius:50%;background:#7C3AED;opacity:0.3;animation:ping 1.5s infinite"></div>
          <div style="position:absolute;inset:4px;border-radius:50%;background:#7C3AED;border:2px solid white;box-shadow:0 0 8px rgba(124,58,237,0.6)"></div>
        </div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
        className: "",
      });
      markerRef.current = L.marker([defaultLat, defaultLon], {
        icon: pulseIcon,
      }).addTo(map);
      circleRef.current = L.circle([defaultLat, defaultLon], {
        radius: 50,
        color: "#7C3AED",
        fillColor: "#7C3AED",
        fillOpacity: 0.08,
        weight: 1,
      }).addTo(map);
      leafletRef.current = map;
      setMapReady(true);
    };
    initMap();
    return () => leafletRef.current?.remove();
  }, []);

  useEffect(() => {
    if (!mapReady || !leafletRef.current || !lat || !lon) return;
    const L = window.L;
    const coords = [parseFloat(lat), parseFloat(lon)];
    markerRef.current?.setLatLng(coords);
    circleRef.current?.setLatLng(coords).setRadius(accuracy || 30);
    leafletRef.current.setView(coords, 16, { animate: true, duration: 0.8 });
  }, [lat, lon, accuracy, mapReady]);

  return (
    <div
      style={{
        position: "relative",
        borderRadius: 16,
        overflow: "hidden",
        height: 380,
        background: "#0f172a",
      }}
    >
      <style>{`@keyframes ping{0%{transform:scale(1);opacity:0.5}80%,100%{transform:scale(2.5);opacity:0}}`}</style>
      <div ref={mapRef} style={{ width: "100%", height: "100%" }} />
      {!lat && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: 8,
            background: "rgba(15,23,42,0.85)",
            color: "#64748b",
            fontSize: 13,
          }}
        >
          <svg
            width="32"
            height="32"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
          >
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
            <circle cx="12" cy="9" r="2.5" />
          </svg>
          <span>Awaiting GPS signal…</span>
        </div>
      )}
      {deviceName && (
        <div
          style={{
            position: "absolute",
            top: 12,
            left: 12,
            zIndex: 1000,
            background: "rgba(15,23,42,0.88)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(124,58,237,0.3)",
            borderRadius: 10,
            padding: "6px 12px",
            fontSize: 11,
            color: "#a78bfa",
            fontWeight: 600,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
          }}
        >
          📡 {deviceName}
        </div>
      )}
    </div>
  );
}

// ── Stat Pill ──────────────────────────────────────────────────────────────
function StatPill({ icon, label, value, color, glow }) {
  return (
    <div
      style={{
        background: "#0f172a",
        border: `1px solid ${color}22`,
        borderRadius: 14,
        padding: "14px 16px",
        display: "flex",
        flexDirection: "column",
        gap: 6,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {glow && (
        <div
          style={{
            position: "absolute",
            top: -20,
            right: -20,
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: `${color}18`,
            filter: "blur(20px)",
            pointerEvents: "none",
          }}
        />
      )}
      <div style={{ fontSize: 18 }}>{icon}</div>
      <div
        style={{
          fontSize: 15,
          fontWeight: 800,
          color,
          fontFamily: "monospace",
          letterSpacing: "-0.02em",
        }}
      >
        {value ?? "—"}
      </div>
      <div
        style={{
          fontSize: 9,
          color: "#475569",
          fontWeight: 600,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
        }}
      >
        {label}
      </div>
    </div>
  );
}

// ── Status Badge ───────────────────────────────────────────────────────────
function StatusDot({ live }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "4px 10px",
        borderRadius: 20,
        background: live ? "rgba(34,197,94,0.12)" : "rgba(100,116,139,0.12)",
        border: `1px solid ${live ? "rgba(34,197,94,0.3)" : "rgba(100,116,139,0.2)"}`,
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: "0.06em",
        color: live ? "#22c55e" : "#64748b",
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: live ? "#22c55e" : "#64748b",
          boxShadow: live ? "0 0 6px #22c55e" : "none",
          animation: live ? "livepulse 2s infinite" : "none",
        }}
      />
      {live ? "LIVE" : "OFFLINE"}
    </span>
  );
}

// ── Detail Row ─────────────────────────────────────────────────────────────
function DetailRow({ label, value, mono, last }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "11px 0",
        borderBottom: last ? "none" : "1px solid rgba(255,255,255,0.04)",
      }}
    >
      <span style={{ fontSize: 11, color: "#475569", fontWeight: 500 }}>
        {label}
      </span>
      <span
        style={{
          fontSize: 12,
          color: "#cbd5e1",
          fontWeight: mono ? 700 : 500,
          fontFamily: mono ? "monospace" : "inherit",
          background: mono ? "rgba(255,255,255,0.04)" : "none",
          padding: mono ? "2px 8px" : 0,
          borderRadius: mono ? 6 : 0,
        }}
      >
        {value ?? "—"}
      </span>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────
export default function TrackingPage() {
  const [state, setState] = useState({
    device: null,
    location: null,
    locationCount: 0,
    wsStatus: "disconnected", // disconnected | connecting | live
    loading: true,
    lastRefreshed: null,
    error: null,
  });
  const wsRef = useRef(null);

  const loadData = useCallback(async () => {
    try {
      const devices = await getDevices();
      const device = Array.isArray(devices)
        ? devices[0]
        : (devices?.results?.[0] ?? null);
      if (!device) {
        setState((p) => ({
          ...p,
          loading: false,
          error: "No device registered.",
        }));
        return;
      }
      // Use /latest/ endpoint for single accurate fix
      let location = null;
      try {
        location = await getLatestLocation(device.id);
      } catch {
        // fallback to paginated
        const locs = await getDeviceLocations(device.id, 1);
        location = locs?.results?.[0] ?? null;
      }
      const locsPage = await getDeviceLocations(device.id, 1);
      setState((p) => ({
        ...p,
        device,
        location,
        locationCount: locsPage?.count ?? 0,
        loading: false,
        lastRefreshed: new Date(),
        error: null,
      }));
      return device;
    } catch (e) {
      setState((p) => ({
        ...p,
        loading: false,
        error: "Failed to load data.",
      }));
    }
  }, []);

  // WebSocket setup
  const connectWS = useCallback((device) => {
    if (!device?.id) return;
    wsRef.current?.close();
    setState((p) => ({ ...p, wsStatus: "connecting" }));
    const ws = connectDeviceSocket(device.id, {
      onOpen: () => setState((p) => ({ ...p, wsStatus: "live" })),
      onClose: () => setState((p) => ({ ...p, wsStatus: "disconnected" })),
      onError: () => setState((p) => ({ ...p, wsStatus: "disconnected" })),
      onLocation: (msg) => {
        setState((p) => ({
          ...p,
          location: {
            ...p.location,
            latitude: msg.lat,
            longitude: msg.lon,
            timestamp: msg.ts,
          },
          lastRefreshed: new Date(),
        }));
      },
      onAlert: (msg) => {
        // Could dispatch a toast here
        console.warn("Alert received:", msg);
      },
    });
    wsRef.current = ws;
  }, []);

  useEffect(() => {
    loadData().then((device) => {
      if (device) connectWS(device);
    });
    return () => wsRef.current?.close();
  }, []);

  const handleManualRefresh = async () => {
    const { device } = state;
    if (!device) return;
    setState((p) => ({ ...p, loading: true }));
    try {
      const location = await getLatestLocation(device.id);
      setState((p) => ({
        ...p,
        location,
        loading: false,
        lastRefreshed: new Date(),
      }));
    } catch {
      setState((p) => ({ ...p, loading: false }));
    }
  };

  if (state.loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: 400,
          flexDirection: "column",
          gap: 12,
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            border: "2px solid rgba(124,58,237,0.2)",
            borderTop: "2px solid #7c3aed",
            animation: "spin 0.8s linear infinite",
          }}
        />
        <span style={{ color: "#475569", fontSize: 12 }}>
          Loading tracking data…
        </span>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  if (state.error && !state.device) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: 40,
          color: "#ef4444",
          background: "rgba(239,68,68,0.06)",
          borderRadius: 16,
          border: "1px solid rgba(239,68,68,0.15)",
        }}
      >
        <div style={{ fontSize: 28, marginBottom: 8 }}>⚠️</div>
        <p style={{ margin: 0, fontSize: 13 }}>{state.error}</p>
      </div>
    );
  }

  const {
    location: loc,
    device,
    locationCount,
    wsStatus,
    lastRefreshed,
  } = state;
  const isLive = wsStatus === "live";

  return (
    <div>
      <style>{`
        @keyframes livepulse{0%,100%{opacity:1}50%{opacity:0.4}}
        @keyframes fadein{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
        .track-section{animation:fadein 0.35s ease both}
      `}</style>

      {/* Header */}
      <div
        className="track-section"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      >
        <div>
          <h2
            style={{
              margin: 0,
              fontSize: 20,
              fontWeight: 800,
              color: "#f1f5f9",
              letterSpacing: "-0.03em",
            }}
          >
            Live GPS Tracking
          </h2>
          <p style={{ margin: "4px 0 0", fontSize: 11, color: "#475569" }}>
            {lastRefreshed
              ? `Updated ${relativeTime(lastRefreshed)}`
              : "Waiting for data…"}
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <StatusDot live={isLive} />
          <button
            onClick={handleManualRefresh}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "7px 14px",
              borderRadius: 10,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "#94a3b8",
              fontSize: 11,
              fontWeight: 700,
              cursor: "pointer",
              letterSpacing: "0.04em",
            }}
          >
            ↻ Refresh
          </button>
        </div>
      </div>

      {/* Map */}
      <div className="track-section" style={{ marginBottom: 16 }}>
        <LiveMap
          lat={loc?.latitude}
          lon={loc?.longitude}
          accuracy={loc?.accuracy}
          deviceName={loc?.device_name || device?.name}
        />
      </div>

      {/* Stat pills */}
      <div
        className="track-section"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
          gap: 10,
          marginBottom: 16,
        }}
      >
        <StatPill
          icon="🧭"
          label="Latitude"
          color="#60a5fa"
          glow
          value={loc ? `${fmt(loc.latitude, 6)}°N` : null}
        />
        <StatPill
          icon="🧭"
          label="Longitude"
          color="#60a5fa"
          value={loc ? `${fmt(loc.longitude, 6)}°E` : null}
        />
        <StatPill
          icon="⚡"
          label="Speed"
          color="#22c55e"
          glow
          value={
            loc?.speed != null
              ? `${parseFloat(loc.speed).toFixed(1)} km/h`
              : "0 km/h"
          }
        />
        <StatPill
          icon="🎯"
          label="Accuracy"
          color="#a78bfa"
          value={loc?.accuracy != null ? `±${loc.accuracy}m` : null}
        />
      </div>

      {/* Detail card */}
      <div
        className="track-section"
        style={{
          background: "#0f172a",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: 16,
          padding: "4px 18px 2px",
        }}
      >
        <div
          style={{
            padding: "12px 0 10px",
            fontSize: 11,
            fontWeight: 700,
            color: "#475569",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
            marginBottom: 4,
          }}
        >
          📍 Location Details
        </div>
        <DetailRow
          label="Last Updated"
          value={
            loc?.timestamp ? new Date(loc.timestamp).toLocaleString() : "—"
          }
        />
        <DetailRow
          label="Location ID"
          value={loc?.id ? `${loc.id.slice(0, 8)}…` : "—"}
          mono
        />
        <DetailRow
          label="Device"
          value={loc?.device_name || device?.name || "—"}
        />
        <DetailRow
          label="Battery"
          value={device?.battery_pct != null ? `${device.battery_pct}%` : "—"}
        />
        <DetailRow
          label="Total Readings"
          value={locationCount > 0 ? locationCount.toLocaleString() : "—"}
        />
        <DetailRow
          label="Connection"
          value={
            wsStatus === "live"
              ? "WebSocket Active"
              : wsStatus === "connecting"
                ? "Connecting…"
                : "REST Polling"
          }
        />
        <DetailRow label="Safe Zone Monitor" value="Active ✓" last />
      </div>

      {/* WebSocket hint */}
      {!isLive && (
        <div
          className="track-section"
          style={{
            marginTop: 10,
            padding: "10px 16px",
            background: "rgba(234,179,8,0.06)",
            border: "1px solid rgba(234,179,8,0.15)",
            borderRadius: 12,
            fontSize: 11,
            color: "#ca8a04",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span>⚠️</span>
          <span>
            WebSocket{" "}
            {wsStatus === "connecting" ? "connecting…" : "unavailable"} — using
            REST fallback. Live updates paused.
          </span>
        </div>
      )}
    </div>
  );
}
