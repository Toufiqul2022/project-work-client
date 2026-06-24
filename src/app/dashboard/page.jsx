"use client";
// app/dashboard/page.jsx  — Overview
import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic"; // SSR হ্যান্ডেল করার জন্য ডাইনামিক ইম্পোর্ট
import {
  getMe,
  getDevices,
  getAlerts,
  getLocations,
  getLatestLocation,
  getGeofences,
  connectDeviceSocket,
} from "@/lib/api";
import { Card, ListItem, Icon, Icons } from "./shared";
import { formatKmh } from "@/lib/format";

// ── Leaflet Components Dynamically Loaded ───────────────────────────────────
// সার্ভার সাইডে window অবজেক্ট না থাকায় Leaflet ম্যাপকে Client-only করা হয়েছে
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false },
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false },
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false },
);
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});
const Circle = dynamic(
  () => import("react-leaflet").then((mod) => mod.Circle),
  { ssr: false },
);

// Leaflet এর ডিফল্ট মার্কার আইকন ফিক্স করার জন্য একটি ক্লায়েন্ট-সাইড কম্পোনেন্ট
function LeafletMapWrapper({ lat, lon, accuracy, deviceName }) {
  const [leafletIcon, setLeafletIcon] = useState(null);
  const mapRef = useRef(null);

  useEffect(() => {
    // শুধুমাত্র ক্লায়েন্ট সাইডে Leaflet Icon মডিউল ইনিশিয়েট হবে
    import("leaflet").then((L) => {
      const icon = new L.Icon({
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
      });
      setLeafletIcon(icon);
    });
  }, []);

  // রিয়েল-টাইম জিপিএস ড্রিপ্ট হলে ম্যাপকে অটোমেটিক নতুন কোঅর্ডিনেটে প্যান করবে
  useEffect(() => {
    if (mapRef.current && lat && lon) {
      mapRef.current.setView(
        [parseFloat(lat), parseFloat(lon)],
        mapRef.current.getZoom(),
      );
    }
  }, [lat, lon]);

  if (!lat || !lon || !leafletIcon) {
    return (
      <div className="w-full h-40 md:h-[175px] rounded-xl bg-white/5 flex items-center justify-center text-xs text-slate-500 font-medium">
        📡 Waiting for GPS Signal...
      </div>
    );
  }

  const position = [parseFloat(lat), parseFloat(lon)];

  return (
    <div className="w-full h-40 md:h-[175px] rounded-xl overflow-hidden border border-white/10 relative z-10">
      <MapContainer
        center={position}
        zoom={15}
        scrollWheelZoom={false}
        className="w-full h-full"
        ref={mapRef}
      >
        {/* প্রজেক্ট থিমের সাথে সামঞ্জস্যপূর্ণ ডার্ক মোড ম্যাপ কার্টোগ্রাফি ম্যাট্রিক্স */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        {/* অ্যাকুরেসি রেডিয়াস বাউন্ডারি ও পালস */}
        <Circle
          center={position}
          radius={parseFloat(accuracy || 30)}
          pathOptions={{
            color: "#7C3AED",
            fillColor: "#7C3AED",
            fillOpacity: 0.1,
            weight: 1,
          }}
        />

        {/* চাইল্ড ডিভাইস মার্কার */}
        <Marker position={position} icon={leafletIcon}>
          <Popup className="custom-leaflet-popup">
            <div className="text-xs font-bold text-slate-800">
              {deviceName || "Child Device"}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              Live Coordinates Linked
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}

// ── Leaflet Dynamic Ref Setup ───────────────────────────────────────────────
import { useRef } from "react";

export default function OverviewPage() {
  const [sosActive, setSosActive] = useState(false);
  const [data, setData] = useState({
    user: null,
    devices: [],
    alerts: [],
    locations: [],
    locationCount: 0,
    latestLocation: null,
    geofences: [],
    loading: true,
  });

  useEffect(() => {
    async function load() {
      const [userR, devsR, alertsR, locsR, geosR] = await Promise.allSettled([
        getMe(),
        getDevices(),
        getAlerts(),
        getLocations(1),
        getGeofences(),
      ]);
      const devices =
        devsR.status === "fulfilled"
          ? Array.isArray(devsR.value)
            ? devsR.value
            : devsR.value?.results || []
          : [];
      const locsData =
        locsR.status === "fulfilled" ? locsR.value : { results: [], count: 0 };
      const locations = locsData.results || locsData || [];

      let latestLocation = null;
      if (devices[0]) {
        try {
          latestLocation = await getLatestLocation(devices[0].id);
        } catch {}
        if (!latestLocation && locations[0]) latestLocation = locations[0];
      }

      setData({
        user: userR.status === "fulfilled" ? userR.value : null,
        devices,
        alerts:
          alertsR.status === "fulfilled"
            ? alertsR.value?.results || alertsR.value || []
            : [],
        locations,
        locationCount: locsData.count || locations.length,
        latestLocation,
        geofences:
          geosR.status === "fulfilled"
            ? geosR.value?.results || geosR.value || []
            : [],
        loading: false,
      });
    }
    load();
  }, []);

  // WebSocket real-time
  useEffect(() => {
    if (!data.devices[0]) return;
    const ws = connectDeviceSocket(data.devices[0].id, {
      onLocation: (msg) =>
        // WS location payload only carries lat/lon/ts — keep last known speed/accuracy
        setData((p) => {
          const loc = {
            ...p.latestLocation,
            latitude: msg.lat,
            longitude: msg.lon,
            timestamp: msg.ts,
          };
          return {
            ...p,
            latestLocation: loc,
            locations: [loc, ...p.locations],
            locationCount: p.locationCount + 1,
          };
        }),
      onAlert: (msg) =>
        setData((p) => ({
          ...p,
          alerts: [
            {
              id: Date.now(),
              alert_type: msg.alert_type,
              latitude: msg.lat,
              longitude: msg.lon,
              resolved: false,
              timestamp: new Date().toISOString(),
            },
            ...p.alerts,
          ],
        })),
    });
    return () => ws.close();
  }, [data.devices.length]);

  if (data.loading)
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
      </div>
    );

  const device = data.devices[0];
  const { latestLocation: loc, alerts, geofences } = data;
  const battery = device?.battery_pct ?? "—";
  const status = device ? (device.is_active ? "SAFE" : "OFFLINE") : "—";
  const unresolvedCount = alerts.filter((a) => !a.resolved).length;
  const timeSince = loc?.timestamp
    ? Math.round((Date.now() - new Date(loc.timestamp)) / 60000)
    : null;

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

      {/* Status cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mb-4">
        {[
          {
            label: "Device Status",
            value: status,
            sub: device
              ? `Last seen: ${device.last_seen ? new Date(device.last_seen).toLocaleTimeString() : "—"}`
              : "No device registered",
            color: status === "SAFE" ? "#22C55E" : "#EF4444",
            icon: status === "SAFE" ? "🟢" : "🔴",
          },
          {
            label: "Battery",
            value: battery !== "—" ? `${battery}%` : "—",
            sub:
              battery !== "—"
                ? `Est. ${Math.round(battery * 0.23)}h remaining`
                : "Connect device",
            color: battery > 20 ? "#60A5FA" : "#EF4444",
            icon: "🔋",
          },
          {
            label: "GPS Signal",
            value: loc ? "Active" : "No Signal",
            sub:
              timeSince !== null
                ? `Updated ${timeSince}m ago`
                : "Waiting for GPS...",
            color: loc ? "#22C55E" : "#6B7280",
            icon: "📡",
          },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-[#0D1117] rounded-2xl p-4 md:p-5"
            style={{
              border: `1px solid ${s.color}18`,
              borderTop: `2px solid ${s.color}`,
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

      {/* Map + stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <Card title="📍 Live Location">
          {/* এখানে এক্সিস্টিং LiveMap কম্পোনেন্টের পরিবর্তে প্রজেক্ট থিম বেসড LeafletMapWrapper ব্যবহার করা হয়েছে */}
          <LeafletMapWrapper
            lat={loc?.latitude}
            lon={loc?.longitude}
            accuracy={loc?.accuracy}
            deviceName={device?.name}
          />
          <div className="mt-3 flex flex-wrap gap-2">
            {loc?.speed != null && (
              <div className="flex items-center gap-1.5 bg-white/5 rounded-lg px-2.5 py-1.5 text-[10px] text-slate-300">
                <Icon d={Icons.navigate} size={10} color="#60A5FA" />
                {formatKmh(loc.speed)}
              </div>
            )}
            {loc?.accuracy != null && (
              <div className="flex items-center gap-1.5 bg-white/5 rounded-lg px-2.5 py-1.5 text-[10px] text-slate-300">
                <Icon d={Icons.satellite} size={10} color="#A78BFA" />±
                {loc.accuracy}m accuracy
              </div>
            )}
            {loc?.timestamp && (
              <div className="flex items-center gap-1.5 bg-white/5 rounded-lg px-2.5 py-1.5 text-[10px] text-slate-300">
                <Icon d={Icons.clock} size={10} color="#22C55E" />
                {new Date(loc.timestamp).toLocaleTimeString()}
              </div>
            )}
          </div>
        </Card>

        <Card title="📊 Location Statistics">
          <ListItem
            label="Total GPS Readings"
            value={(data.locationCount || 0).toString()}
          />
          <ListItem
            label="Latest Latitude"
            value={loc ? `${loc.latitude}°N` : "—"}
          />
          <ListItem
            label="Latest Longitude"
            value={loc ? `${loc.longitude}°E` : "—"}
          />
          <ListItem
            label="Current Speed"
            value={loc?.speed != null ? formatKmh(loc.speed) : "—"}
          />
          <ListItem
            label="GPS Accuracy"
            value={loc?.accuracy != null ? `±${loc.accuracy}m` : "—"}
            border={false}
          />
        </Card>
      </div>

      {/* Quick actions */}
      <Card title="⚡ Quick Actions">
        <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-6 py-2">
          <div className="w-full sm:w-auto flex flex-col items-center shrink-0">
            <button
              className={`w-20 h-20 md:w-24 md:h-24 rounded-full font-black text-xs md:text-sm tracking-widest text-white transition-all duration-300 flex items-center justify-center
                ${
                  sosActive
                    ? "bg-red-500/20 border-4 border-red-500 shadow-[0_0_32px_rgba(239,68,68,0.6)]"
                    : "bg-red-500 border-4 border-red-500/60 hover:brightness-110"
                }`}
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
              {
                label: "Total Alerts",
                value: alerts.length.toString(),
                color: "text-red-500",
              },
              {
                label: "Safe Zones",
                value: geofences.length.toString(),
                color: "text-green-500",
              },
              {
                label: "Unresolved",
                value: unresolvedCount.toString(),
                color: "text-yellow-400",
              },
              {
                label: "GPS Points",
                value: (data.locationCount || 0).toString(),
                color: "text-blue-400",
              },
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
    </div>
  );
}
