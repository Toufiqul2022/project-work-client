"use client";
// app/dashboard/zones/page.jsx
import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic"; // SSR এরর গার্ড হ্যান্ডেলার
import {
  getGeofences,
  getLatestLocation,
  getDevices,
  createGeofence,
  updateGeofence,
  patchGeofence,
  deleteGeofence,
} from "@/lib/api";
import { Card, Badge, ActionBtn, LiveMap, Icon, Icons } from "../shared";

// ── OpenStreetMap (Leaflet) click-to-pick centre point for a geofence ─────────
// Whole component is client-only — Leaflet's `useMapEvents` hook touches `window`.
const MapPicker = dynamic(() => import("./ZoneMapPicker"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-48 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-xs text-gray-500 font-mono">
      🗺️ Loading map…
    </div>
  ),
});

// ── Leaflet Core Component Layer Dynamically Loaded (No-SSR) ──────────────────
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
);
const Circle = dynamic(
  () => import("react-leaflet").then((mod) => mod.Circle),
  { ssr: false }
);

// Leaflet মার্কার আইকন ফিক্সচার ইঞ্জিন কম্পোনেন্ট
function LeafletZonesMap({ latestLoc, geofences }) {
  const [customIcon, setCustomIcon] = useState(null);
  const mapEngineRef = useRef(null);

  useEffect(() => {
    // উইন্ডো রেডি হওয়ার পর লিফলেট আইকন জেনারেট হবে
    import("leaflet").then((L) => {
      const icon = new L.Icon({
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
      });
      setCustomIcon(icon);
    });
  }, []);

  // লোকেশন পরিবর্তন হলে স্মুথ প্যান-ভিউ রেন্ডার
  useEffect(() => {
    if (mapEngineRef.current && latestLoc) {
      mapEngineRef.current.setView(
        [parseFloat(latestLoc.latitude), parseFloat(latestLoc.longitude)],
        mapEngineRef.current.getZoom()
      );
    }
  }, [latestLoc]);

  // ফ্যালব্যাক সেন্টার কন্ডিশন (Dhaka Position)
  const defaultCenter = latestLoc
    ? [parseFloat(latestLoc.latitude), parseFloat(latestLoc.longitude)]
    : [23.8103, 90.4125];

  if (typeof window === "undefined" || !customIcon) {
    return (
      <div className="w-full h-64 md:h-[320px] rounded-[22px] bg-white/5 flex items-center justify-center text-xs text-gray-500 font-mono">
        🛰️ Initializing Leaflet Radar Layout...
      </div>
    );
  }

  return (
    <div className="w-full h-64 md:h-[320px] rounded-[22px] overflow-hidden border border-white/10 relative z-10">
      <MapContainer
        center={defaultCenter}
        zoom={14}
        scrollWheelZoom={true}
        className="w-full h-full"
        ref={mapEngineRef}
      >
        {/* প্রজেক্ট থিমের সাথে সামঞ্জস্যপূর্ণ সাইবার পাঙ্ক প্রিমিয়াম ডার্ক ম্যাট্রিক্স টাইলস */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        {/* ১. চাইল্ড লাইভ পজিশন মার্কার ও রেডিয়াস */}
        {latestLoc && (
          <>
            <Circle
              center={[parseFloat(latestLoc.latitude), parseFloat(latestLoc.longitude)]}
              radius={parseFloat(latestLoc.accuracy || 30)}
              pathOptions={{
                color: "#3B82F6",
                fillColor: "#3B82F6",
                fillOpacity: 0.1,
                weight: 1,
              }}
            />
            <Marker
              position={[parseFloat(latestLoc.latitude), parseFloat(latestLoc.longitude)]}
              icon={customIcon}
            >
              <Popup>
                <div className="text-xs font-bold text-slate-900">📍 Child Active Device</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Real-time Telemetry Locked</div>
              </Popup>
            </Marker>
          </>
        )}

        {/* ২. ডাইনামিক সেফ জোন বাউন্ডারি জিওফেন্স রেন্ডারিং লুপ */}
        {geofences.map((zone) => {
          const PRESET_COLORS = ["#22C55E", "#3B82F6", "#F59E0B", "#EC4899", "#8B5CF6"];
          const zoneColor = PRESET_COLORS[zone.id % PRESET_COLORS.length] || "#22C55E";

          return (
            <Circle
              key={zone.id}
              center={[parseFloat(zone.latitude), parseFloat(zone.longitude)]}
              radius={parseInt(zone.radius_m, 10)}
              pathOptions={{
                color: zone.is_active ? zoneColor : "#6B7280",
                fillColor: zone.is_active ? zoneColor : "#6B7280",
                fillOpacity: zone.is_active ? 0.15 : 0.04,
                weight: 2,
                dashArray: zone.is_active ? "0" : "5, 5",
              }}
            >
              <Popup>
                <div className="text-xs font-bold text-slate-900">🛡️ Safe Zone: {zone.name}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Radius: {zone.radius_m}m · State: {zone.is_active ? "Active Monitor" : "Suspended"}</div>
              </Popup>
            </Circle>
          );
        })}
      </MapContainer>
    </div>
  );
}

// ─── MODAL ────────────────────────────────────────────────────────────────────
function Modal({ open, onClose, children }) {
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-md bg-[#0D1117] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {children}
      </div>
    </div>
  );
}

// ─── ZONE FORM ────────────────────────────────────────────────────────────────
const EMPTY = {
  name: "",
  latitude: "",
  longitude: "",
  radius_m: 150,
  is_active: true,
};

function ZoneForm({
  initial = EMPTY,
  devices = [],
  onSubmit,
  onCancel,
  loading,
  title,
}) {
  const [form, setForm] = useState({ ...EMPTY, ...initial });
  const [pickError, setPickError] = useState(null);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handle = (e) => {
    e.preventDefault();
    if (!form.latitude || !form.longitude) {
      setPickError("Please click the map to set a location first.");
      return;
    }
    setPickError(null);
    onSubmit({
      ...form,
      latitude: parseFloat(form.latitude),
      longitude: parseFloat(form.longitude),
      radius_m: parseInt(form.radius_m, 10),
    });
  };

  const InputClass =
    "w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-slate-200 placeholder:text-gray-600 focus:outline-none focus:border-purple-500/50 focus:bg-white/8 transition-colors";
  const LabelClass =
    "block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5";

  return (
    <form onSubmit={handle}>
      <div className="px-5 pt-5 pb-4 border-b border-white/5 flex items-center justify-between">
        <div>
          <div className="text-sm font-extrabold text-slate-100">{title}</div>
          <div className="text-[10px] text-gray-500 mt-0.5">Define a circular safe zone</div>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white flex items-center justify-center transition-colors text-xs font-bold"
        >
          ✕
        </button>
      </div>

      <div className="p-5 space-y-4">
        <div>
          <label className={LabelClass}>Zone Name</label>
          <input
            className={InputClass}
            placeholder="e.g. Home, School, Work"
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            required
          />
        </div>

        {devices.length > 0 && (
          <div>
            <label className={LabelClass}>Device</label>
            <select
              className={InputClass + " cursor-pointer"}
              value={form.device || ""}
              onChange={(e) => set("device", e.target.value)}
              required
            >
              <option value="" disabled>Select device…</option>
              {devices.map((d) => (
                <option key={d.id} value={d.id}>{d.name || d.id}</option>
              ))}
            </select>
          </div>
        )}

        {/* Location — OpenStreetMap click-to-pin picker */}
        <div>
          <label className={LabelClass}>
            Location
            <span className="ml-2 normal-case font-normal text-gray-600">
              — click map to pin centre point
            </span>
          </label>

          <MapPicker
            lat={form.latitude}
            lng={form.longitude}
            radius={form.radius_m}
            onPick={(lat, lng) => {
              set("latitude", lat.toFixed(6));
              set("longitude", lng.toFixed(6));
              setPickError(null);
            }}
          />
          {/* Read-only coordinate display below the map */}
          {form.latitude && form.longitude ? (
            <div className="mt-1.5 text-[10px] font-mono text-gray-500 text-center">
              📍 {parseFloat(form.latitude).toFixed(5)}°N ·{" "}
              {parseFloat(form.longitude).toFixed(5)}°E
            </div>
          ) : (
            <div className="mt-1.5 text-[10px] text-gray-600 text-center">
              Tap anywhere on the map to place the zone centre
            </div>
          )}

          {pickError && (
            <div className="text-[10px] text-red-400 font-semibold mt-1 text-center">
              {pickError}
            </div>
          )}
        </div>

        <div>
          <label className={LabelClass}>
            Radius — <span className="text-purple-400 normal-case font-extrabold">{form.radius_m}m</span>
            <span className="ml-2 text-gray-600 normal-case font-normal">(Home 100–150m · School 200–300m)</span>
          </label>
          <input
            type="range"
            min="50"
            max="1000"
            step="10"
            value={form.radius_m}
            onChange={(e) => set("radius_m", e.target.value)}
            className="w-full accent-purple-500 cursor-pointer"
          />
          <div className="flex justify-between text-[9px] text-gray-600 mt-1">
            <span>50m</span>
            <span>500m</span>
            <span>1000m</span>
          </div>
        </div>

        <div className="flex items-center justify-between bg-white/5 rounded-xl px-3 py-2.5">
          <div>
            <div className="text-xs font-semibold text-slate-300">Active</div>
            <div className="text-[10px] text-gray-500 mt-0.5">Trigger alerts when device leaves this zone</div>
          </div>
          <button
            type="button"
            onClick={() => set("is_active", !form.is_active)}
            className={`relative w-10 h-5 rounded-full transition-colors duration-200 shrink-0 ${form.is_active ? "bg-green-500" : "bg-white/10"}`}
          >
            <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all duration-200 ${form.is_active ? "left-5" : "left-0.5"}`} />
          </button>
        </div>

        <div className="flex gap-2 pt-1">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl border border-white/10 text-gray-400 text-xs font-semibold hover:bg-white/5 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white text-xs font-bold transition-colors"
          >
            {loading ? "Saving…" : title}
          </button>
        </div>
      </div>
    </form>
  );
}

// ─── ZONE CARD ────────────────────────────────────────────────────────────────
function ZoneCard({ zone, onEdit, onDelete, onToggle, deleting, toggling }) {
  const PRESET_COLORS = ["#22C55E", "#3B82F6", "#F59E0B", "#EC4899", "#8B5CF6", "#06B6D4"];
  const color = PRESET_COLORS[zone.id % PRESET_COLORS.length] || "#22C55E";

  return (
    <div
      className="bg-[#0D1117] border border-white/5 rounded-2xl p-4 mb-3 hover:border-white/10 transition-all duration-200 group"
      style={{ borderLeft: `3px solid ${color}30` }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-sm shrink-0 mt-0.5"
            style={{ backgroundColor: `${color}15`, border: `1px solid ${color}25` }}
          >
            📍
          </div>
          <div className="min-w-0">
            <div className="text-xs md:text-sm font-bold text-slate-200 truncate">{zone.name}</div>
            <div className="text-[10px] text-gray-500 mt-0.5 font-mono truncate">
              {parseFloat(zone.latitude).toFixed(5)}°N, {parseFloat(zone.longitude).toFixed(5)}°E
            </div>
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <span
                className="text-[9px] px-2 py-0.5 rounded-full font-bold border"
                style={{ backgroundColor: `${color}10`, borderColor: `${color}25`, color }}
              >
                ⊙ {zone.radius_m}m radius
              </span>
              {zone.device_name && <span className="text-[9px] text-gray-600 truncate">📱 {zone.device_name}</span>}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2 shrink-0">
          <Badge color={zone.is_active ? "#22C55E" : "#6B7280"}>
            {zone.is_active ? "● Active" : "○ Off"}
          </Badge>
          <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onToggle(zone)}
              disabled={toggling === zone.id}
              title={zone.is_active ? "Deactivate" : "Activate"}
              className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-green-400 flex items-center justify-center text-xs transition-colors disabled:opacity-40"
            >
              {toggling === zone.id ? "…" : zone.is_active ? "⏸" : "▶"}
            </button>
            <button
              onClick={() => onEdit(zone)}
              title="Edit zone"
              className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-blue-400 flex items-center justify-center text-xs transition-colors"
            >
              ✎
            </button>
            <button
              onClick={() => onDelete(zone.id)}
              disabled={deleting === zone.id}
              title="Delete zone"
              className="w-7 h-7 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 flex items-center justify-center text-xs transition-colors disabled:opacity-40"
            >
              {deleting === zone.id ? "…" : "🗑"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── CONFIRM DELETE ───────────────────────────────────────────────────────────
function ConfirmModal({ open, zoneName, onConfirm, onCancel, loading }) {
  return (
    <Modal open={open} onClose={onCancel}>
      <div className="p-6 text-center">
        <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-2xl mx-auto mb-4">
          🗑️
        </div>
        <div className="text-sm font-extrabold text-slate-100 mb-2">Delete Zone?</div>
        <div className="text-xs text-gray-500 mb-6">
          "<span className="text-slate-300 font-semibold">{zoneName}</span>" will be permanently removed.
          <br />Use deactivate to disable without deleting.
        </div>
        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl border border-white/10 text-gray-400 text-xs font-semibold hover:bg-white/5 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white text-xs font-bold transition-colors"
          >
            {loading ? "Deleting…" : "Yes, Delete"}
          </button>
        </div>
      </div>
    </Modal>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function ZonesPage() {
  const [geofences, setGeofences] = useState([]);
  const [devices, setDevices] = useState([]);
  const [latestLoc, setLatestLoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [createOpen, setCreateOpen] = useState(false);
  const [editZone, setEditZone] = useState(null); 
  const [deleteTarget, setDeleteTarget] = useState(null); 

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [toggling, setToggling] = useState(null);

  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  const showToast = (msg, type = "success") => {
    clearTimeout(toastTimer.current);
    setToast({ msg, type });
    toastTimer.current = setTimeout(() => setToast(null), 3000);
  };

  const [search, setSearch] = useState("");
  const [filterActive, setFilterActive] = useState("all"); 

  // ── Load API Feeds ──
  useEffect(() => {
    async function load() {
      setLoading(true);
      const [geosR, devsR] = await Promise.allSettled([
        getGeofences(),
        getDevices(),
      ]);
      const geos =
        geosR.status === "fulfilled"
          ? geosR.value?.results || geosR.value || []
          : [];
      const devs =
        devsR.status === "fulfilled"
          ? Array.isArray(devsR.value)
            ? devsR.value
            : devsR.value?.results || []
          : [];
      setGeofences(geos);
      setDevices(devs);
      if (devs[0]) {
        try {
          setLatestLoc(await getLatestLocation(devs[0].id));
        } catch {}
      }
      setLoading(false);
    }
    load();
  }, []);

  // ── Create ──
  const handleCreate = async (payload) => {
    setSaving(true);
    try {
      const zone = await createGeofence(payload);
      setGeofences((prev) => [zone, ...prev]);
      setCreateOpen(false);
      showToast(`✅ "${zone.name}" created`);
    } catch (e) {
      showToast("❌ Failed to create zone", "error");
    }
    setSaving(false);
  };

  // ── Edit ──
  const handleEdit = async (payload) => {
    setSaving(true);
    try {
      const zone = await updateGeofence(editZone.id, payload);
      setGeofences((prev) => prev.map((g) => (g.id === zone.id ? zone : g)));
      setEditZone(null);
      showToast(`✅ "${zone.name}" updated`);
    } catch (e) {
      showToast("❌ Failed to update zone", "error");
    }
    setSaving(false);
  };

  // ── Toggle active ──
  const handleToggle = async (zone) => {
    setToggling(zone.id);
    try {
      const updated = await patchGeofence(zone.id, {
        is_active: !zone.is_active,
      });
      setGeofences((prev) =>
        prev.map((g) => (g.id === updated.id ? updated : g)),
      );
      showToast(`${updated.is_active ? "✅ Activated" : "⏸ Deactivated"}: "${updated.name}"`);
    } catch {
      showToast("❌ Failed to toggle zone", "error");
    }
    setToggling(null);
  };

  // ── Delete ──
  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(deleteTarget.id);
    try {
      await deleteGeofence(deleteTarget.id);
      setGeofences((prev) => prev.filter((g) => g.id !== deleteTarget.id));
      showToast(`🗑️ "${deleteTarget.name}" deleted`);
    } catch {
      showToast("❌ Failed to delete zone", "error");
    }
    setDeleting(null);
    setDeleteTarget(null);
  };

  const filtered = geofences
    .filter(
      (z) =>
        z.name.toLowerCase().includes(search.toLowerCase()) ||
        (z.device_name || "").toLowerCase().includes(search.toLowerCase()),
    )
    .filter((z) => {
      if (filterActive === "active") return z.is_active;
      if (filterActive === "inactive") return !z.is_active;
      return true;
    });

  const activeCount = geofences.filter((z) => z.is_active).length;
  const inactiveCount = geofences.length - activeCount;

  if (loading)
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
      </div>
    );

  return (
    <div className="animate-in fade-in duration-300 relative">
      {/* ── Toast ── */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-[100] px-4 py-2.5 rounded-xl text-xs font-semibold shadow-2xl border backdrop-blur-md animate-in slide-in-from-right duration-200
            ${toast.type === "error" ? "bg-red-950/80 border-red-500/30 text-red-300" : "bg-green-950/80 border-green-500/30 text-green-300"}`}
        >
          {toast.msg}
        </div>
      )}

      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-3 mb-5 flex-wrap">
        <div>
          <h2 className="text-lg md:text-xl font-extrabold tracking-tight text-slate-100">
            📍 Safe Zone Management
          </h2>
          <p className="text-[10px] text-gray-500 mt-1">
            {geofences.length} zone{geofences.length !== 1 ? "s" : ""} configured · {activeCount} active
          </p>
        </div>
        <ActionBtn color="#7C3AED" onClick={() => setCreateOpen(true)}>
          + New Zone
        </ActionBtn>
      </div>

      {/* ── Stats strip ── */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {[
          { label: "Total Zones", value: geofences.length, color: "#A78BFA" },
          { label: "Active", value: activeCount, color: "#22C55E" },
          { label: "Inactive", value: inactiveCount, color: "#6B7280" },
        ].map((s) => (
          <div key={s.label} className="bg-[#0D1117] border border-white/5 rounded-2xl p-3 text-center">
            <div className="text-xl font-black" style={{ color: s.color }}>{s.value}</div>
            <div className="text-[9px] text-gray-500 mt-1 uppercase tracking-widest font-bold">{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── Search + Filter ── */}
      <div className="flex gap-2 mb-4 flex-wrap">
        <input
          className="flex-1 min-w-0 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-300 placeholder:text-gray-600 focus:outline-none focus:border-purple-500/50 transition-colors"
          placeholder="Search zones…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="flex gap-1">
          {["all", "active", "inactive"].map((f) => (
            <button
              key={f}
              onClick={() => setFilterActive(f)}
              className={`px-3 py-2 rounded-xl text-[10px] font-bold border transition-colors capitalize ${
                filterActive === f
                  ? "bg-purple-600/20 border-purple-500/40 text-purple-400"
                  : "bg-white/5 border-white/10 text-gray-500 hover:text-gray-300"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* ── Zone list ── */}
      {filtered.length === 0 ? (
        <Card>
          <div className="text-center py-10">
            <div className="text-3xl mb-3">🗺️</div>
            <div className="text-sm font-bold text-slate-400">No zones found</div>
            <div className="text-[11px] text-gray-600 mt-1">
              {geofences.length === 0 ? "Create your first safe zone to get started" : "Try adjusting your search or filter"}
            </div>
            {geofences.length === 0 && (
              <button
                onClick={() => setCreateOpen(true)}
                className="mt-4 px-4 py-2 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-400 text-xs font-bold hover:bg-purple-600/30 transition-colors"
              >
                + Create First Zone
              </button>
            )}
          </div>
        </Card>
      ) : (
        filtered.map((zone) => (
          <ZoneCard
            key={zone.id}
            zone={zone}
            onEdit={setEditZone}
            onDelete={(id) => setDeleteTarget(geofences.find((g) => g.id === id))}
            onToggle={handleToggle}
            deleting={deleting}
            toggling={toggling}
          />
        ))
      )}

      {/* ── Replacement Non-SSR Leaflet Map Container Wrapper ── */}
      <Card title="🗺️ Live Safe Zone Geospatial Grid" className="mt-4">
        <LeafletZonesMap latestLoc={latestLoc} geofences={geofences} />
        {latestLoc && (
          <div className="mt-3 text-[10px] text-gray-500 text-center font-mono">
            Radar Fix: {parseFloat(latestLoc.latitude).toFixed(5)}°N ·{" "}
            {parseFloat(latestLoc.longitude).toFixed(5)}°E (&plusmn;{parseFloat(latestLoc.accuracy).toFixed(1)}m)
          </div>
        )}
      </Card>

      {/* ── Tip card ── */}
      <div className="mt-3 bg-blue-950/30 border border-blue-500/15 rounded-2xl px-4 py-3 text-[10px] text-blue-400/70 leading-relaxed">
        💡 <strong className="text-blue-400">Tip:</strong> Hover a zone card to
        reveal edit, toggle, and delete actions. Use <strong>deactivate</strong> to pause alerts without removing the zone. Recommended radius: <strong>Home 100–150m</strong> · <strong>School 200–300m</strong>.
      </div>

      {/* ── Create Modal ── */}
      <Modal open={createOpen} onClose={() => setCreateOpen(false)}>
        <ZoneForm
          title="Create Zone"
          devices={devices}
          initial={{ ...EMPTY, device: devices[0]?.id || "" }}
          onSubmit={handleCreate}
          onCancel={() => setCreateOpen(false)}
          loading={saving}
        />
      </Modal>

      {/* ── Edit Modal ── */}
      <Modal open={!!editZone} onClose={() => setEditZone(null)}>
        {editZone && (
          <ZoneForm
            title="Edit Zone"
            devices={devices}
            initial={editZone}
            onSubmit={handleEdit}
            onCancel={() => setEditZone(null)}
            loading={saving}
          />
        )}
      </Modal>

      {/* ── Delete Confirm ── */}
      <ConfirmModal
        open={!!deleteTarget}
        zoneName={deleteTarget?.name}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={!!deleting}
      />
    </div>
  );
}