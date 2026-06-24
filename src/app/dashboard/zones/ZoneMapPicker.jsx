"use client";
// app/dashboard/zones/ZoneMapPicker.jsx
// OpenStreetMap (Leaflet) click-to-pick centre-point picker for a geofence.
// Loaded client-only via next/dynamic from zones/page.jsx (Leaflet touches `window`).
import { useMemo } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Circle,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Default Leaflet marker icon (served from the unpkg CDN, matching the other maps).
const PIN_ICON = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// Invisible child that wires up the map click → onPick(lat, lng).
function ClickCapture({ onPick }) {
  useMapEvents({
    click(e) {
      onPick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export default function ZoneMapPicker({ lat, lng, radius, onPick }) {
  const hasPoint = !!(lat && lng);
  const center = useMemo(
    () =>
      hasPoint
        ? [parseFloat(lat), parseFloat(lng)]
        : [23.8103, 90.4125], // Dhaka default
    [hasPoint, lat, lng],
  );

  return (
    <div className="w-full h-48 rounded-xl overflow-hidden border border-white/10">
      <MapContainer
        center={center}
        zoom={15}
        scrollWheelZoom={true}
        className="w-full h-full"
        style={{ background: "#0d1117" }}
      >
        {/* Dark CARTO basemap built on OpenStreetMap data — matches the theme */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        <ClickCapture onPick={onPick} />

        {hasPoint && (
          <>
            <Marker position={[parseFloat(lat), parseFloat(lng)]} icon={PIN_ICON} />
            <Circle
              center={[parseFloat(lat), parseFloat(lng)]}
              radius={parseInt(radius, 10) || 0}
              pathOptions={{
                color: "#7C3AED",
                weight: 2,
                opacity: 0.8,
                fillColor: "#7C3AED",
                fillOpacity: 0.15,
              }}
            />
          </>
        )}
      </MapContainer>
    </div>
  );
}
