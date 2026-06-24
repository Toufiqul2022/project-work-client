// ─── Nirapod — Shared formatting helpers ─────────────────────────────────────
// The backend reports LocationReading.speed in METRES PER SECOND (m/s).
// The UI shows km/h, so convert once here to avoid per-page drift.

const MPS_TO_KMH = 3.6;

// Convert a raw m/s speed (string or number) to km/h. Returns null when absent.
export const toKmh = (mps) =>
  mps == null || mps === "" ? null : parseFloat(mps) * MPS_TO_KMH;

// Convenience: formatted "X.X km/h" string, with a fallback for missing values.
export const formatKmh = (mps, { fallback = "0.0 km/h", digits = 1 } = {}) => {
  const kmh = toKmh(mps);
  return kmh == null ? fallback : `${kmh.toFixed(digits)} km/h`;
};
